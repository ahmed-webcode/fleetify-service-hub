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
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const sidebarItems = [
    {
      path: "/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard",
      permission: null,
    },
    {
      path: "/vehicles",
      icon: Car,
      label: "Vehicles",
      permission: null,
    },
    {
      path: "/gps-tracking",
      icon: MapPin,
      label: "GPS Tracking",
      permission: "track_vehicles",
    },
    {
      path: "/trip-requests",
      icon: Calendar,
      label: "Trip Requests",
      permission: "request_fleet",
    },
    {
      path: "/fuel-management",
      icon: Fuel,
      label: "Fuel Management",
      permission: null,
    },
    {
      path: "/service-requests",
      icon: FileText,
      label: "Service Requests",
      permission: null,
    },
    {
      path: "/reports",
      icon: FileText,
      label: "Reports",
      permission: "view_reports",
    },
    {
      path: "/manage-users",
      icon: UserPlus,
      label: "Manage Users",
      permission: "add_users",
    },
    {
      path: "/manage-staff",
      icon: Users,
      label: "Manage Staff",
      permission: "add_users",
    },
    {
      path: "/driver-management",
      icon: ShieldCheck,
      label: "Manage Drivers",
      permission: "add_users",
    },
    {
      path: "/manage-colleges",
      icon: Users,
      label: "Manage Colleges",
      permission: "add_users",
    },
    {
      path: "/notifications",
      icon: Bell,
      label: "Notifications",
      permission: null,
    },
    {
      path: "/settings",
      icon: Settings,
      label: "Settings",
      permission: null,
    },
  ];

  return (
    <>
      <Sheet>
        <aside
          className={cn(
            "group/sidebar fixed left-0 top-0 z-50 flex h-full w-64 flex-col overflow-y-auto border-r bg-background py-4 transition-all duration-300 ease-in-out data-[collapsed=true]:w-16",
            isCollapsed && "data-[collapsed=true]:w-16",
            !isCollapsed && "w-64",
            "md:hidden"
          )}
        >
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="absolute right-2 top-2 rounded-sm p-2 text-muted-foreground md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
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
          "group/sidebar fixed left-0 top-0 z-50 hidden h-full w-64 flex-col overflow-y-auto border-r bg-background py-4 transition-all duration-300 ease-in-out data-[collapsed=true]:w-16",
          isCollapsed && "data-[collapsed=true]:w-16",
          !isCollapsed && "w-64",
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
    permission: string | null;
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
  return (
    <ScrollArea className="flex h-full flex-1 flex-col gap-2">
      <div className="flex flex-col items-center gap-4 px-3 pb-2">
        <NavLink to="/dashboard">
          <Button variant="ghost" className="h-9 w-full justify-start px-2">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>{isCollapsed ? "Dashboard" : "Dashboard"}</span>
          </Button>
        </NavLink>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 w-full justify-start px-2">
              <Avatar className="mr-2 h-4 w-4">
                <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span>{isCollapsed ? "Profile" : "Profile"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col space-y-1">
                <div>
                  <span className="text-sm font-medium leading-none">
                    {user?.fullName}
                  </span>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex-1">
        <ul className="space-y-1 px-3">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            if (item.permission && !useAuth().hasPermission(item.permission)) {
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
                  <span>{isCollapsed ? item.label : item.label}</span>
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
          {isCollapsed ? "Expand" : "Collapse"}
        </Button>
      </div>
    </ScrollArea>
  );
}
