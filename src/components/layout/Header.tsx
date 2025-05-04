
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, Menu, Search, X, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
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
  const [searchVisible, setSearchVisible] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user: mockUser, logout: mockLogout } = useAuth();
  const { user: supabaseUser, signOut: supabaseSignOut } = useSupabaseAuth();
  
  const user = supabaseUser || mockUser;

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
    if (supabaseUser) {
      await supabaseSignOut();
    } else if (mockUser) {
      mockLogout();
    }
    navigate("/login");
  };

  const getUserInitials = () => {
    if (supabaseUser?.user_metadata?.full_name) {
      return supabaseUser.user_metadata.full_name.split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2);
    } else if (mockUser?.fullName) {
      return mockUser.fullName.split(" ")
        .map(n => n[0])
        .join("")
        .slice(0, 2);
    }
    return "U";
  };

  const getUserName = () => {
    if (supabaseUser?.user_metadata?.full_name) {
      return supabaseUser.user_metadata.full_name;
    } else if (mockUser?.fullName) {
      return mockUser.fullName;
    }
    return "User";
  };

  const getUserRole = () => {
    if (supabaseUser?.user_metadata?.role) {
      return supabaseUser.user_metadata.role.replace('_', ' ');
    } else if (mockUser?.role) {
      return mockUser.role.replace('_', ' ');
    }
    return "User";
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
          <h1 className="text-xl font-medium truncate max-w-[200px] sm:max-w-none">{pageTitle()}</h1>
        </div>

        <div className="flex items-center gap-2">
          {searchVisible ? (
            <div className="relative animate-fade-in w-full max-w-[200px] sm:max-w-[300px]">
              <Input
                placeholder="Search..."
                className="pr-8 bg-secondary/80 backdrop-blur-md"
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
