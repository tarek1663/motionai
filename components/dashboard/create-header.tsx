"use client";

export function CreateHeader({ subtitle }: { subtitle: string }) {
  return (
    <header className="text-center mb-8 sm:mb-10">
      <h1 className="text-[34px] sm:text-[42px] font-semibold tracking-[-0.025em] text-[#1d1d1f] leading-[1.08]">
        Crée ta vidéo
      </h1>
      <p className="mt-4 text-[17px] font-normal text-[#86868b] max-w-[560px] mx-auto leading-relaxed">
        {subtitle}
      </p>
    </header>
  );
}
