
import { useState, useEffect } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
interface PageLayoutProps {
  children: React.ReactNode;
}
export function PageLayout({
  children
}: PageLayoutProps) {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    // Get saved preference from localStorage if available
    const savedState = localStorage.getItem("sidebarState");
    // Default to open on desktop, closed on mobile
    return savedState ? savedState === "closed" : isMobile;
  });

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebarState", isCollapsed ? "closed" : "open");
  }, [isCollapsed]);
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <main className="flex-1 max-w-full overflow-x-hidden">
        <Header toggleSidebar={() => setIsCollapsed(!isCollapsed)} sidebarOpen={!isCollapsed} />
        <div className="px-4 py-6 md:px-6 md:py-8 flex flex-col items-center">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
