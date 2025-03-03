
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
  isLoading?: boolean;
}

export function DashboardCard({ title, icon, className, children, isLoading = false }: DashboardCardProps) {
  return (
    <div 
      className={cn(
        "bg-card rounded-xl border border-border p-5 transition-all duration-300",
        "hover:shadow-md hover:-translate-y-1",
        { "animate-pulse opacity-70": isLoading },
        className
      )}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{title}</h3>
        {icon && (
          <div className="text-muted-foreground">{icon}</div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
