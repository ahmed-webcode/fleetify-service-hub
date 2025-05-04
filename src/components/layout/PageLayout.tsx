
import { useState, useEffect } from "react";
import { Header } from "./Header";
import { useIsMobile } from "@/hooks/use-mobile";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({
  children
}: PageLayoutProps) {
  const isMobile = useIsMobile();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header toggleSidebar={() => {}} sidebarOpen={false} />
      <main className="flex-1 p-4 md:p-6">
        {children}
      </main>
    </div>
  );
}
