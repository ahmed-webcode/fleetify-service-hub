
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
  X,
  ChevronLeft,
  PanelLeft,
  Bell,
  UserCircle,
  LogOut,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  
  // Find out which navigation group is active
  useEffect(() => {
    const currentItem = navigationItems.find(item => 
      location.pathname === item.path || 
      (item.subItems && item.subItems.some(subItem => location.pathname === subItem.path))
    );
    
    if (currentItem && currentItem.subItems) {
      setActiveGroup(currentItem.path);
    } else {
      setActiveGroup(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleGroup = (path: string) => {
    setActiveGroup(prev => prev === path ? null : path);
  };

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
          
          {isMobile ? (
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="text-muted-foreground">
              <X className="h-5 w-5" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleSidebar} 
              className="text-muted-foreground hidden md:flex"
            >
              <PanelLeft className={cn("h-5 w-5 transition-transform", { 
                "rotate-180": !isOpen 
              })} />
            </Button>
          )}
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-hidden">
          <TooltipProvider delayDuration={300}>
            {navigationItems.map((item) => (
              <div key={item.path} className="relative">
                {item.subItems ? (
                  <div>
                    <Button
                      variant="ghost"
                      onClick={() => toggleGroup(item.path)}
                      className={cn(
                        "flex items-center w-full gap-3 px-3 py-2.5 rounded-md text-sidebar-foreground hover:bg-sidebar-accent transition-all duration-300 group",
                        {
                          "bg-sidebar-accent text-sidebar-accent-foreground font-medium": 
                            activeGroup === item.path || location.pathname.startsWith(item.path),
                          "justify-center": !isOpen && !isMobile,
                        }
                      )}
                    >
                      <item.icon className={cn("h-5 w-5 flex-shrink-0", { "h-6 w-6": !isOpen && !isMobile })} />
                      
                      {(isOpen || isMobile) && (
                        <>
                          <span className="animate-fade-in truncate flex-1 text-left">{item.label}</span>
                          <ChevronRight 
                            className={cn(
                              "h-4 w-4 transition-transform", 
                              { "transform rotate-90": activeGroup === item.path }
                            )} 
                          />
                        </>
                      )}
                    </Button>
                    
                    {!isOpen && !isMobile ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="sr-only">{item.label}</span>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-sidebar text-sidebar-foreground border-sidebar-border">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : null}
                    
                    {activeGroup === item.path && (isOpen || isMobile) && (
                      <div className="pl-10 mt-1 space-y-1 animate-fade-in">
                        {item.subItems.map((subItem) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            className={({ isActive }) =>
                              cn(
                                "block text-sm px-2 py-1.5 rounded-md transition-colors hover:bg-sidebar-accent/70",
                                {
                                  "bg-sidebar-accent/80 text-sidebar-accent-foreground font-medium": 
                                    isActive || location.pathname === subItem.path,
                                }
                              )
                            }
                          >
                            {subItem.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <>
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
                    </NavLink>
                    
                    {!isOpen && !isMobile ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="sr-only">{item.label}</span>
                        </TooltipTrigger>
                        <TooltipContent side="right" className="bg-sidebar text-sidebar-foreground border-sidebar-border">
                          {item.label}
                        </TooltipContent>
                      </Tooltip>
                    ) : null}
                  </>
                )}
              </div>
            ))}
          </TooltipProvider>
        </nav>

        {/* Additional features */}
        {(isOpen || isMobile) && (
          <div className="mt-4 space-y-1 border-t border-sidebar-border pt-4 animate-fade-in">
            <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground">
              <Bell className="h-5 w-5" />
              <span>Notifications</span>
              <Badge className="ml-auto" variant="secondary">3</Badge>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground">
              <HelpCircle className="h-5 w-5" />
              <span>Help &amp; Support</span>
            </Button>
          </div>
        )}

        <div className={cn("mt-auto pt-4 border-t border-sidebar-border", { "flex justify-center": !isOpen && !isMobile })}>
          <div className={cn("flex items-center gap-2 p-2", { "flex-col": !isOpen && !isMobile })}>
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <UserCircle className="h-5 w-5" />
            </div>
            {(isOpen || isMobile) && (
              <div className="animate-fade-in flex-1">
                <p className="text-sm font-medium leading-none">Addis Ababa University</p>
                <p className="text-xs text-muted-foreground mt-1">Fleet Management</p>
              </div>
            )}
            {(isOpen || isMobile) && (
              <Button variant="ghost" size="icon" className="text-muted-foreground ml-auto">
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
