
import { Button } from "@/components/ui/button";
import { NoVehiclesFound } from "@/components/vehicles/NoVehiclesFound";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';

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
}

interface VehiclesListProps {
  vehicles: Vehicle[];
  resetFilters: () => void;
  onViewDetails?: (id: string) => void; 
}

export function VehiclesList({ vehicles, resetFilters, onViewDetails }: VehiclesListProps) {
  const navigate = useNavigate();

  if (vehicles.length === 0) {
    return <NoVehiclesFound resetFilters={resetFilters} />;
  }

  const handleViewDetails = (id: string) => {
    if (onViewDetails) {
      onViewDetails(id);
    } else {
      navigate(`/vehicles/${id}`);
    }
  };
  
  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Vehicle</TableHead>
            <TableHead className="hidden md:table-cell">License Plate</TableHead>
            <TableHead className="hidden lg:table-cell">Year</TableHead>
            <TableHead className="hidden lg:table-cell">Mileage</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border">
          {vehicles.map((vehicle) => (
            <TableRow key={vehicle.id} className="hover:bg-muted/30 transition-colors">
              <TableCell>
                <div>
                  <p className="font-medium">{vehicle.name}</p>
                  <p className="text-xs text-muted-foreground">{vehicle.model}</p>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {vehicle.licensePlate}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {vehicle.year}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                {vehicle.mileage.toLocaleString()} km
              </TableCell>
              <TableCell>
                <span className={`status-badge ${
                  vehicle.status === 'active' 
                    ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                    : vehicle.status === 'maintenance'
                    ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleViewDetails(vehicle.id)}
                >
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
