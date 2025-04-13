
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  trend?: "up" | "down" | "same";
  percentage?: number;
  link?: string;
  className?: string;
}

export function DashboardCard({ 
  title, 
  value, 
  description,
  icon,
  trend,
  percentage = 0,
  link,
  className 
}: DashboardCardProps) {
  return (
    <div className={cn(
      "bg-card rounded-lg border shadow-sm p-5 transition-all duration-300 hover:shadow-md hover:translate-y-[-2px]",
      className
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <div className="bg-secondary rounded-full p-2.5">
          {icon}
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{value}</span>
          {trend && percentage > 0 && (
            <span className={cn(
              "text-xs font-medium",
              trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"
            )}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "―"} {percentage}%
            </span>
          )}
        </div>
        
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      
      {link && (
        <Link 
          to={link}
          className="mt-4 inline-flex items-center text-sm text-primary hover:underline gap-1"
        >
          View details <ArrowRight size={14} />
        </Link>
      )}
    </div>
  );
}
