import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { HasPermission } from "@/components/auth/HasPermission";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/lib/apiClient";
import { NotificationType } from "@/types/notification";

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Dashboard-specific Components
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { TripRequestsChart } from "@/components/dashboard/TripRequestsChart";
import { FuelRequestsChart } from "@/components/dashboard/FuelRequestsChart";
import { UserRolesChart } from "@/components/dashboard/UserRolesChart";
import { RecentTrips } from "@/components/dashboard/RecentTrips";
import { RecentFuels } from "@/components/dashboard/RecentFuels";
import { useDashboardStats } from "@/hooks/useDashboardStats";

// Icons
import { Bell, Clock, Fuel, Car, Wrench, AlertTriangle, User, Building, ArrowRight } from "lucide-react";


// --- Helper functions for Notifications ---

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  }
  return `${diffDays} days ago`;
};

const getTypeIcon = (type: NotificationType) => {
  switch (type) {
    case 'FUEL': return <Fuel className="h-5 w-5" />;
    case 'MAINTENANCE': return <Wrench className="h-5 w-5" />;
    case 'TRIP': return <Clock className="h-5 w-5" />;
    case 'VEHICLE': return <Car className="h-5 w-5" />;
    case 'INCIDENT': return <AlertTriangle className="h-5 w-5" />;
    case 'USER': return <User className="h-5 w-5" />;
    case 'PROJECT': return <Building className="h-5 w-5" />;
    default: return <Bell className="h-5 w-5" />;
  }
};


// --- Fallback Component for users without dashboard permissions ---

function DashboardFallback({ user }) {
  // Fetch a limited number of recent notifications for the preview
  const { data: notifications, isLoading, error } = useQuery({
    queryKey: ["notifications", "dashboard-preview"],
    queryFn: () => apiClient.notifications.getAll({
      page: 0,
      size: 9, // Show the 9 most recent notifications
      sortBy: "createdAt",
      direction: "DESC",
    }),
  });

  const notificationList = notifications?.content || [];

  return (
    <div className="w-full px-4 md:px-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Welcome, {user?.fullName || user?.username}
        </h1>
        <p className="text-muted-foreground">
          Here are your latest notifications.
        </p>
      </div>

      <div className="border-t pt-6">
        {isLoading && <div className="text-center py-4">Loading notifications...</div>}
        {error && <div className="text-center py-4 text-destructive">Failed to load notifications.</div>}
        
        {!isLoading && !error && (
          notificationList.length === 0 ? (
            <div className="text-center text-muted-foreground py-10 border border-dashed rounded-lg">
                <Bell className="mx-auto h-10 w-10 mb-2" />
                You have no new notifications.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notificationList.map((notification) => (
                <Card key={notification.id} className={notification.isRead ? "opacity-70" : ""}>
                  <CardHeader className="flex flex-row items-start justify-between pb-2">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${notification.isRead ? 'bg-slate-100' : 'bg-primary/10'}`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      <div>
                        <CardTitle className="text-base flex items-center gap-2">
                          {notification.type.charAt(0) + notification.type.slice(1).toLowerCase()}
                          {!notification.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full inline-block" title="Unread"></span>}
                        </CardTitle>
                        <CardDescription title={new Date(notification.createdAt).toLocaleString()}>
                          {formatRelativeTime(notification.createdAt)}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        )}
      </div>

      <div className="text-center pt-4">
        <Button asChild variant="outline">
          <Link to="/notifications">
            View All Notifications
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}


// --- New Component for the Full Dashboard View ---
// This component contains the useDashboardStats hook. It will only be mounted (and thus the hook will only run)
// if the user has the correct role and permissions.
function FullDashboard({ user }) {
  const {
    vehiclesQuery,
    fuelRequestsQuery,
    usersQuery,
    tripRequestsQuery,
    recentTripsQuery,
    recentFuelRecordsQuery,
  } = useDashboardStats();

  const vehicleCount = vehiclesQuery.data?.totalElements ?? 0;
  const fuelRequestCount = fuelRequestsQuery.data?.totalElements ?? 0;
  const tripRequestCount = tripRequestsQuery.data?.totalElements ?? 0;
  const loading = vehiclesQuery.isLoading || fuelRequestsQuery.isLoading || usersQuery.isLoading || tripRequestsQuery.isLoading;
  const tripRequestList = (tripRequestsQuery.data?.content ?? []).map(item => ({ ...item, id: String(item.id) }));
  const fuelRequestList = (fuelRequestsQuery.data?.content ?? []).map(item => ({ ...item, id: String(item.id), createdAt: item.createdAt ?? item.requestedAt }));
  const userList = usersQuery.data ?? [];
  const recentTrips = recentTripsQuery.data?.content ?? [];
  const recentFuels = recentFuelRecordsQuery.data?.content ?? [];
  const recentTripsLoading = recentTripsQuery.isLoading;
  const recentFuelsLoading = recentFuelRecordsQuery.isLoading;
  
  return (
    <div className="w-full px-4 md:px-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome, {user?.fullName || user?.username}</h1>
        <p className="text-muted-foreground">Here's an overview of your fleet management system</p>
      </div>

      <MetricsOverview
        vehicles={vehicleCount}
        tripRequests={tripRequestCount}
        fuelRequests={fuelRequestCount}
        drivers={usersQuery.data?.filter(user => user.roles.some(role => role.name === "Driver")).length || 0}
        loading={loading}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TripRequestsChart tripRequests={tripRequestList} />
        <FuelRequestsChart fuelRequests={fuelRequestList} />
      </div>

      <UserRolesChart users={userList} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentTrips records={recentTrips} loading={recentTripsLoading} />
        <RecentFuels records={recentFuels} loading={recentFuelsLoading} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        <DashboardCard title="Vehicles" value={String(vehicleCount)} description="Total vehicles" icon={<Car size={20} />} link="/vehicles" />
        <DashboardCard title="Trip Requests" value={String(tripRequestCount)} description="Requests for trips" icon={<Car size={20} />} link="/trip-management" />
        <DashboardCard title="Fuel Requests" value={String(fuelRequestCount)} description="Total fuel requests" icon={<Fuel size={20} />} link="/fuel-management" />
      </div>
    </div>
  );
}


// --- Main Dashboard Component (Modified) ---
// This component now acts as a dispatcher, deciding whether to show the full dashboard or the fallback.
export default function Dashboard() {
  const { user, selectedRole } = useAuth();
  const location = useLocation();
  const state = location.state as { permissionDenied?: boolean; roleDenied?: boolean } | null;

  useEffect(() => {
    if (state?.permissionDenied) {
      toast.error("You don't have permission to access that page");
      window.history.replaceState({}, document.title);
    } else if (state?.roleDenied) {
      toast.error("This page is restricted to specific roles");
      window.history.replaceState({}, document.title);
    }
  }, [state]);

  // First, check the role ID. If it's not 1, show the fallback immediately.
  // This prevents the FullDashboard component from ever being rendered,
  // and thus the useDashboardStats hook will not be executed.
  if (selectedRole?.id !== 1) {
    return <DashboardFallback user={user} />;
  }

  // If the role is 1, we then defer to the HasPermission component.
  // It will render FullDashboard only if the user has the required permission.
  // Otherwise, it will render the fallback.
  return (
    <HasPermission permission="view_dashboard" fallback={<DashboardFallback user={user} />}>
      <FullDashboard user={user} />
    </HasPermission>
  );
}