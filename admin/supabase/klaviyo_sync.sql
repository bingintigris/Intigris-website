-- =====================================================================
--  Intigris, Klaviyo sync support
--  Adds a column that records when a subscriber was pushed to Klaviyo,
--  so each sync only sends people who are new since last time.
--
--  Run once. Safe to run again.
-- =====================================================================

alter table public.subscribers
  add column if not exists klaviyo_synced_at timestamptz;

comment on column public.subscribers.klaviyo_synced_at is
  'When this subscriber was last pushed to Klaviyo. NULL means not yet synced.';
