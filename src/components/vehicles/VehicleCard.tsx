
import { Car, Calendar, MapPin, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface VehicleCardProps {
  vehicle: {
    id: string;
    name: string;
    type: string;
    model: string;
    year: number;
    licensePlate: string;
    status: "active" | "maintenance" | "unavailable";
    lastLocation?: string;
    mileage: number;
    image?: string;
  };
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const statusColors = {
    active: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
    maintenance: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
    unavailable: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover-lift transition-all duration-300">
      <div className="h-40 bg-muted relative">
        {vehicle.image ? (
          <img 
            src={vehicle.image} 
            alt={vehicle.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <Car className="h-12 w-12" />
          </div>
        )}
        <Badge className={cn("absolute top-3 right-3", statusColors[vehicle.status])}>
          {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
        </Badge>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-xl">{vehicle.name}</h3>
            <p className="text-muted-foreground text-sm">{vehicle.model}</p>
          </div>
          <div className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium">
            {vehicle.licensePlate}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <span>{vehicle.mileage.toLocaleString()} km</span>
          </div>
          {vehicle.lastLocation && (
            <div className="flex items-center gap-2 text-sm col-span-2 truncate">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="truncate">{vehicle.lastLocation}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            Details
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            Service
          </Button>
        </div>
      </div>
    </div>
  );
}
