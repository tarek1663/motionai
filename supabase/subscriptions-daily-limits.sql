-- Limites journalières + suivi (table subscriptions — user_id = Clerk ID)
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS videos_today INTEGER DEFAULT 0;
ALTER TABLE subscriptions ADD COLUMN IF NOT EXISTS last_video_date TIMESTAMPTZ;

-- Optionnel : table users si vous l'utilisez ailleurs
ALTER TABLE users ADD COLUMN IF NOT EXISTS videos_this_month INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS videos_today INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_video_date TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS monthly_reset_date DATE DEFAULT CURRENT_DATE;
