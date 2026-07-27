import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

const ROLES = ["admin", "hr_manager", "content_editor", "support_lead"];

function tempPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const bytes = new Uint8Array(14);
  crypto.getRandomValues(bytes);
  let out = "";
  for (const b of bytes) out += chars[b % chars.length];
  return out + "!7";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const url = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  const authHeader = req.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) return json({ error: "Not authenticated" }, 401);

  const svc = createClient(url, serviceKey);

  try {
    const asCaller = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } });
    const { data: { user } } = await asCaller.auth.getUser();
    if (!user) return json({ error: "Not authenticated" }, 401);
    const { data: prof } = await svc.from("profiles").select("role").eq("id", user.id).single();
    if (!prof || prof.role !== "admin") return json({ error: "Only admins can add users." }, 403);
  } catch (_e) {
    return json({ error: "Auth check failed" }, 401);
  }

  let email = "";
  let full_name = "";
  let role = "support_lead";
  try {
    const body = await req.json();
    email = String((body && body.email) || "").trim().toLowerCase();
    full_name = String((body && body.full_name) || "").trim();
    role = String((body && body.role) || "support_lead");
  } catch (_e) { /* validation below */ }

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!email || !emailOk) return json({ error: "A valid email is required." }, 400);
  if (!ROLES.includes(role)) return json({ error: "Invalid role." }, 400);

  const password = tempPassword();
  const { data: created, error } = await svc.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });
  if (error) return json({ error: error.message }, 400);

  await svc.from("profiles").upsert({ id: created.user.id, email, full_name, role });

  return json({ ok: true, email, tempPassword: password });
});
