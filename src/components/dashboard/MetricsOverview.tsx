
import { 
  Car, 
  Fuel, 
  Wrench, 
  CheckCircle, 
  Clock, 
  AlertTriangle 
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

export function MetricsOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <MetricCard
        title="Total Vehicles"
        value="42"
        icon={<Car className="h-5 w-5" />}
        className="border-l-4 border-l-blue-500"
      />
      <MetricCard
        title="Service Requests"
        value="18"
        icon={<Wrench className="h-5 w-5" />}
        trend={8}
        trendLabel="from last week"
        className="border-l-4 border-l-indigo-500"
      />
      <MetricCard
        title="Fuel Consumption"
        value="2,480 L"
        icon={<Fuel className="h-5 w-5" />}
        trend={-5}
        trendLabel="vs last month"
        className="border-l-4 border-l-teal-500"
      />
    </div>
  );
}

function MetricCard({ title, value, icon, trend, trendLabel, className }: MetricCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-lg p-5 border shadow-sm transition-all duration-300 hover:shadow-md",
      className
    )}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-semibold">{value}</h3>
          
          {trend !== undefined && (
            <div className="flex items-center mt-2">
              <span className={cn(
                "text-xs font-medium",
                trend > 0 ? "text-green-500" : "text-red-500"
              )}>
                {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
              </span>
              {trendLabel && (
                <span className="text-xs text-muted-foreground ml-1">{trendLabel}</span>
              )}
            </div>
          )}
        </div>
        
        <div className="bg-secondary rounded-full p-2.5">
          {icon}
        </div>
      </div>
    </div>
  );
}

export function ServiceStatusOverview() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatusCard 
        title="Completed"
        count={24}
        icon={<CheckCircle className="h-5 w-5 text-green-500" />}
        color="bg-green-50 dark:bg-green-900/20"
      />
      <StatusCard 
        title="In Progress"
        count={12}
        icon={<Clock className="h-5 w-5 text-amber-500" />}
        color="bg-amber-50 dark:bg-amber-900/20"
      />
      <StatusCard 
        title="Pending"
        count={7}
        icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
        color="bg-red-50 dark:bg-red-900/20"
      />
    </div>
  );
}

function StatusCard({ 
  title, 
  count, 
  icon, 
  color 
}: { 
  title: string; 
  count: number; 
  icon: React.ReactNode; 
  color: string;
}) {
  return (
    <div className="bg-card rounded-lg border shadow-sm p-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className={cn("rounded-full p-2", color)}>
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-xl font-semibold">{count}</p>
        </div>
      </div>
    </div>
  );
}
