"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardInputScreen } from "@/components/dashboard/dashboard-input-screen";
import { DashboardQuestionsScreen } from "@/components/dashboard/dashboard-questions-screen";
import { DashboardGeneratingScreen } from "@/components/dashboard/dashboard-generating-screen";
import { DashboardDoneScreen } from "@/components/dashboard/dashboard-done-screen";
import { DashboardViewingScreen } from "@/components/dashboard/dashboard-viewing-screen";
import Toast from "@/components/Toast";
import { CheckCircle2, Clapperboard, CircleX, X } from "lucide-react";
import { colors } from "@/lib/colors";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";

export function DashboardShell(state: UseDashboardReturn) {
  const {
    screen,
    selectedVideo,
    setScreen,
    setSelectedVideo,
    setMode,
    setPrompt,
    questions,
    showUpgrade,
    setShowUpgrade,
    upgradeReason,
    renderNotif,
    dismissRenderNotif,
    toast,
    setToast,
  } = state;

  const accent = colors.accent;

  return (
    <div className="dash-root">
      <DashboardSidebar
        user={state.user}
        videos={state.videos}
        loadingVideos={state.loadingVideos}
        selectedVideo={state.selectedVideo}
        setSelectedVideo={state.setSelectedVideo}
        setScreen={state.setScreen}
        sidebarCollapsed={state.sidebarCollapsed}
        setSidebarCollapsed={state.setSidebarCollapsed}
        resetCreation={state.resetCreation}
        credits={state.credits}
        deleteVideo={state.deleteVideo}
      />

      <main className="dash-main">
        {screen === "viewing" && selectedVideo && (
          <DashboardViewingScreen
            video={selectedVideo}
            onBack={() => {
              setScreen("input");
              setSelectedVideo(null);
            }}
            onRegenerate={(p) => {
              setMode("ai");
              setPrompt(p);
              setScreen("input");
              setSelectedVideo(null);
            }}
          />
        )}

        {screen === "input" && <DashboardInputScreen {...state} />}

        {screen === "questions" && questions.length > 0 && (
          <DashboardQuestionsScreen
            prompt={state.prompt}
            questions={state.questions}
            answers={state.answers}
            otherDetails={state.otherDetails}
            currentQ={state.currentQ}
            setCurrentQ={state.setCurrentQ}
            selectAnswer={state.selectAnswer}
            setOtherDetail={state.setOtherDetail}
            backFromQuestions={state.backFromQuestions}
            finishQuestions={state.finishQuestions}
            skipQuestions={state.skipQuestions}
          />
        )}

        {screen === "generating" && (
          <DashboardGeneratingScreen
            progress={state.progress}
            status={state.status}
            formatDetected={state.formatDetected}
            quality={state.quality}
          />
        )}

        {screen === "done" && (
          <DashboardDoneScreen
            videoUrl={state.videoUrl}
            format={state.format}
            resetCreation={state.resetCreation}
          />
        )}
      </main>

      {showUpgrade && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1000,
            background: "rgba(18,17,15,0.32)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
          }}
          onClick={() => setShowUpgrade(false)}
        >
          <div
            style={{
              background: "#fff",
              border: "1px solid #ebeae8",
              borderRadius: 22,
              padding: "44px 40px",
              maxWidth: 440,
              width: "100%",
              boxShadow: "0 1px 2px rgba(15,23,42,0.04), 0 24px 64px rgba(15,23,42,0.1)",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: "#12110f",
                letterSpacing: "-0.035em",
                marginBottom: 10,
              }}
            >
              Limite atteinte
            </h2>
            <p style={{ fontSize: 14, color: "#a39e98", marginBottom: 28, lineHeight: 1.55 }}>
              {upgradeReason}. Upgrade ton plan pour continuer à générer des vidéos.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
              {[
                { id: "starter", name: "Starter", price: "23€/mois", videos: "60 vidéos/mois", popular: false },
                { id: "pro", name: "Pro", price: "45€/mois", videos: "150 vidéos/mois", popular: true },
                { id: "business", name: "Business", price: "120€/mois", videos: "Illimité", popular: false },
              ].map((plan) => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={async () => {
                    const res = await fetch("/api/stripe/checkout", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ planId: plan.id, billing: "monthly" }),
                    });
                    const data = await res.json();
                    if (data.url) window.location.href = data.url;
                  }}
                  style={{
                    padding: "14px 20px",
                    background: plan.popular ? accent : "#f8f7f5",
                    color: plan.popular ? "#fff" : "#12110f",
                    border: plan.popular ? "none" : "1px solid #ebeae8",
                    borderRadius: 11,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: plan.popular ? `0 4px 20px ${accent}44` : "none",
                  }}
                >
                  <div style={{ textAlign: "left" }}>
                    <div style={{ fontSize: 15, fontWeight: 700 }}>
                      {plan.popular ? "⭐ " : ""}
                      {plan.name}
                    </div>
                    <div style={{ fontSize: 12, opacity: 0.7 }}>{plan.videos}</div>
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800 }}>{plan.price}</div>
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setShowUpgrade(false)}
              style={{
                width: "100%",
                padding: "12px",
                background: "transparent",
                border: "1px solid #e8e8e8",
                borderRadius: 10,
                fontSize: 13,
                color: "#888",
                cursor: "pointer",
              }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {renderNotif && screen !== "generating" && (
        <div
          style={{
            position: "fixed",
            top: 20,
            right: 20,
            zIndex: 999,
            width: 320,
            borderRadius: 16,
            background: "#161616",
            border:
              renderNotif.status === "done"
                ? "1px solid rgba(16,185,129,0.3)"
                : renderNotif.status === "error"
                  ? "1px solid rgba(239,68,68,0.3)"
                  : "1px solid rgba(255,255,255,0.08)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            overflow: "hidden",
            animation: "slideIn 0.3s ease",
          }}
        >
          <style>{`
            @keyframes slideIn {
              from { transform: translateX(100%); opacity: 0; }
              to { transform: translateX(0); opacity: 1; }
            }
          `}</style>

          <div style={{ height: 3, background: "rgba(255,255,255,0.06)" }}>
            <div
              style={{
                height: "100%",
                width: `${renderNotif.progress}%`,
                background: renderNotif.status === "error" ? "#ef4444" : "#10B981",
                transition: "width 0.5s ease",
                boxShadow: renderNotif.status !== "error" ? "0 0 8px rgba(16,185,129,0.5)" : "none",
              }}
            />
          </div>

          <div style={{ padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  flexShrink: 0,
                  background:
                    renderNotif.status === "done"
                      ? "rgba(16,185,129,0.15)"
                      : renderNotif.status === "error"
                        ? "rgba(239,68,68,0.15)"
                        : "rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color:
                    renderNotif.status === "done"
                      ? "#10B981"
                      : renderNotif.status === "error"
                        ? "#ef4444"
                        : "#ffffff",
                }}
              >
                {renderNotif.status === "done" ? (
                  <CheckCircle2 size={18} strokeWidth={2} />
                ) : renderNotif.status === "error" ? (
                  <CircleX size={18} strokeWidth={2} />
                ) : (
                  <Clapperboard size={18} strokeWidth={2} />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                    color:
                      renderNotif.status === "done"
                        ? "#10B981"
                        : renderNotif.status === "error"
                          ? "#ef4444"
                          : "#ffffff",
                    marginBottom: 3,
                  }}
                >
                  {renderNotif.status === "done"
                    ? "Video generee !"
                    : renderNotif.status === "error"
                      ? "Erreur de generation"
                      : `Generation en cours... ${renderNotif.progress}%`}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "rgba(255,255,255,0.35)",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {renderNotif.prompt}
                </div>
              </div>

              <button
                onClick={dismissRenderNotif}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.25)",
                  cursor: "pointer",
                  padding: 0,
                  lineHeight: 1,
                }}
                aria-label="Fermer"
              >
                <X size={16} strokeWidth={2} />
              </button>
            </div>

            {renderNotif.status === "done" && renderNotif.videoUrl && (
              <button
                onClick={() => {
                  dismissRenderNotif();
                  document.getElementById("recent-videos")?.scrollIntoView({ behavior: "smooth" });
                  window.open(renderNotif.videoUrl, "_blank");
                }}
                style={{
                  width: "100%",
                  marginTop: 10,
                  background: "#10B981",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 0",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                }}
              >
                Voir ma video →
              </button>
            )}

            {renderNotif.status === "error" && (
              <button
                onClick={dismissRenderNotif}
                style={{
                  width: "100%",
                  marginTop: 10,
                  background: "rgba(239,68,68,0.15)",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: 8,
                  padding: "8px 0",
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                Reessayer
              </button>
            )}
          </div>
        </div>
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
