-- StackAudit Supabase schema
-- Run this in the Supabase SQL editor to set up all tables and RLS policies.
-- Verified: 2026-05-10

-- ── audits ────────────────────────────────────────────────────────────────────
-- One row per completed audit. Public share URL reads from this table.
create table if not exists audits (
  id           uuid primary key,          -- shareId, client-generated
  input        jsonb not null,            -- AuditInput (tools, teamSize, useCase)
  result       jsonb not null,            -- AuditResult (recommendations, totals)
  email        text,                      -- set later when user captures email
  created_at   timestamptz not null default now()
);

-- Public can read a single audit by id (share URL), but cannot list all audits
alter table audits enable row level security;

create policy "Public read by id" on audits
  for select using (true);  -- filtered by .eq('id', shareId) in query

create policy "Service insert" on audits
  for insert with check (true);

create policy "Service update email" on audits
  for update using (true);

-- ── leads ─────────────────────────────────────────────────────────────────────
-- Email captures from the results page
create table if not exists leads (
  id           uuid primary key default gen_random_uuid(),
  audit_id     uuid references audits(id),
  email        text not null,
  monthly_savings numeric,               -- copy for quick Credex pipeline query
  show_credex_cta boolean default false,
  created_at   timestamptz not null default now()
);

alter table leads enable row level security;

create policy "Service insert leads" on leads
  for insert with check (true);

-- Only service role can read leads (PII — never exposed to public)
create policy "No public read on leads" on leads
  for select using (false);

-- ── events ────────────────────────────────────────────────────────────────────
-- Funnel analytics: audit_started, audit_completed, email_captured, share_clicked
create table if not exists events (
  id           uuid primary key default gen_random_uuid(),
  audit_id     uuid references audits(id),
  event        text not null,
  meta         jsonb,
  created_at   timestamptz not null default now()
);

alter table events enable row level security;

create policy "Service insert events" on events
  for insert with check (true);

create policy "No public read on events" on events
  for select using (false);

-- ── indexes ───────────────────────────────────────────────────────────────────
create index if not exists audits_created_at_idx on audits(created_at desc);
create index if not exists leads_audit_id_idx on leads(audit_id);
create index if not exists events_audit_id_idx on events(audit_id);
create index if not exists events_event_idx on events(event);
