
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { NoVehiclesFound } from "@/components/vehicles/NoVehiclesFound";

interface Vehicle {
  id: string;
  name: string;
  type: string;
  model: string;
  year: number;
  licensePlate: string;
  status: "active" | "maintenance" | "unavailable"; // Changed to match what's used in Vehicles.tsx
  lastLocation?: string;
  mileage: number;
}

interface VehiclesGridProps {
  vehicles: Vehicle[];
  resetFilters: () => void;
}

export function VehiclesGrid({ vehicles, resetFilters }: VehiclesGridProps) {
  if (vehicles.length === 0) {
    return <NoVehiclesFound resetFilters={resetFilters} />;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle) => (
        <VehicleCard 
          key={vehicle.id}
          id={vehicle.id}
          model={vehicle.model}
          licensePlate={vehicle.licensePlate}
          fuelType="Diesel" // Default value, to be updated from vehicle prop
          year={vehicle.year}
          status={vehicle.status}
          lastLocation={vehicle.lastLocation}
        />
      ))}
    </div>
  );
}
