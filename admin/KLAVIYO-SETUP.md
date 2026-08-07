# Klaviyo sync, setup

The portal stores newsletter sign-ups in Supabase. The **Sync to Klaviyo** button on
the Newsletter page pushes them into your Klaviyo list, where you write and send the
actual campaigns.

The sync runs inside a Supabase Edge Function, never in the browser, so your Klaviyo
private key is never visible to anyone who opens the portal.

---

## 1. Add the column (one time)

Supabase dashboard, **SQL Editor**, new query, paste and run:

```
admin/supabase/klaviyo_sync.sql
```

This adds `subscribers.klaviyo_synced_at` so each sync only sends people who signed up
since the last one.

## 2. Get a Klaviyo private API key

1. Klaviyo, click your account name bottom left, **Settings**
2. **API keys**, then **Create private API key**
3. Name it `Intigris portal sync`
4. Scopes: give it **Write** access to **Lists** and **Profiles**. Nothing else is needed.
5. Copy the key. It starts with `pk_` and Klaviyo shows it only once.

## 3. Store the key as a secret

Supabase dashboard, **Edge Functions**, **Secrets**, add two entries:

| Name | Value |
| --- | --- |
| `KLAVIYO_API_KEY` | the `pk_...` key from step 2 |
| `KLAVIYO_LIST_ID` | `R4RBYv` |

`R4RBYv` is your existing **Newsletter** list (single opt in). To send to a different
list, open it in Klaviyo and copy the ID from the URL, then update this secret.

Optional: `KLAVIYO_REVISION` pins the Klaviyo API version. Leave it unset and the
function uses `2024-10-15`.

## 4. Deploy the function

Supabase dashboard, **Edge Functions**, **Create a new function**:

1. Name it exactly `klaviyo-sync`
2. Paste the contents of `admin/supabase/functions/klaviyo-sync/index.ts`
3. **Deploy**
4. Turn **Verify JWT** OFF. The function checks the signed-in user itself, and this
   lets the browser call it without a preflight failure.

Only portal users with the **admin** or **content editor** role can trigger a sync.

## 5. Try it

Open the portal, go to **Newsletter**. The Klaviyo card shows your total subscriber
count and how many are waiting. Click **Sync to Klaviyo**, then refresh the list in
Klaviyo to confirm they arrived.

---

## How it behaves

- **Sync to Klaviyo** sends only subscribers with no sync stamp yet.
- **Re-sync all** resends everyone, useful after switching lists.
- People are added with marketing consent set to subscribed, matching the sign-up on
  the website.
- The sync only adds and updates. It never removes anyone, and it never overwrites an
  unsubscribe made in Klaviyo.
- Sends in batches of 500, so the list can grow without changes here.

## If a sync fails

The card shows Klaviyo's own error message. The usual causes:

- **not configured yet** means one of the two secrets is missing
- **HTTP 401** means the key is wrong or was revoked
- **HTTP 404** on the list means `KLAVIYO_LIST_ID` does not match a list in this account
- **function is not deployed yet** means step 4 has not run

Nothing is marked as synced when a batch fails, so clicking the button again is always
safe.
