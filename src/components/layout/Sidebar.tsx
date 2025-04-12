
import {
  LayoutDashboard,
  Settings,
  Users,
  Calendar,
  Car,
  MapPin,
  FileText,
  Bell,
  ArrowLeft,
  Fuel,
  UserPlus,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

type Permission = 'track_vehicles' | 'request_fleet' | 'view_reports' | 'add_users' | 'add_vehicle';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();

  const sidebarItems = [
    {
      path: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      permission: null as null,
    },
    {
      path: "/vehicles",
      icon: Car,
      label: "Vehicles",
      permission: null as null,
    },
    {
      path: "/gps-tracking",
      icon: MapPin,
      label: "GPS Tracking",
      permission: "track_vehicles" as Permission,
    },
    {
      path: "/trip-requests",
      icon: Calendar,
      label: "Trip Requests",
      permission: "request_fleet" as Permission,
    },
    {
      path: "/fuel-management",
      icon: Fuel,
      label: "Fuel Management",
      permission: null as null,
    },
    // Service Requests page removed as requested
    {
      path: "/reports",
      icon: FileText,
      label: "Reports",
      permission: "view_reports" as Permission,
    },
    {
      path: "/manage-users",
      icon: UserPlus,
      label: "Manage Users",
      permission: "add_users" as Permission,
    },
    {
      path: "/manage-staff",
      icon: Users,
      label: "Manage Staff",
      permission: "add_users" as Permission,
    },
    {
      path: "/driver-management",
      icon: ShieldCheck,
      label: "Manage Drivers",
      permission: "add_users" as Permission,
    },
    {
      path: "/manage-colleges",
      icon: Users,
      label: "Manage Colleges",
      permission: "add_users" as Permission,
    },
    {
      path: "/notifications",
      icon: Bell,
      label: "Notifications",
      permission: null as null,
    },
    {
      path: "/settings",
      icon: Settings,
      label: "Settings",
      permission: null as null,
    },
  ];

  return (
    <>
      <Sheet>
        <aside
          className={cn(
            "group/sidebar fixed left-0 top-0 z-30 flex h-full flex-col overflow-y-auto border-r bg-background py-4 transition-all duration-300 ease-in-out",
            isCollapsed ? "w-16" : "w-64",
            "md:hidden"
          )}
        >
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="absolute right-2 top-2 rounded-sm p-2 text-muted-foreground md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
          </SheetTrigger>
          <SidebarContent
            sidebarItems={sidebarItems}
            location={location}
            isCollapsed={isCollapsed}
            logout={logout}
            user={user}
            setIsCollapsed={setIsCollapsed}
          />
        </aside>
        <SheetContent side="left" className="p-0 data-[state=open]:md:hidden">
          <SheetHeader className="text-left">
            <SheetTitle>Dashboard</SheetTitle>
          </SheetHeader>
          <SidebarContent
            sidebarItems={sidebarItems}
            location={location}
            isCollapsed={isCollapsed}
            logout={logout}
            user={user}
            setIsCollapsed={setIsCollapsed}
          />
        </SheetContent>
      </Sheet>
      <aside
        className={cn(
          "group/sidebar fixed left-0 top-0 z-30 hidden h-full flex-col overflow-y-auto border-r bg-background py-4 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
          "md:flex"
        )}
      >
        <SidebarContent
          sidebarItems={sidebarItems}
          location={location}
          isCollapsed={isCollapsed}
          logout={logout}
          user={user}
          setIsCollapsed={setIsCollapsed}
        />
      </aside>
    </>
  );
}

interface SidebarContentProps {
  sidebarItems: {
    path: string;
    icon: any;
    label: string;
    permission: Permission | null;
  }[];
  location: any;
  isCollapsed: boolean;
  logout: () => void;
  user: any;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

function SidebarContent({
  sidebarItems,
  location,
  isCollapsed,
  logout,
  user,
  setIsCollapsed,
}: SidebarContentProps) {
  const { hasPermission } = useAuth();
  
  return (
    <ScrollArea className="flex h-full flex-1 flex-col gap-2">
      <div className="flex flex-col items-center gap-4 px-3 pb-2">
        <NavLink to="/dashboard">
          <Button variant="ghost" className="h-9 w-full justify-start px-2">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span className={isCollapsed ? "hidden" : "block"}>Dashboard</span>
          </Button>
        </NavLink>
        {/* Removed profile section from sidebar as requested */}
      </div>
      <div className="flex-1">
        <ul className="space-y-1 px-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            // Properly handle permission checking
            if (item.permission !== null && !hasPermission(item.permission)) {
              return null;
            }
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "group flex w-full items-center rounded-md border border-transparent px-2 py-1 hover:bg-secondary hover:text-foreground",
                      isActive
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground"
                    )
                  }
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span className={isCollapsed ? "hidden" : "block"}>{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="px-3 py-2">
        <Button
          variant="outline"
          className="w-full justify-center"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          {!isCollapsed && <span className="ml-2">Collapse</span>}
        </Button>
      </div>
    </ScrollArea>
  );
}
