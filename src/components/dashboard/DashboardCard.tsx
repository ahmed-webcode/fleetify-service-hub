
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function DashboardCard({ title, icon, className, children }: DashboardCardProps) {
  return (
    <div 
      className={cn(
        "bg-card rounded-xl border border-border p-5 hover-lift transition-all duration-300",
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
