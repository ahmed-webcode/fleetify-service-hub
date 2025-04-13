
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
  
  // Initialize sidebar state from localStorage or based on device
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarState");
    if (savedState) {
      setIsCollapsed(savedState === "closed");
    } else {
      setIsCollapsed(isMobile);
    }
  }, [isMobile]);

  // Save sidebar state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("sidebarState", isCollapsed ? "closed" : "open");
  }, [isCollapsed]);
  
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      
      <main className={`flex-1 w-full transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-64'}`}>
        <Header toggleSidebar={() => setIsCollapsed(!isCollapsed)} sidebarOpen={!isCollapsed} />
        <div className="container-centered px-4 py-6 md:px-6 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
