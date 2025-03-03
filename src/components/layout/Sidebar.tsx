
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Car, 
  BarChart3, 
  Fuel, 
  Wrench, 
  FileText, 
  Settings, 
  ChevronRight, 
  Map, 
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigationItems = [
    { icon: BarChart3, label: "Dashboard", path: "/dashboard" },
    { icon: Car, label: "Vehicles", path: "/vehicles" },
    { 
      icon: FileText, 
      label: "Service Requests", 
      path: "/service-requests",
      subItems: [
        { label: "Fleet Service", path: "/service-requests/fleet" },
        { label: "Fuel Service", path: "/service-requests/fuel" },
        { label: "Maintenance", path: "/service-requests/maintenance" }
      ]
    },
    { icon: Map, label: "GPS Tracking", path: "/gps-tracking" },
    { icon: FileText, label: "Reports", path: "/reports" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  if (!mounted) return null;

  const activeItem = navigationItems.find(item => 
    location.pathname === item.path || 
    (item.subItems && item.subItems.some(subItem => location.pathname === subItem.path))
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out animate-fade-in"
          onClick={toggleSidebar}
        />
      )}
      
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 bg-sidebar p-4 border-r border-sidebar-border transition-all duration-300 ease-in-out",
          {
            "translate-x-0": isOpen,
            "-translate-x-full": !isOpen && isMobile,
            "w-20": !isOpen && !isMobile,
          }
        )}
      >
        <div className="flex items-center justify-between mb-8">
          <div className={cn("flex items-center gap-2", { "justify-center w-full": !isOpen && !isMobile })}>
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <Car className="h-5 w-5 text-primary-foreground" />
            </div>
            {(isOpen || isMobile) && (
              <span className="text-lg font-semibold animate-fade-in">FleetHub</span>
            )}
          </div>
          
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-muted-foreground">
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-hidden">
          {navigationItems.map((item) => (
            <div key={item.path} className="relative">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-300 group",
                    {
                      "bg-sidebar-accent text-sidebar-accent-foreground font-medium": isActive,
                      "justify-center": !isOpen && !isMobile,
                    }
                  )
                }
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", { "h-6 w-6": !isOpen && !isMobile })} />
                
                {(isOpen || isMobile) && (
                  <span className="animate-fade-in truncate">{item.label}</span>
                )}
                
                {(isOpen || isMobile) && item.subItems && (
                  <ChevronRight className="h-4 w-4 ml-auto transition-transform group-hover:translate-x-0.5" />
                )}
              </NavLink>
            </div>
          ))}
        </nav>

        <div className={cn("mt-auto", { "flex justify-center": !isOpen && !isMobile })}>
          <div className={cn("flex items-center gap-2 p-2", { "flex-col": !isOpen && !isMobile })}>
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center text-sidebar-foreground">
              <span className="text-sm font-medium">AU</span>
            </div>
            {(isOpen || isMobile) && (
              <div className="animate-fade-in">
                <p className="text-sm font-medium leading-none">Addis Ababa University</p>
                <p className="text-xs text-muted-foreground mt-1">Fleet Management</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
