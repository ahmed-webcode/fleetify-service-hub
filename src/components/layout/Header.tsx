
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Bell, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen?: boolean;
}

export function Header({ toggleSidebar, sidebarOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [searchVisible, setSearchVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Home";
    return path.substring(1).charAt(0).toUpperCase() + path.substring(2);
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 py-3 px-4 md:px-6 flex items-center justify-between",
        {
          "bg-background/80 backdrop-blur-md shadow-sm": scrolled,
          "bg-transparent": !scrolled,
        }
      )}
    >
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        
        <h1 className="text-xl font-medium hidden md:block">{pageTitle()}</h1>
      </div>

      <div className="flex items-center gap-2">
        {searchVisible ? (
          <div className="relative animate-fade-in md:w-64 w-full">
            <Input
              placeholder="Search..."
              className="pr-8 border-none bg-secondary/80 backdrop-blur-md focus-visible:ring-1"
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0"
              onClick={() => setSearchVisible(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close search</span>
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSearchVisible(true)}
            className="transition-all duration-300 hover:bg-secondary/60"
          >
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="relative transition-all duration-300 hover:bg-secondary/60"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
          <span className="sr-only">Notifications</span>
        </Button>

        <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer">
          <span className="text-sm font-medium">AA</span>
        </div>
      </div>
    </header>
  );
}
