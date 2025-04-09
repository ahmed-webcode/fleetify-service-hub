
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MetricsOverview } from "@/components/dashboard/MetricsOverview";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Car, Fuel, Wrench, Users, Calendar } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.fullName}</h1>
        <p className="text-muted-foreground">Here's an overview of your fleet management system</p>
      </div>
      
      <MetricsOverview />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <DashboardCard 
          title="Vehicle Status" 
          value="32/40"
          description="Active vehicles"
          icon={Car}
          trend="up"
          percentage={5}
          link="/vehicles"
        />
        <DashboardCard 
          title="Fuel Requests" 
          value="12"
          description="Pending approvals"
          icon={Fuel}
          trend="up"
          percentage={18}
          link="/fuel-management"
        />
        <DashboardCard 
          title="Maintenance" 
          value="7"
          description="Vehicles in service"
          icon={Wrench}
          trend="down"
          percentage={3}
          link="/service-requests"
        />
        <DashboardCard 
          title="Trip Requests" 
          value="24"
          description="Scheduled this month"
          icon={Calendar}
          trend="up"
          percentage={12}
          link="/trip-requests"
        />
        <DashboardCard 
          title="Staff" 
          value="18"
          description="Active drivers"
          icon={Users}
          trend="same"
          percentage={0}
          link="/settings"
        />
      </div>
    </div>
  );
}
