import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Car, Fuel, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { TripRequestsChart } from "@/components/dashboard/TripRequestsChart";
import { FuelRequestsChart } from "@/components/dashboard/FuelRequestsChart";

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as { permissionDenied?: boolean; roleDenied?: boolean } | null;

  const {
    vehiclesQuery,
    fuelRequestsQuery,
    staffQuery,
    tripRequestsQuery,
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
  const driversCount = staffQuery.data?.length ?? 0;
  const tripRequestCount = tripRequestsQuery.data?.totalElements ?? 0;
  const loading =
    vehiclesQuery.isLoading ||
    fuelRequestsQuery.isLoading ||
    staffQuery.isLoading ||
    tripRequestsQuery.isLoading;

  // STEP 1: Map TripRequestDto[] -> TripRequest[] (convert id to string)
  const tripRequestList =
    (tripRequestsQuery.data?.content ?? []).map((item) => ({
      ...item,
      id: String(item.id),
    }));

  // STEP 2: Map FuelRequestDto[] -> FuelRequest[] (convert id to string, guarantee createdAt)
  const fuelRequestList =
    (fuelRequestsQuery.data?.content ?? []).map((item) => ({
      ...item,
      id: String(item.id),
      createdAt: item.createdAt ?? item.requestedAt, // fallback to requestedAt if createdAt missing
    }));

  return (
    <div className="w-full px-4 md:px-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome, {user?.fullName || "User"}</h1>
        <p className="text-muted-foreground">Here's an overview of your fleet management system</p>
      </div>

      <MetricsOverview
        vehicles={vehicleCount}
        tripRequests={tripRequestCount}
        fuelRequests={fuelRequestCount}
        drivers={driversCount}
        loading={loading}
      />

      {/* Charts (2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TripRequestsChart tripRequests={tripRequestList} />
        <FuelRequestsChart fuelRequests={fuelRequestList} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
        <DashboardCard
          title="Drivers"
          value={String(driversCount)}
          description="Staff with driver role"
          icon={<Users size={20} />}
          link="/settings"
        />
      </div>
    </div>
  );
}
