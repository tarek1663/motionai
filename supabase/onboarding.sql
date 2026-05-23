-- Table onboarding (préférences marque + vidéo par utilisateur Clerk)
create table if not exists public.onboarding (
  user_id text primary key,
  completed boolean not null default false,
  accent_color text not null default '#7C3AED',
  visual_style text not null default 'clean'
    check (visual_style in ('bold', 'clean', 'editorial', 'vibrant')),
  default_voice_id text not null default '21m00Tcm4TlvDq8ikWAM',
  default_format text not null default '9:16',
  default_duration text not null default '30s',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists onboarding_user_id_idx on public.onboarding (user_id);
