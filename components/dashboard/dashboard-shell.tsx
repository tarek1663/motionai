"use client";

import { useCallback, useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardInputScreen } from "@/components/dashboard/dashboard-input-screen";
import { DashboardQuestionsScreen } from "@/components/dashboard/dashboard-questions-screen";
import { DashboardGeneratingScreen } from "@/components/dashboard/dashboard-generating-screen";
import { DashboardDoneScreen } from "@/components/dashboard/dashboard-done-screen";
import { DashboardViewingScreen } from "@/components/dashboard/dashboard-viewing-screen";
import { DashboardPricingScreen } from "@/components/dashboard/dashboard-pricing-screen";
import { cn } from "@/lib/utils";
import Toast from "@/components/Toast";
import { BoltDashboardBackground } from "@/components/ui/bolt-style-chat";
import type { DashboardVideo } from "@/lib/dashboard/types";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";

type Props = UseDashboardReturn & {
  onStartTour?: () => void;
};

export function DashboardShell(props: Props) {
  const {
    user,
    videos,
    loadingVideos,
    selectedVideo,
    setSelectedVideo,
    viewVideo,
    setScreen,
    setMode,
    setPrompt,
    sidebarCollapsed,
    setSidebarCollapsed,
    resetCreation,
    credits,
    deleteVideo,
    renameVideo,
    onStartTour,
    screen,
    questions,
    toast,
    setToast,
  } = props;

  const handleViewVideo = useCallback(
    (video: DashboardVideo) => {
      viewVideo(video);
    },
    [viewVideo]
  );

  useEffect(() => {
    console.log("📹 Shell screen:", screen, "selectedVideo:", selectedVideo?.id ?? null);
  }, [screen, selectedVideo]);

  const showViewing = screen === "viewing" && selectedVideo != null;

  return (
    <div className="dash-root">
      <BoltDashboardBackground />
      <DashboardSidebar
        user={user}
        videos={videos}
        loadingVideos={loadingVideos}
        selectedVideo={selectedVideo}
        onViewVideo={handleViewVideo}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        resetCreation={resetCreation}
        credits={credits}
        deleteVideo={deleteVideo}
        renameVideo={renameVideo}
        setScreen={setScreen}
        onStartTour={onStartTour}
      />

      <main className="dash-main">
        <div
          className={cn(
            "dash-main__content",
            screen === "pricing" && "dash-main__content--pricing"
          )}
        >
        {showViewing && (
          <DashboardViewingScreen
            video={selectedVideo}
            onBack={() => {
              setSelectedVideo(null);
              setScreen("input");
            }}
            onRegenerate={(p) => {
              setMode("ai");
              setPrompt(p);
              setSelectedVideo(null);
              setScreen("input");
            }}
          />
        )}

        {!showViewing && screen === "input" && <DashboardInputScreen {...props} />}

        {!showViewing && screen === "questions" && questions.length > 0 && (
          <DashboardQuestionsScreen
            prompt={props.prompt}
            questions={props.questions}
            answers={props.answers}
            otherDetails={props.otherDetails}
            currentQ={props.currentQ}
            setCurrentQ={props.setCurrentQ}
            selectAnswer={props.selectAnswer}
            setOtherDetail={props.setOtherDetail}
            backFromQuestions={props.backFromQuestions}
            finishQuestions={props.finishQuestions}
            skipQuestions={props.skipQuestions}
          />
        )}

        {!showViewing && screen === "generating" && (
          <DashboardGeneratingScreen
            progress={props.progress}
            status={props.status}
            formatDetected={props.formatDetected}
            quality={props.quality}
            setScreen={props.setScreen}
          />
        )}

        {!showViewing && screen === "done" && (
          <DashboardDoneScreen
            videoUrl={props.videoUrl}
            format={props.format}
            resetCreation={props.resetCreation}
            showToast={props.showToast}
            credits={props.credits}
          />
        )}

        {!showViewing && screen === "pricing" && (
          <DashboardPricingScreen credits={props.credits} />
        )}
        </div>
      </main>

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
