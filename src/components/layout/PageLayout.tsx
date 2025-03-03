
import { useState } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

interface PageLayoutProps {
  children: React.ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };

  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <main className="flex-1 transition-all duration-300 ml-0 md:ml-20 pt-16">
        <Header toggleSidebar={toggleSidebar} />
        <div className="px-4 py-6 md:px-6 md:py-8 max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
    </div>
  );
}
