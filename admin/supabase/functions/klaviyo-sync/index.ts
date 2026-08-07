// klaviyo-sync
// Pushes newsletter subscribers from Supabase into a Klaviyo list.
//
// Runs server side so the Klaviyo private API key is never exposed in the
// browser. Called from the portal's Newsletter page.
//
// Required secrets (Supabase > Edge Functions > Secrets):
//   KLAVIYO_API_KEY   your Klaviyo PRIVATE api key (starts with "pk_")
//   KLAVIYO_LIST_ID   the list to add people to (e.g. R4RBYv = "Newsletter")
// Optional:
//   KLAVIYO_REVISION  API revision date, defaults to 2024-10-15
//
// Body: { "all": false }  -> only subscribers not yet synced (default)
//       { "all": true  }  -> re-send every subscriber

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

const ALLOWED_ROLES = ["admin", "content_editor"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const SUPA_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Verify the caller is a signed-in portal user with the right role.
    // Verify JWT is off on this function, so we do the check ourselves.
    const authHeader = req.headers.get("Authorization") || "";
    if (!authHeader.startsWith("Bearer ")) return json({ error: "Not authenticated" }, 401);

    const admin = createClient(SUPA_URL, SERVICE_KEY);
    try {
      const asCaller = createClient(SUPA_URL, ANON_KEY, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: { user } } = await asCaller.auth.getUser();
      if (!user) return json({ error: "Not authenticated" }, 401);
      const { data: prof } = await admin.from("profiles").select("role").eq("id", user.id).single();
      if (!prof || !ALLOWED_ROLES.includes(prof.role)) {
        return json({ error: "You do not have permission to sync to Klaviyo." }, 403);
      }
    } catch (_e) {
      return json({ error: "Auth check failed" }, 401);
    }

    const KLAVIYO_KEY = Deno.env.get("KLAVIYO_API_KEY");
    const LIST_ID = Deno.env.get("KLAVIYO_LIST_ID");
    const REVISION = Deno.env.get("KLAVIYO_REVISION") || "2024-10-15";

    if (!KLAVIYO_KEY || !LIST_ID) {
      return json({
        error:
          "Klaviyo is not configured yet. Add KLAVIYO_API_KEY and KLAVIYO_LIST_ID as Edge Function secrets.",
      }, 400);
    }

    let all = false;
    try {
      const body = await req.json();
      all = body?.all === true;
    } catch { /* no body is fine */ }

    // Which subscribers to send.
    let q = admin.from("subscribers").select("id, email").order("created_at", { ascending: true });
    if (!all) q = q.is("klaviyo_synced_at", null);
    const { data: subs, error: readErr } = await q;

    if (readErr) return json({ error: `Could not read subscribers: ${readErr.message}` }, 500);
    if (!subs || subs.length === 0) {
      return json({ synced: 0, total: 0, message: "Everyone is already in Klaviyo." });
    }

    // Klaviyo accepts up to 1000 profiles per job; stay comfortably below.
    const CHUNK = 500;
    const syncedIds: string[] = [];
    const failures: string[] = [];

    for (let i = 0; i < subs.length; i += CHUNK) {
      const batch = subs.slice(i, i + CHUNK);

      const payload = {
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            profiles: {
              data: batch.map((s) => ({
                type: "profile",
                attributes: {
                  email: s.email,
                  subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } },
                },
              })),
            },
          },
          relationships: { list: { data: { type: "list", id: LIST_ID } } },
        },
      };

      const res = await fetch("https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/", {
        method: "POST",
        headers: {
          Authorization: `Klaviyo-API-Key ${KLAVIYO_KEY}`,
          revision: REVISION,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        syncedIds.push(...batch.map((s) => s.id));
      } else {
        const detail = await res.text();
        failures.push(`Batch ${i / CHUNK + 1}: HTTP ${res.status} ${detail.slice(0, 300)}`);
      }
    }

    // Mark the ones that made it, so future syncs only send new sign-ups.
    if (syncedIds.length) {
      await admin
        .from("subscribers")
        .update({ klaviyo_synced_at: new Date().toISOString() })
        .in("id", syncedIds);
    }

    if (failures.length && !syncedIds.length) {
      return json({ error: `Klaviyo rejected the sync. ${failures[0]}` }, 502);
    }

    return json({
      synced: syncedIds.length,
      total: subs.length,
      failed: subs.length - syncedIds.length,
      warnings: failures,
      listId: LIST_ID,
    });
  } catch (e) {
    return json({ error: (e as Error).message }, 500);
  }
});
