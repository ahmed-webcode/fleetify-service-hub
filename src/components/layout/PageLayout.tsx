
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem("sidebarState");
    if (savedState) {
      setIsCollapsed(savedState === "closed");
    } else {
      setIsCollapsed(isMobile);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem("sidebarState", !isCollapsed ? "closed" : "open");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header toggleSidebar={toggleSidebar} sidebarOpen={!isCollapsed} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className="flex-1 p-4 md:p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
