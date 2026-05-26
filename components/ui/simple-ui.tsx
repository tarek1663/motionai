"use client";

import { Play } from "lucide-react";
import { useRouter } from "next/navigation";

import { BlurFade } from "@/components/ui/blur-fade";
import {
  MotionHeroPrompt,
  type MotionHeroPromptPayload,
} from "@/components/ui/motion-hero-prompt";

const demoVideos = [
  {
    title: "Spotify Launch",
    tag: "Music App",
    format: "9:16",
    accent: "from-[#f1a43a]/22 via-transparent to-transparent",
    footer: "Hook produit + CTA",
    metric: "15 sec",
    layout: "story",
  },
  {
    title: "Notion Workflow",
    tag: "SaaS Demo",
    format: "1:1",
    accent: "from-white/10 via-transparent to-transparent",
    footer: "UI claire + narration",
    metric: "1:1",
    layout: "square",
  },
  {
    title: "Stripe Offer",
    tag: "Campaign",
    format: "16:9",
    accent: "from-[#f1a43a]/18 via-transparent to-transparent",
    footer: "Offre + bénéfice + preuve",
    metric: "30 sec",
    layout: "wide",
  },
  {
    title: "Linear Feature",
    tag: "Product Video",
    format: "9:16",
    accent: "from-white/8 via-transparent to-transparent",
    footer: "Feature reveal 9:16",
    metric: "9:16",
    layout: "story",
  },
] as const;

export default function SimpleUiHero() {
  const router = useRouter();

  const handleSubmit = (payload: MotionHeroPromptPayload) => {
    const params = new URLSearchParams({
      prompt: payload.prompt,
      duration: payload.duration,
      format: payload.format,
      voice: payload.voiceId,
    });

    if (payload.withSearch) params.set("web", "1");
    if (payload.scriptMode) params.set("mode", "script");
    if (payload.musicEnabled) params.set("music", "1");

    router.push(`/signup?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden border-b border-[#f0f0f0] bg-[#FAFAF8] pb-16 pt-32 md:pb-20 md:pt-36">

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid items-start gap-8 lg:grid-cols-[240px_minmax(0,1fr)_240px] xl:grid-cols-[270px_minmax(0,1fr)_270px]">
          <div className="hidden lg:flex lg:flex-col lg:gap-4 lg:pt-24">
            {demoVideos.slice(0, 2).map((video, index) => (
              <BlurFade key={video.title} delay={0.08 + index * 0.05} inView>
                <DemoVideoCard
                  video={video}
                  onClick={() => router.push("/signup")}
                  className={index === 0 ? "translate-x-2" : "-translate-x-4"}
                />
              </BlurFade>
            ))}
          </div>

          <div className="mx-auto max-w-4xl text-center">
            <header className="mx-auto mb-8 max-w-4xl md:mb-10">
              <BlurFade delay={0.06} inView>
                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#7C3AED]/14 bg-[#F5F3FF] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7C3AED]">
                  Motionr featured launch
                  <span className="text-black/18">/</span>
                  <span className="text-black/55">72+ scenes</span>
                </div>
              </BlurFade>

              <BlurFade delay={0.12} inView>
                <h1 className="mx-auto max-w-[900px] text-balance text-[40px] font-semibold leading-[1.02] tracking-[-0.05em] text-[#273142] sm:text-[52px] lg:text-[68px] xl:text-[76px]">
                  <span className="block">Lance des vidéos qui vendent.</span>
                  <span className="block text-[#7C3AED]">Prêtes en quelques minutes.</span>
                </h1>
              </BlurFade>

              <BlurFade delay={0.16} inView>
                <p className="mx-auto mt-6 max-w-[680px] text-[15px] font-normal leading-[1.7] text-[#8a8a8a] sm:text-[17px]">
                  Motionr transforme une idée en script, voix, rythme et rendu final.
                </p>
              </BlurFade>
            </header>

            <BlurFade delay={0.22} inView>
              <div className="mx-auto max-w-[660px]">
                <MotionHeroPrompt
                  onSubmit={handleSubmit}
                  className="border-[#e8e8e8] bg-white shadow-[0_16px_44px_rgba(15,23,42,0.08)]"
                />
              </div>
            </BlurFade>
          </div>

          <div className="hidden lg:flex lg:flex-col lg:gap-4 lg:pt-24">
            {demoVideos.slice(2).map((video, index) => (
              <BlurFade key={video.title} delay={0.12 + index * 0.05} inView>
                <DemoVideoCard
                  video={video}
                  onClick={() => router.push("/signup")}
                  className={index === 0 ? "-translate-x-2" : "translate-x-4"}
                />
              </BlurFade>
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 lg:hidden">
          {demoVideos.map((video, index) => (
            <BlurFade key={video.title} delay={0.26 + index * 0.05} inView>
              <DemoVideoCard video={video} onClick={() => router.push("/signup")} />
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoVideoCard({
  video,
  onClick,
  className = "",
}: {
  video: (typeof demoVideos)[number];
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative mx-auto w-full overflow-hidden rounded-[28px] border border-[#e8e8e8] bg-[#0b0b0b] text-left shadow-[0_14px_34px_rgba(15,23,42,0.1)] transition-transform ${className}`}
    >
      <div
        className={[
          "relative overflow-hidden",
          video.format === "1:1"
            ? "aspect-square"
            : video.format === "16:9"
              ? "aspect-video"
              : "aspect-[9/16]",
        ].join(" ")}
      >
        <div className={`absolute inset-0 bg-gradient-to-b ${video.accent}`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.1),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent_34%,rgba(0,0,0,0.54)_100%)] transition duration-500 group-hover:scale-[1.03]" />

        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <span className="rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[10px] font-medium text-white/78 backdrop-blur">
            {video.tag}
          </span>
          <span className="rounded-full border border-[#f1a43a]/25 bg-[#f1a43a]/12 px-2.5 py-1 text-[10px] font-medium text-[#f3b35c]">
            {video.format}
          </span>
        </div>

        <VideoPreview layout={video.layout} metric={video.metric} />

        <div className="absolute left-1/2 top-[42%] flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[#f1a43a]/20 bg-[#f1a43a] text-black shadow-[0_10px_24px_rgba(241,164,58,0.2)]">
          <Play className="h-4 w-4 fill-black text-black" />
        </div>

        <div className="absolute inset-x-3 bottom-3 rounded-[20px] border border-white/10 bg-black/42 p-3 backdrop-blur">
          <p className="text-[10px] uppercase tracking-[0.18em] text-white/38">Demo Motionr</p>
          <h3 className="mt-2 text-sm font-semibold tracking-[-0.03em] text-white sm:text-base">
            {video.title}
          </h3>
          <p className="mt-1 text-xs leading-5 text-white/58">{video.footer}</p>
        </div>
      </div>
    </button>
  );
}

function VideoPreview({
  layout,
  metric,
}: {
  layout: (typeof demoVideos)[number]["layout"];
  metric: string;
}) {
  if (layout === "wide") {
    return (
      <div className="absolute inset-0 px-4 pb-20 pt-12">
        <div className="h-full rounded-[22px] border border-white/8 bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white/60" />
              <span className="h-2 w-2 rounded-full bg-white/25" />
              <span className="h-2 w-2 rounded-full bg-white/25" />
            </div>
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/38">
              {metric}
            </span>
          </div>

          <div className="grid h-[calc(100%-24px)] grid-cols-[1.15fr_0.85fr] gap-3">
            <div className="rounded-[18px] border border-white/8 bg-black/28 p-3">
              <div className="mb-3 h-3 w-24 rounded-full bg-white/18" />
              <div className="space-y-2">
                <div className="h-10 rounded-2xl bg-white/8" />
                <div className="h-10 rounded-2xl bg-white/8" />
                <div className="h-16 rounded-2xl bg-white/10" />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <div className="h-1/2 rounded-[18px] bg-white/10" />
              <div className="h-1/2 rounded-[18px] border border-[#f1a43a]/18 bg-[#f1a43a]/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (layout === "square") {
    return (
      <div className="absolute inset-0 px-4 pb-20 pt-12">
        <div className="h-full rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-3 w-20 rounded-full bg-white/18" />
            <span className="text-[10px] uppercase tracking-[0.16em] text-white/38">
              {metric}
            </span>
          </div>
          <div className="grid h-[calc(100%-24px)] gap-3">
            <div className="rounded-[18px] bg-white/10" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-16 rounded-[18px] border border-white/8 bg-black/24" />
              <div className="h-16 rounded-[18px] border border-[#f1a43a]/18 bg-[#f1a43a]/10" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 px-4 pb-20 pt-12">
      <div className="flex h-full flex-col rounded-[24px] border border-white/8 bg-white/[0.04] p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="h-3 w-20 rounded-full bg-white/18" />
          <span className="text-[10px] uppercase tracking-[0.16em] text-white/38">
            {metric}
          </span>
        </div>
        <div className="mb-3 h-20 rounded-[18px] bg-white/10" />
        <div className="space-y-2">
          <div className="h-9 rounded-2xl border border-white/8 bg-black/28" />
          <div className="h-9 rounded-2xl border border-white/8 bg-black/28" />
          <div className="h-16 rounded-2xl border border-[#f1a43a]/18 bg-[#f1a43a]/10" />
        </div>
      </div>
    </div>
  );
}
