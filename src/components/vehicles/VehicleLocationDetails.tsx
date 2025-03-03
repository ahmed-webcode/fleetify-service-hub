
import React from 'react';
import { VehicleLocation } from '../maps/MapView';
import { Car, Calendar, MapPin, Activity, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VehicleLocationDetailsProps {
  vehicle: VehicleLocation | null;
}

const VehicleLocationDetails = ({ vehicle }: VehicleLocationDetailsProps) => {
  if (!vehicle) {
    return (
      <div className="bg-card rounded-xl border p-4">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          <span>Details</span>
        </h3>
        <p className="text-sm text-muted-foreground">Select a vehicle to view details</p>
      </div>
    );
  }

  const getStatusColor = (status: VehicleLocation['status']) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'parked': return 'bg-blue-500';
      case 'maintenance': return 'bg-amber-500';
      case 'unavailable': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-card rounded-xl border p-4">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Car className="h-5 w-5 text-primary" />
        <span>Details</span>
      </h3>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium">{vehicle.name}</p>
          <div className="px-2.5 py-1 bg-secondary text-secondary-foreground rounded text-xs font-medium">
            {vehicle.licensePlate}
          </div>
        </div>
        
        <div className="grid gap-3">
          <div className="flex items-start gap-3">
            <Activity className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Current Speed</p>
              <p className="font-medium">{vehicle.speed}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Coordinates</p>
              <p className="font-medium">{vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-medium">{vehicle.lastUpdated}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">Driver</p>
              <p className="font-medium">{vehicle.driver}</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className={cn("w-4 h-4 rounded-full mt-0.5", getStatusColor(vehicle.status))} />
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium">
                {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Button variant="outline" size="sm">
            View History
          </Button>
          <Button variant="outline" size="sm">
            Contact Driver
          </Button>
          <Button className="col-span-2 mt-1">
            Track Route
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VehicleLocationDetails;
