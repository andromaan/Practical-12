import { useEffect } from "react";
import { useLocation, useMatches } from "react-router-dom";

interface RouteHandle {
  title?: string;
}

export default function AccessibilityManager() {
  const location = useLocation();
  const matches = useMatches();

  useEffect(() => {
    // Update document title based on current route
    const routeMatch = matches.find(
      (match) => (match.handle as RouteHandle | undefined)?.title
    );
    const title = (routeMatch?.handle as RouteHandle | undefined)?.title || "Home";
    document.title = `${title} - React App`;

    // Set focus to first interactive element
    // Priority: input, button, textarea, select, then h1 (default)
    setTimeout(() => {
      const focusableSelectors = [
        "input:not([disabled])",
        "button:not([disabled])",
        "textarea:not([disabled])",
        "select:not([disabled])",
        "a[href]",
        "[tabindex]:not([tabindex='-1'])",
        "h1",
      ];

      for (const selector of focusableSelectors) {
        const element = document.querySelector(selector) as HTMLElement;
        if (element) {
          // Scroll into view smoothly
          element.scrollIntoView({ behavior: "smooth", block: "start" });
          // Set focus
          element.focus();
          break;
        }
      }
    }, 0);
  }, [location, matches]);

  return null; // This component doesn't render anything
}
