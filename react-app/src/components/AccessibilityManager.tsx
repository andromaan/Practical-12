import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Map routes to their titles
const routeTitles: Record<string, string> = {
  "/": "Home",
  "/todo": "Todo",
  "/address-book": "Address Book",
};

// List of selectors for focusable elements in order of priority
const focusableSelectors = [
  "input:not([disabled])",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "select:not([disabled])",
  "a[href]",
  "[tabindex]:not([tabindex='-1'])",
  "h1",
];

const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: '0'
}

export default function AccessibilityManager() {
  const location = useLocation();
  const [liveMessage, setLiveMessage] = useState(""); // State to trigger re-render for live region updates

  useEffect(() => {
    // Update document title based on current route
    const title = routeTitles[location.pathname] || "Home";
    document.title = `${title} - React App`;

    setLiveMessage(`${title} page loaded`); // Update live message to announce page load

    // Set focus to first interactive element
    // Priority: input, button, textarea, select, then h1 (default)
    const timeoutId = setTimeout(() => {
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
    }, 1000); // Delay to ensure DOM updates
    return () => clearTimeout(timeoutId); // Cleanup timeout on unmount or route change
  }, [location.pathname]);

  return <div className="sr-only" aria-live="polite" aria-atomic="true" style={srOnlyStyle}>
    <span>&nbsp;</span>{liveMessage}
  </div>; // This component doesn't render anything
}
