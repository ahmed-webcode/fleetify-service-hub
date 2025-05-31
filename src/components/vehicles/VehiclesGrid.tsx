import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { NoVehiclesFound } from "@/components/vehicles/NoVehiclesFound";

interface Vehicle {
    id: string;
    name: string;
    type: string;
    model: string;
    year: number;
    licensePlate: string;
    status: "active" | "maintenance" | "outOfService";
    lastLocation?: string;
    mileage: number;
    imgSrc?: string;
    fuelTypeName: string;
}

interface VehiclesGridProps {
    vehicles: Vehicle[];
    resetFilters: () => void;
    onEdit?: (id: string) => void;
}

export function VehiclesGrid({ vehicles, resetFilters, onEdit }: VehiclesGridProps) {
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
                    fuelType={vehicle.fuelTypeName}
                    year={vehicle.year}
                    status={vehicle.status}
                    lastLocation={vehicle.lastLocation}
                    imgSrc={vehicle.imgSrc}
                    onEdit={onEdit}
                />
            ))}
        </div>
    );
}
