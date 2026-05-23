"use client";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { DashboardInputScreen } from "@/components/dashboard/dashboard-input-screen";
import { DashboardQuestionsScreen } from "@/components/dashboard/dashboard-questions-screen";
import { DashboardGeneratingScreen } from "@/components/dashboard/dashboard-generating-screen";
import { DashboardDoneScreen } from "@/components/dashboard/dashboard-done-screen";
import { DashboardViewingScreen } from "@/components/dashboard/dashboard-viewing-screen";
import type { UseDashboardReturn } from "@/hooks/use-dashboard";

export function DashboardShell(state: UseDashboardReturn) {
  const {
    screen,
    selectedVideo,
    setScreen,
    setSelectedVideo,
    setPrompt,
    questions,
  } = state;

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
    </div>
  );
}
