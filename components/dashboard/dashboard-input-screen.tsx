"use client";

import { INPUT_TABS, PROMPT_SUGGESTIONS } from "@/components/dashboard/dashboard-categories";
import { DashboardIcon } from "@/components/dashboard/dashboard-icon";
import { PromptComposer } from "@/components/dashboard/prompt-composer";
import { ScreenshotComposer } from "@/components/dashboard/screenshot-composer";
import { copy } from "@/lib/dashboard/copy";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";

type Props = UseDashboardReturn;

export function DashboardInputScreen(props: Props) {
  const { activeTab, setActiveTab, setPrompt, error } = props;

  return (
    <div className="dash-content dash-content--compact">
      <h1 className="dash-hero-title">{copy.heroTitle}</h1>
      <p className="dash-hero-hint">{copy.heroHint}</p>

      <div className="dash-segmented dash-segmented--compact">
        {INPUT_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onMouseDown={() => setActiveTab(tab.id)}
            className={`dash-segment dash-segment--compact${activeTab === tab.id ? " active" : ""}`}
          >
            <DashboardIcon
              icon={tab.Icon}
              size={15}
              color={activeTab === tab.id ? "var(--dash-text)" : "var(--dash-text-tertiary)"}
            />
            <span className="dash-segment-label">{tab.label}</span>
            <span className="dash-segment-hint">{tab.hint}</span>
          </button>
        ))}
      </div>

      {activeTab === "prompt" && (
        <>
          <PromptComposer {...props} />
          <p className="dash-field-hint dash-field-hint--label dash-suggestions-label">
            {copy.suggestionsLabel}
          </p>
          <div className="dash-chips">
            {PROMPT_SUGGESTIONS.map((cat) => (
              <button
                key={cat.label}
                type="button"
                className="dash-chip"
                onMouseDown={() => setPrompt(cat.label)}
              >
                <DashboardIcon icon={cat.Icon} size={14} />
                {cat.label}
              </button>
            ))}
          </div>
        </>
      )}
      {activeTab === "screenshot" && <ScreenshotComposer {...props} />}
      {error && <div className="dash-error">{error}</div>}
    </div>
  );
}
