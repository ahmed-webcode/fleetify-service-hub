
import { 
  Car, 
  Fuel, 
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  className?: string;
}

interface MetricsOverviewProps {
  vehicles: number;
  serviceRequests: number;
  fuelRequests: number;
  drivers: number;
  loading?: boolean;
}

export function MetricsOverview({
  vehicles, serviceRequests, fuelRequests, drivers, loading,
}: MetricsOverviewProps) {
  // Remove trend because can't compute without comparative data here
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <MetricCard
        title="Vehicles"
        value={loading ? "..." : vehicles}
        icon={<Car className="h-5 w-5" />}
        className="border-l-4 border-l-blue-500"
      />
      <MetricCard
        title="Service Requests"
        value={loading ? "..." : serviceRequests}
        icon={<Wrench className="h-5 w-5" />}
        className="border-l-4 border-l-indigo-500"
      />
      <MetricCard
        title="Fuel Requests"
        value={loading ? "..." : fuelRequests}
        icon={<Fuel className="h-5 w-5" />}
        className="border-l-4 border-l-teal-500"
      />
      <MetricCard
        title="Drivers"
        value={loading ? "..." : drivers}
        icon={<Car className="h-5 w-5" />}
        className="border-l-4 border-l-green-500"
      />
    </div>
  );
}

function MetricCard({ title, value, icon, className }: MetricCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-lg p-5 border shadow-sm transition-all duration-300 hover:shadow-md",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-semibold">{value}</h3>
        </div>
        <div className="bg-secondary rounded-full p-2.5">
          {icon}
        </div>
      </div>
    </div>
  );
}
