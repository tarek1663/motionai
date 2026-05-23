-- Exécuter dans Supabase → SQL Editor
create table if not exists subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null unique,
  plan text default 'free',
  stripe_customer_id text,
  stripe_subscription_id text,
  videos_used integer default 0,
  videos_limit integer default 3,
  period_end timestamp with time zone,
  reset_date timestamp with time zone default (date_trunc('month', now()) + interval '1 month'),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists subscriptions_user_id_idx on subscriptions(user_id);
alter table subscriptions enable row level security;

drop policy if exists "Users manage own subscription" on subscriptions;
create policy "Users manage own subscription" on subscriptions
  for all using (auth.jwt() ->> 'sub' = user_id);
