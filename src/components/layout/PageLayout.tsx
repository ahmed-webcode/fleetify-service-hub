import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const isMobile = useIsMobile();
  
  // State for DESKTOP sidebar (collapsed/expanded)
  const [isCollapsed, setIsCollapsed] = useState(false);
  // State for MOBILE sidebar (open/closed overlay)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // This effect manages the desktop sidebar's persisted state
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarState");
    if (savedState) {
      setIsCollapsed(savedState === "closed");
    }
  }, []); // Run only on mount

  // This function now handles both mobile and desktop toggles
  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileMenuOpen((prev) => !prev);
    } else {
      setIsCollapsed((prev) => {
        const newState = !prev;
        localStorage.setItem("sidebarState", newState ? "closed" : "open");
        return newState;
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Pass the correct toggle function to the header */}
      <Header toggleSidebar={toggleSidebar} />
      {/* FIX: Removed 'overflow-hidden' to allow sticky positioning to work */}
      <div className="flex flex-1">
        <Sidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobile={isMobile} // Pass the isMobile flag
          isMobileOpen={isMobileMenuOpen} // Pass mobile state
          setIsMobileOpen={setIsMobileMenuOpen} // Pass mobile state setter
        />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}