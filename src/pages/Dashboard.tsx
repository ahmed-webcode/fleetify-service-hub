
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Car, Fuel } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { TripRequestsChart } from "@/components/dashboard/TripRequestsChart";
import { FuelRequestsChart } from "@/components/dashboard/FuelRequestsChart";
import { UserRolesChart } from "@/components/dashboard/UserRolesChart";
import { RecentTrips } from "@/components/dashboard/RecentTrips";
import { RecentFuels } from "@/components/dashboard/RecentFuels";

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as { permissionDenied?: boolean; roleDenied?: boolean } | null;

  const {
    vehiclesQuery,
    fuelRequestsQuery,
    usersQuery,
    tripRequestsQuery,
    recentTripsQuery,
    recentFuelRecordsQuery,
  } = useDashboardStats();

  useEffect(() => {
    if (state?.permissionDenied) {
      toast.error("You don't have permission to access that page");
      window.history.replaceState({}, document.title);
    } else if (state?.roleDenied) {
      toast.error("This page is restricted to specific roles");
      window.history.replaceState({}, document.title);
    }
  }, [state]);

  // Counts
  const vehicleCount = vehiclesQuery.data?.totalElements ?? 0;
  const fuelRequestCount = fuelRequestsQuery.data?.totalElements ?? 0;
  const tripRequestCount = tripRequestsQuery.data?.totalElements ?? 0;
  const loading =
    vehiclesQuery.isLoading ||
    fuelRequestsQuery.isLoading ||
    usersQuery.isLoading ||
    tripRequestsQuery.isLoading;

  // Prepare chart data
  const tripRequestList =
    (tripRequestsQuery.data?.content ?? []).map((item) => ({
      ...item,
      id: String(item.id),
    }));

  const fuelRequestList =
    (fuelRequestsQuery.data?.content ?? []).map((item) => ({
      ...item,
      id: String(item.id),
      createdAt: item.createdAt ?? item.requestedAt, // fallback to requestedAt if createdAt missing
    }));

  const userList = usersQuery.data ?? [];

  // Recent records
  const recentTrips = recentTripsQuery.data?.content ?? [];
  const recentFuels = recentFuelRecordsQuery.data?.content ?? [];
  const recentTripsLoading = recentTripsQuery.isLoading;
  const recentFuelsLoading = recentFuelRecordsQuery.isLoading;

  return (
    <div className="w-full px-4 md:px-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome, {user?.fullName || user.username}</h1>
        <p className="text-muted-foreground">Here's an overview of your fleet management system</p>
      </div>

      <MetricsOverview
        vehicles={vehicleCount}
        tripRequests={tripRequestCount}
        fuelRequests={fuelRequestCount}
        drivers={usersQuery.data?.filter(user => user.roles.some(role => role.name === "Driver")).length || 0}
        loading={loading}
      />

      {/* Charts: Trip and Fuel Requests */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TripRequestsChart tripRequests={tripRequestList} />
        <FuelRequestsChart fuelRequests={fuelRequestList} />
      </div>

      {/* User Roles Distribution Chart */}
      <UserRolesChart users={userList} />

      {/* Recent trips and recent fuels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentTrips records={recentTrips} loading={recentTripsLoading} />
        <RecentFuels records={recentFuels} loading={recentFuelsLoading} />
      </div>

      {/* Old DashboardCards for navigation */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Vehicles"
          value={String(vehicleCount)}
          description="Total vehicles"
          icon={<Car size={20} />}
          link="/vehicles"
        />
        <DashboardCard
          title="Trip Requests"
          value={String(tripRequestCount)}
          description="Requests for trips"
          icon={<Car size={20} />}
          link="/trip-requests"
        />
        <DashboardCard
          title="Fuel Requests"
          value={String(fuelRequestCount)}
          description="Total fuel requests"
          icon={<Fuel size={20} />}
          link="/fuel-management"
        />
      </div>
    </div>
  );
}
