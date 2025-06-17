
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, Settings, LogOut, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  toggleSidebar: () => void;
  sidebarOpen?: boolean;
}

export function Header({ toggleSidebar, sidebarOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">(
    () =>
      (localStorage.getItem("theme") as "light" | "dark") ||
      (window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light")
  );

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleThemeToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const pageTitle = () => {
    const path = location.pathname;
    if (path === "/") return "Home";
    if (path === "/dashboard") return "Dashboard";
    if (path.includes("/service-requests")) {
      if (path.includes("/fleet")) return "Fleet Service Requests";
      if (path.includes("/fuel")) return "Fuel Service Requests";
      if (path.includes("/maintenance")) return "Maintenance Requests";
      return "Service Requests";
    }
    return path.substring(1).charAt(0).toUpperCase() + path.substring(2).replace(/-/g, ' ');
  };

  const handleLogout = async () => {
    logout();
    navigate("/login");
  };

  // These helper functions safely access user properties
  const getUserInitials = () => {
    if (user?.fullName) {
      return user.fullName.split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2);
    }
    return user?.username.substring(0, 2).toUpperCase() || "U";
  };

  const getUserName = () => {
    if (user?.fullName) {
      return user.fullName;
    }
    return user?.username || "User";
  };

  const getUserRole = () => {
    const { selectedRole } = useAuth();
    return selectedRole?.name || "User";
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md border-b transition-shadow duration-200",
        scrolled ? "shadow-sm" : ""
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:flex lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
          <h1 className="text-xl font-medium truncate max-w-[200px] sm:max-w-none">{pageTitle()}</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleThemeToggle}
            className="transition-all duration-300 hover:bg-secondary/60"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative transition-all duration-300 hover:bg-secondary/60"
            onClick={() => navigate('/notifications')}
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full"></span>
            <span className="sr-only">Notifications</span>
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer">
                  <span className="text-sm font-medium">{getUserInitials()}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 z-50">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>{getUserName()}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {getUserRole()}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/settings')} className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
          )}
        </div>
      </div>
    </header>
  );
}
