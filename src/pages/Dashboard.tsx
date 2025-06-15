
// Add the DashboardCharts import to the top (after React and hooks)
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Car, Fuel, Wrench, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts"; // <-- Make sure this import is present and at the top
import { MaintenanceStatusChart } from "@/components/dashboard/MaintenanceStatusChart";
import { FuelConsumptionChart } from "@/components/dashboard/FuelConsumptionChart";

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as { permissionDenied?: boolean; roleDenied?: boolean } | null;

  const {
    vehiclesQuery,
    serviceRequestsQuery,
    fuelRequestsQuery,
    staffQuery,
    fuelRecordsQuery,
    maintenanceRequestsQuery,
  } = useDashboardStats();

  useEffect(() => {
    // Show toast notifications for permission or role denial
    if (state?.permissionDenied) {
      toast.error("You don't have permission to access that page");
      // Clear the state so the message doesn't show again on refresh
      window.history.replaceState({}, document.title);
    } else if (state?.roleDenied) {
      toast.error("This page is restricted to specific roles");
      window.history.replaceState({}, document.title);
    }
  }, [state]);

  // Counts
  const vehicleCount = vehiclesQuery.data?.totalElements ?? 0;
  const maintenanceCount = serviceRequestsQuery.data?.totalElements ?? 0;
  const fuelRequestCount = fuelRequestsQuery.data?.totalElements ?? 0;
  const driversCount = staffQuery.data?.length ?? 0;
  const loading =
    vehiclesQuery.isLoading ||
    serviceRequestsQuery.isLoading ||
    fuelRequestsQuery.isLoading ||
    staffQuery.isLoading;

  return (
    <div className="w-full px-4 md:px-8 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome, {user?.fullName || "User"}</h1>
        <p className="text-muted-foreground">Here's an overview of your fleet management system</p>
      </div>

      <MetricsOverview
        vehicles={vehicleCount}
        serviceRequests={maintenanceCount}
        fuelRequests={fuelRequestCount}
        drivers={driversCount}
        loading={loading}
      />

      {/* Charts section */}
      <DashboardCharts />

      {/* Additional charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MaintenanceStatusChart />
        <FuelConsumptionChart />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard
          title="Vehicle Status"
          value={String(vehicleCount)}
          description="Total vehicles"
          icon={<Car size={20} />}
          link="/vehicles"
        />
        <DashboardCard
          title="Fuel Requests"
          value={String(fuelRequestCount)}
          description="Pending approvals"
          icon={<Fuel size={20} />}
          link="/fuel-management"
        />
        <DashboardCard
          title="Maintenance"
          value={String(maintenanceCount)}
          description="Open maintenance tickets"
          icon={<Wrench size={20} />}
          link="/service-requests"
        />
        <DashboardCard
          title="Staff"
          value={String(driversCount)}
          description="Staff with driver role"
          icon={<Users size={20} />}
          link="/settings"
        />
      </div>
    </div>
  );
}
