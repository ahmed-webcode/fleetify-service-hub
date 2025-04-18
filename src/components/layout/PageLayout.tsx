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

  useEffect(() => {
    localStorage.setItem("sidebarState", isCollapsed ? "closed" : "open");
  }, [isCollapsed]);
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        <Header toggleSidebar={() => setIsCollapsed(!isCollapsed)} sidebarOpen={!isCollapsed} />
        <main className="flex-1 w-full p-0 md:p-0 max-w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
