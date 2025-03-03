
import React from 'react';
import { VehicleLocation } from '../maps/MapView';
import { cn } from '@/lib/utils';

interface VehicleLocationsListProps {
  vehicles: VehicleLocation[];
  selectedVehicle: string | null;
  onSelectVehicle: (id: string) => void;
}

const VehicleLocationsList = ({ 
  vehicles, 
  selectedVehicle, 
  onSelectVehicle 
}: VehicleLocationsListProps) => {
  
  const getStatusColor = (status: VehicleLocation['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'parked':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'maintenance':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'unavailable':
        return 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left py-3 px-4 text-sm font-medium">Vehicle</th>
            <th className="text-left py-3 px-4 text-sm font-medium">Driver</th>
            <th className="text-left py-3 px-4 text-sm font-medium">Speed</th>
            <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
            <th className="text-right py-3 px-4 text-sm font-medium">Last Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {vehicles.map((vehicle) => (
            <tr 
              key={vehicle.id} 
              className={cn(
                "hover:bg-muted/30 transition-colors cursor-pointer",
                selectedVehicle === vehicle.id && "bg-primary/5"
              )}
              onClick={() => onSelectVehicle(vehicle.id)}
            >
              <td className="py-3 px-4">
                <div>
                  <p className="font-medium">{vehicle.name}</p>
                  <p className="text-xs text-muted-foreground">{vehicle.licensePlate}</p>
                </div>
              </td>
              <td className="py-3 px-4">
                {vehicle.driver}
              </td>
              <td className="py-3 px-4">
                {vehicle.speed}
              </td>
              <td className="py-3 px-4">
                <span className={cn(`px-2 py-1 rounded-full text-xs`, getStatusColor(vehicle.status))}>
                  {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                {vehicle.lastUpdated}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleLocationsList;
