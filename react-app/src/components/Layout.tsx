import { Outlet } from "react-router-dom";
import AccessibilityManager from "./AccessibilityManager";
import Navigation from "./Navigation";

function Layout() {
  return (
    <>
      <header>
        <Navigation />
      </header>
      <AccessibilityManager />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default Layout;
