export interface ScrollMetrics {
  scrollTop: number;
  scrollHeight: number;
  clientHeight: number;
}

const ARROW_SCROLL_PX = 48;
const MIN_PAGE_SCROLL_PX = 120;

export function getSolutionScrollTarget(
  key: string,
  metrics: ScrollMetrics,
): number | null {
  const maxScrollTop = Math.max(0, metrics.scrollHeight - metrics.clientHeight);
  if (maxScrollTop === 0) return null;

  const currentTop = Math.min(maxScrollTop, Math.max(0, metrics.scrollTop));
  const pageStep = Math.max(MIN_PAGE_SCROLL_PX, Math.round(metrics.clientHeight * 0.9));
  let target: number;

  switch (key) {
    case "ArrowUp":
      target = currentTop - ARROW_SCROLL_PX;
      break;
    case "ArrowDown":
      target = currentTop + ARROW_SCROLL_PX;
      break;
    case "PageUp":
      target = currentTop - pageStep;
      break;
    case "PageDown":
      target = currentTop + pageStep;
      break;
    case "Home":
      target = 0;
      break;
    case "End":
      target = maxScrollTop;
      break;
    default:
      return null;
  }

  return Math.min(maxScrollTop, Math.max(0, target));
}
