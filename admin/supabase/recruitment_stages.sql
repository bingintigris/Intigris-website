-- =====================================================================
--  Intigris Admin Portal — Recruitment stage rename
--  Moves existing applicants onto the new 6-step pipeline (matches the
--  public Application Procedure page) and sets the new default.
--  Dollar-quoted; safe to re-run. Run in the SQL Editor.
--
--  New stages: application, intro, office, case, offer, onboarding (+ rejected)
-- =====================================================================

update public.job_applications set status = $q$application$q$ where status in ($q$new$q$, $q$reviewed$q$);
update public.job_applications set status = $q$office$q$       where status = $q$interview$q$;
update public.job_applications set status = $q$onboarding$q$   where status = $q$hired$q$;
-- rejected stays as-is.

-- New applicants (e.g. from the future public careers form) start at "application".
alter table public.job_applications alter column status set default $q$application$q$;
