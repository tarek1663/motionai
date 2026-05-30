export type TourStep = {
  id: string;
  title: string;
  desc: string;
  position: "top" | "bottom" | "left" | "right";
};

export function getTourTargetId(stepId: string) {
  return `tour-${stepId}`;
}

export function isTourTargetVisible(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.width < 1 && rect.height < 1) return false;

  const style = window.getComputedStyle(el);
  if (style.display === "none" || style.visibility === "hidden") return false;
  if (parseFloat(style.opacity) === 0) return false;

  return true;
}

export function filterAvailableTourSteps(steps: TourStep[]): TourStep[] {
  if (typeof document === "undefined") return steps;

  return steps.filter((step) => {
    const el = document.getElementById(getTourTargetId(step.id));
    return el != null && isTourTargetVisible(el);
  });
}
