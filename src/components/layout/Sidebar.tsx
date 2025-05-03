import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth, Permission } from "@/contexts/AuthContext";
import {
  BarChart3,
  Car,
  ChevronLeft,
  Clock,
  Cog,
  FolderHeart,
  Fuel,
  Home,
  MapPin,
  Settings,
  User,
  Users,
  Wrench,
  FileWarning,
  Shield,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user, hasPermission } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

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

  const sidebarItems = [
    {
      name: "Dashboard",
      icon: <Home size={20} />,
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
      icon: <Clock size={20} />,
      path: "/trip-requests",
      permission: "request_fleet",
    },
    {
      name: "Fuel Management",
      icon: <Fuel size={20} />,
      path: "/fuel-management",
      permission: null, // Show to all, but actions within page may be restricted
    },
    {
      name: "Service Requests",
      icon: <FolderHeart size={20} />,
      path: "/service-requests",
      permission: null, // Show to all, but actions within page may be restricted
    },
    {
      name: "Maintenance",
      icon: <Wrench size={20} />,
      path: "/maintenance-requests",
      permission: "approve_maintenance",
    },
    {
      name: "Request Maintenance",
      icon: <Wrench size={20} />,
      path: "/request-maintenance",
      permission: "request_maintenance",
    },
    {
      name: "Report Incident",
      icon: <FileWarning size={20} />,
      path: "/report-incident",
      permission: "report_incidents",
    },
    {
      name: "Insurance Management",
      icon: <Shield size={20} />,
      path: "/insurance-management",
      permission: null, // Available to all logged-in users
    },
    {
      name: "Reports",
      icon: <BarChart3 size={20} />,
      path: "/reports",
      permission: "view_reports",
    },
    {
      name: "Manage Staff",
      icon: <Users size={20} />,
      path: "/manage-staff",
      permission: "add_users",
    },
    {
      name: "Driver Management",
      icon: <User size={20} />,
      path: "/driver-management",
      permission: "manage_drivers",
    },
    {
      name: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
      permission: null, // Available to all logged-in users
    },
  ];

  const userLinks = [
    {
      name: "Notifications",
      icon: <Bell size={20} />,
      path: "/notifications",
      permission: null,
    },
  ];

  // Filter sidebar items based on user permissions
  const filteredSidebarItems = sidebarItems.filter((item) => {
    if (!item.permission) return true; // No permission required
    return hasPermission(item.permission as Permission);
  });

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
          {filteredSidebarItems.map((item) => (
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
          ))}
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

function Bell(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
