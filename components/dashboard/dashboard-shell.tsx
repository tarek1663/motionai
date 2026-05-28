"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardInputScreen } from "@/components/dashboard/dashboard-input-screen";
import { DashboardQuestionsScreen } from "@/components/dashboard/dashboard-questions-screen";
import { DashboardGeneratingScreen } from "@/components/dashboard/dashboard-generating-screen";
import { DashboardDoneScreen } from "@/components/dashboard/dashboard-done-screen";
import { DashboardViewingScreen } from "@/components/dashboard/dashboard-viewing-screen";
import Toast from "@/components/Toast";
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
            setScreen={state.setScreen}
          />
        )}

        {screen === "done" && (
          <DashboardDoneScreen
            videoUrl={state.videoUrl}
            format={state.format}
            resetCreation={state.resetCreation}
            showToast={state.showToast}
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
