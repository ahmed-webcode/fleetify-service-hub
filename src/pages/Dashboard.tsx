
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { Car, Fuel, Wrench, Users, Calendar, FileText } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { MaintenanceStatusChart } from "@/components/dashboard/MaintenanceStatusChart";
import { FuelConsumptionChart } from "@/components/dashboard/FuelConsumptionChart";
import { PageHeader } from "@/components/layout/PageHeader";

export default function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const state = location.state as { permissionDenied?: boolean; roleDenied?: boolean } | null;

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

  return (
    <div className="w-full space-y-6">
      <PageHeader 
        title={`Welcome, ${user?.fullName || "User"}`}
        description="Here's an overview of your fleet management system"
      />
      
      <MetricsOverview />
      
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
          value="32/40"
          description="Active vehicles"
          icon={<Car size={20} />}
          trend="up"
          percentage={5}
          link="/vehicles"
        />
        <DashboardCard 
          title="Fuel Requests" 
          value="12"
          description="Pending approvals"
          icon={<Fuel size={20} />}
          trend="up"
          percentage={18}
          link="/fuel-management"
        />
        <DashboardCard 
          title="Maintenance" 
          value="7"
          description="Vehicles in service"
          icon={<Wrench size={20} />}
          trend="down"
          percentage={3}
          link="/service-requests"
        />
        <DashboardCard 
          title="Trip Requests" 
          value="24"
          description="Scheduled this month"
          icon={<Calendar size={20} />}
          trend="up"
          percentage={12}
          link="/trip-requests"
        />
        <DashboardCard 
          title="Staff" 
          value="18"
          description="Active drivers"
          icon={<Users size={20} />}
          trend="same"
          percentage={0}
          link="/settings"
        />
        <DashboardCard 
          title="Maintenance Requests" 
          value="15"
          description="8 approved, 5 pending, 2 rejected"
          icon={<FileText size={20} />}
          trend="up"
          percentage={10}
          link="/service-requests/maintenance"
        />
      </div>
    </div>
  );
}
