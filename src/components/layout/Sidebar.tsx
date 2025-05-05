
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth, Permission } from "@/contexts/AuthContext";
import {
  BarChart,
  Car,
  ChevronLeft,
  Clock,
  MapPin,
  Settings,
  User,
  Users,
  Wrench,
  FileText,
  Shield,
  Building,
  Fuel,
  FolderOpenDot,
  Landmark,
  GraduationCap,
  BookOpen,
  PlaneTakeoff
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

interface SidebarItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  permission: string | null;
  children?: SidebarItem[];
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user, hasPermission } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggle = () => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem("sidebarState", !isCollapsed ? "closed" : "open");
  };

  const toggleGroup = (groupName: string) => {
    setOpenGroups({
      ...openGroups,
      [groupName]: !openGroups[groupName]
    });
  };

  // Define all sidebar items with their hierarchical structure
  const sidebarItems: SidebarItem[] = [
    {
      name: "Dashboard",
      icon: <BarChart size={20} />,
      path: "/dashboard",
      permission: null, // Available to all logged-in users
    },
    {
      name: "Vehicles",
      icon: <Car size={20} />,
      path: "/vehicles",
      permission: null, // Available to all logged-in users
    },
    {
      name: "GPS Tracking",
      icon: <MapPin size={20} />,
      path: "/gps-tracking",
      permission: "track_vehicles",
    },
    {
      name: "Trip Requests",
      icon: <PlaneTakeoff size={20} />,
      path: "/trip-requests",
      permission: "request_fleet",
    },
    {
      name: "Fuel Management",
      icon: <Fuel size={20} />,
      path: "/fuel-management",
      permission: null,
    },
    {
      name: "Maintenance",
      icon: <Wrench size={20} />,
      path: "/maintenance-requests",
      permission: "approve_maintenance",
    },
    {
      name: "Request Maintenance",
      icon: <FileText size={20} />,
      path: "/request-maintenance",
      permission: "request_maintenance",
    },
    {
      name: "Report Incident",
      icon: <Shield size={20} />,
      path: "/report-incident",
      permission: "report_incidents",
    },
    {
      name: "Insurance",
      icon: <Shield size={20} />,
      path: "/insurance-management",
      permission: null,
    },
    {
      name: "Reports",
      icon: <BarChart size={20} />,
      path: "/reports",
      permission: "view_reports",
    },
    {
      name: "Organization",
      icon: <Building size={20} />,
      path: "#",
      permission: null,
      children: [
        {
          name: "Colleges",
          icon: <GraduationCap size={20} />,
          path: "/colleges",
          permission: null,
        },
        {
          name: "Institutes",
          icon: <BookOpen size={20} />,
          path: "/institutes",
          permission: null,
        },
        {
          name: "Central Offices",
          icon: <Landmark size={20} />,
          path: "/central-offices",
          permission: null,
        }
      ]
    },
    {
      name: "Users",
      icon: <Users size={20} />,
      path: "#",
      permission: "add_users",
      children: [
        {
          name: "Staff",
          icon: <Users size={20} />,
          path: "/manage-staff",
          permission: "add_users",
        },
        {
          name: "Drivers",
          icon: <User size={20} />,
          path: "/driver-management",
          permission: "manage_drivers",
        }
      ]
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
      permission: null,
    },
  ];

  // Filter sidebar items based on user permissions
  const filteredSidebarItems = sidebarItems.filter((item) => {
    if (!item.permission) return true; // No permission required
    return hasPermission(item.permission as Permission);
  });

  const renderSidebarItems = (items: SidebarItem[]) => {
    return items.map((item) => {
      // Check if item has children and if user has permission to see at least one child
      const hasPermissionForChildren = item.children 
        ? item.children.some(child => !child.permission || hasPermission(child.permission as Permission))
        : true;
        
      if (!hasPermissionForChildren) return null;
      
      // For items with children (dropdown groups)
      if (item.children && item.children.length > 0) {
        const isOpen = openGroups[item.name] || false;
        
        return (
          <div key={item.name} className="w-full">
            <button
              className={cn(
                "flex items-center gap-3 w-full px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                isOpen && "bg-muted text-foreground font-medium",
                isCollapsed && "justify-center px-0"
              )}
              onClick={() => !isCollapsed && toggleGroup(item.name)}
            >
              <span>{item.icon}</span>
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.name}</span>
                  <ChevronLeft 
                    size={16} 
                    className={cn(
                      "transition-transform",
                      isOpen ? "rotate-90" : "-rotate-0"
                    )} 
                  />
                </>
              )}
            </button>
            
            {!isCollapsed && isOpen && (
              <div className="ml-6 pl-3 border-l border-muted mt-1 mb-1 space-y-1">
                {item.children.map(child => {
                  if (child.permission && !hasPermission(child.permission as Permission)) return null;
                  
                  return (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
                          isActive && "bg-muted text-foreground font-medium"
                        )
                      }
                    >
                      <span>{child.icon}</span>
                      <span>{child.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            )}
          </div>
        );
      }
      
      // For regular items (no children)
      return (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors",
              isActive && "bg-muted text-foreground font-medium",
              isCollapsed && "justify-center px-0"
            )
          }
        >
          <span>{item.icon}</span>
          {!isCollapsed && <span>{item.name}</span>}
        </NavLink>
      );
    });
  };

  if (isMobile && !isCollapsed) {
    // Mobile sidebar overlay
    return (
      <div className="fixed inset-0 z-50 bg-black/50">
        <aside
          className={cn(
            "fixed left-0 top-0 h-full w-64 bg-muted/40 border-r shadow-sm p-2 transition-all duration-300 z-50",
          )}
        >
          <div className="flex items-center justify-between h-16 px-3 border-b">
            <NavLink to="/dashboard" className="flex items-center gap-3">
              <span className="text-xl font-bold">AAU Fleet</span>
            </NavLink>
            <button
              onClick={handleToggle}
              className="p-1.5 rounded-lg bg-muted/60 hover:bg-muted"
            >
              <ChevronLeft size={18} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto py-2">
            <nav className="grid gap-1 px-2">
              {renderSidebarItems(filteredSidebarItems)}
            </nav>
          </div>

          <div className="mt-auto p-2 border-t">
            <div className="flex items-center gap-3 p-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {user?.fullName || "User"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.role?.replace(/_/g, " ") || "Guest"}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-muted/40 border-r shadow-sm transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-3 border-b">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          {!isCollapsed && (
            <span className="text-xl font-bold">AAU Fleet</span>
          )}
          {isCollapsed && (
            <span className="text-xl font-bold mx-auto">AAU</span>
          )}
        </NavLink>
        {!isMobile && (
          <button
            onClick={handleToggle}
            className="p-1.5 rounded-lg bg-muted/60 hover:bg-muted"
          >
            <ChevronLeft
              size={18}
              className={cn(
                "transition-transform",
                isCollapsed && "rotate-180"
              )}
            />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <nav className="grid gap-1 px-2">
          {renderSidebarItems(filteredSidebarItems)}
        </nav>
      </div>

      <div className="mt-auto p-2 border-t">
        <div className="flex items-center gap-3 p-3">
          {!isCollapsed ? (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {user?.fullName || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.role?.replace(/_/g, " ") || "Guest"}
              </p>
            </div>
          ) : (
            <div className="mx-auto">
              <User size={20} className="text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
