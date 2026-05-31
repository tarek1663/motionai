"use client";

import { useEffect } from "react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardInputScreen } from "@/components/dashboard/dashboard-input-screen";
import { DashboardQuestionsScreen } from "@/components/dashboard/dashboard-questions-screen";
import { DashboardGeneratingScreen } from "@/components/dashboard/dashboard-generating-screen";
import { DashboardDoneScreen } from "@/components/dashboard/dashboard-done-screen";
import { DashboardViewingScreen } from "@/components/dashboard/dashboard-viewing-screen";
import Toast from "@/components/Toast";
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

  useEffect(() => {
    console.log("📹 Shell passing videos:", videos?.length);
  }, [videos]);

  return (
    <div className="dash-root">
      <DashboardSidebar
        user={user}
        videos={videos}
        loadingVideos={loadingVideos}
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
        setScreen={setScreen}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        resetCreation={resetCreation}
        credits={credits}
        deleteVideo={deleteVideo}
        renameVideo={renameVideo}
        onStartTour={onStartTour}
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

        {screen === "input" && <DashboardInputScreen {...props} />}

        {screen === "questions" && questions.length > 0 && (
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

        {screen === "generating" && (
          <DashboardGeneratingScreen
            progress={props.progress}
            status={props.status}
            formatDetected={props.formatDetected}
            quality={props.quality}
            setScreen={props.setScreen}
          />
        )}

        {screen === "done" && (
          <DashboardDoneScreen
            videoUrl={props.videoUrl}
            format={props.format}
            resetCreation={props.resetCreation}
            showToast={props.showToast}
            credits={props.credits}
          />
        )}
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
