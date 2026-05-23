"use client";

import type { ReactNode } from "react";
import { CREATE_CARD, CREATE_CARD_BODY, CREATE_LAYOUT_CLASS } from "@/components/dashboard/ui";
import { CreateHeader } from "@/components/dashboard/create-header";
import { CreateTabs } from "@/components/dashboard/create-tabs";

type TabId = "prompt" | "screenshot";

export function CreateWorkspace({
  activeTab,
  onTabChange,
  subtitle,
  children,
  footer,
}: {
  activeTab: TabId;
  onTabChange: (id: TabId) => void;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className={CREATE_LAYOUT_CLASS}>
      <CreateHeader subtitle={subtitle} />
      <div className={CREATE_CARD}>
        <CreateTabs active={activeTab} onChange={onTabChange} />
        <div className={CREATE_CARD_BODY}>{children}</div>
      </div>
      {footer}
    </div>
  );
}
