import { Resend } from "resend";

const FROM = "Motionr <hello@motionr.app>";
const BASE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://motionr.app";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }
  return new Resend(apiKey);
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── WELCOME EMAIL ────────────────────────────────────
export async function sendWelcomeEmail(email: string, firstName: string) {
  const name = escapeHtml(firstName || "there");
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Welcome to Motionr 🎬",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Motionr</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">

    <div style="margin-bottom:40px;">
      <div style="display:inline-flex;align-items:center;gap:10px;">
        <div style="width:36px;height:36px;background:#ef4444;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#fff;">M</div>
        <span style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.04em;">Motionr</span>
      </div>
    </div>

    <div style="margin-bottom:40px;">
      <h1 style="font-size:40px;font-weight:800;color:#fff;letter-spacing:-0.05em;line-height:1.05;margin:0 0 16px;">
        Welcome, ${name}. 🎬
      </h1>
      <p style="font-size:17px;color:rgba(255,255,255,0.55);line-height:1.6;margin:0;">
        You're all set. Your account is ready and <strong style="color:#fff;">3 free videos</strong> are waiting for you.
      </p>
    </div>

    <div style="background:#161616;border-radius:16px;padding:28px;margin-bottom:32px;border:1px solid rgba(255,255,255,0.06);">
      <p style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.3);letter-spacing:0.1em;text-transform:uppercase;margin:0 0 20px;">Get started in 3 steps</p>
      ${[
        {
          num: "01",
          title: "Describe your video",
          desc: "Tell Motionr what you want — a product promo, motivation clip, or anything else.",
        },
        {
          num: "02",
          title: "Answer a few questions",
          desc: "Duration, quality, color — the AI customizes everything for you.",
        },
        {
          num: "03",
          title: "Download your video",
          desc: "Your 1080p motion design video is ready in minutes.",
        },
      ]
        .map(
          (s) => `
        <div style="display:flex;gap:16px;margin-bottom:16px;align-items:flex-start;">
          <div style="min-width:32px;height:32px;background:rgba(239,68,68,0.12);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:800;color:#ef4444;">${s.num}</div>
          <div>
            <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:4px;">${s.title}</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.4);line-height:1.5;">${s.desc}</div>
          </div>
        </div>
      `
        )
        .join("")}
    </div>

    <a href="${BASE_URL}/dashboard" style="display:block;background:#ef4444;color:#fff;text-align:center;padding:16px;border-radius:12px;font-size:16px;font-weight:700;text-decoration:none;letter-spacing:-0.02em;margin-bottom:32px;box-shadow:0 8px 24px rgba(239,68,68,0.3);">
      Create my first video →
    </a>

    <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;">
      <p style="font-size:12px;color:rgba(255,255,255,0.2);line-height:1.6;margin:0;">
        You're receiving this because you signed up for Motionr.<br>
        <a href="${BASE_URL}/privacy" style="color:rgba(255,255,255,0.3);">Privacy Policy</a> ·
        <a href="${BASE_URL}/terms" style="color:rgba(255,255,255,0.3);">Terms</a>
      </p>
    </div>

  </div>
</body>
</html>`,
  });
}

// ─── CANCELLATION EMAIL ───────────────────────────────
export async function sendCancellationEmail(
  email: string,
  firstName: string,
  planName: string,
  periodEnd: string
) {
  const name = escapeHtml(firstName || "there");
  const plan = escapeHtml(planName || "Starter");
  const end = escapeHtml(periodEnd);
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Your Motionr subscription has been cancelled",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">

    <div style="margin-bottom:40px;">
      <div style="display:inline-flex;align-items:center;gap:10px;">
        <div style="width:36px;height:36px;background:#ef4444;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#fff;">M</div>
        <span style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.04em;">Motionr</span>
      </div>
    </div>

    <div style="margin-bottom:32px;">
      <h1 style="font-size:36px;font-weight:800;color:#fff;letter-spacing:-0.05em;line-height:1.05;margin:0 0 16px;">
        We're sorry to see you go, ${name}.
      </h1>
      <p style="font-size:16px;color:rgba(255,255,255,0.55);line-height:1.6;margin:0;">
        Your <strong style="color:#fff;">${plan}</strong> subscription has been cancelled. You'll keep access until <strong style="color:#fff;">${end}</strong>.
      </p>
    </div>

    <div style="background:#161616;border-radius:16px;padding:28px;margin-bottom:24px;border:1px solid rgba(255,255,255,0.06);">
      <p style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.3);letter-spacing:0.1em;text-transform:uppercase;margin:0 0 16px;">What you'll lose access to</p>
      ${[
        "Unlimited video generations",
        "Script mode",
        "No watermark",
        "Priority rendering",
        "HD 1080p quality",
      ]
        .map(
          (item) => `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
          <div style="width:6px;height:6px;border-radius:50%;background:rgba(239,68,68,0.8);flex-shrink:0;"></div>
          <div style="font-size:14px;color:rgba(255,255,255,0.5);">${item}</div>
        </div>
      `
        )
        .join("")}
    </div>

    <div style="background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:16px;padding:24px;margin-bottom:24px;">
      <p style="font-size:14px;font-weight:700;color:#ef4444;margin:0 0 8px;">Changed your mind?</p>
      <p style="font-size:14px;color:rgba(255,255,255,0.55);margin:0 0 16px;line-height:1.5;">
        You can reactivate your subscription anytime. All your videos and settings are saved.
      </p>
      <a href="${BASE_URL}/pricing" style="display:inline-block;background:#ef4444;color:#fff;padding:12px 24px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none;">
        Reactivate my subscription →
      </a>
    </div>

    <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;">
      <p style="font-size:12px;color:rgba(255,255,255,0.2);line-height:1.6;margin:0;">
        If you have feedback, reply to this email — we read everything.<br>
        <a href="${BASE_URL}/privacy" style="color:rgba(255,255,255,0.3);">Privacy Policy</a> ·
        <a href="${BASE_URL}/terms" style="color:rgba(255,255,255,0.3);">Terms</a>
      </p>
    </div>

  </div>
</body>
</html>`,
  });
}

// ─── INACTIVITY EMAIL ─────────────────────────────────
export async function sendInactivityEmail(email: string, firstName: string) {
  const name = escapeHtml(firstName || "there");
  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "Miss us? Here's some inspiration 👋",
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'SF Pro Display','Helvetica Neue',sans-serif;">
  <div style="max-width:560px;margin:0 auto;padding:48px 24px;">

    <div style="margin-bottom:40px;">
      <div style="display:inline-flex;align-items:center;gap:10px;">
        <div style="width:36px;height:36px;background:#ef4444;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;font-size:16px;font-weight:900;color:#fff;">M</div>
        <span style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.04em;">Motionr</span>
      </div>
    </div>

    <div style="margin-bottom:32px;">
      <h1 style="font-size:36px;font-weight:800;color:#fff;letter-spacing:-0.05em;line-height:1.05;margin:0 0 16px;">
        Hey ${name}, miss us? 👋
      </h1>
      <p style="font-size:16px;color:rgba(255,255,255,0.55);line-height:1.6;margin:0;">
        You haven't created a video in a while. Here are some ideas to get you started.
      </p>
    </div>

    <div style="background:#161616;border-radius:16px;padding:28px;margin-bottom:24px;border:1px solid rgba(255,255,255,0.06);">
      <p style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.3);letter-spacing:0.1em;text-transform:uppercase;margin:0 0 20px;">Video ideas for you</p>
      ${[
        { emoji: "🚀", title: "Product launch", desc: "Announce a new feature or product" },
        { emoji: "📊", title: "Data story", desc: "Turn your metrics into a compelling video" },
        { emoji: "💡", title: "Tutorial", desc: "Explain your product in 30 seconds" },
        { emoji: "🎯", title: "Social ad", desc: "Create a scroll-stopping Reels or TikTok" },
      ]
        .map(
          (idea) => `
        <div style="display:flex;gap:14px;margin-bottom:16px;align-items:flex-start;">
          <div style="min-width:36px;height:36px;background:rgba(239,68,68,0.1);border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;">${idea.emoji}</div>
          <div>
            <div style="font-size:14px;font-weight:700;color:#fff;margin-bottom:3px;">${idea.title}</div>
            <div style="font-size:13px;color:rgba(255,255,255,0.4);">${idea.desc}</div>
          </div>
        </div>
      `
        )
        .join("")}
    </div>

    <a href="${BASE_URL}/dashboard" style="display:block;background:#ef4444;color:#fff;text-align:center;padding:16px;border-radius:12px;font-size:16px;font-weight:700;text-decoration:none;letter-spacing:-0.02em;margin-bottom:32px;box-shadow:0 8px 24px rgba(239,68,68,0.3);">
      Create a video now →
    </a>

    <div style="border-top:1px solid rgba(255,255,255,0.06);padding-top:24px;">
      <p style="font-size:12px;color:rgba(255,255,255,0.2);line-height:1.6;margin:0;">
        You're receiving this because you haven't been active on Motionr lately.<br>
        <a href="${BASE_URL}/privacy" style="color:rgba(255,255,255,0.3);">Unsubscribe</a> ·
        <a href="${BASE_URL}/privacy" style="color:rgba(255,255,255,0.3);">Privacy Policy</a>
      </p>
    </div>

  </div>
</body>
</html>`,
  });
}
