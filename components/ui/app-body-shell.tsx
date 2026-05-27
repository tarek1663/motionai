"use client";

import { useState, type ReactNode } from "react";
import { GlobalAnnouncementBar } from "@/components/ui/global-announcement-bar";

export function AppBodyShell({ children }: { children: ReactNode }) {
  const [barVisible, setBarVisible] = useState(false);

  return (
    <>
      <GlobalAnnouncementBar onEligibleChange={setBarVisible} />
      <div style={{ paddingTop: barVisible ? 44 : 0, transition: "padding-top 0.2s ease" }}>
        {children}
      </div>
    </>
  );
}
