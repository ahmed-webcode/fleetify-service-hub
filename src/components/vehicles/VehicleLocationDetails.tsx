
import { Card } from "@/components/ui/card";
import { VehicleLocation } from "@/components/maps/MapView";
import { Gauge, Clock, User, MapPin, Car, CircleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VehicleLocationDetailsProps {
  vehicle: VehicleLocation | null;
}

const VehicleLocationDetails = ({ vehicle }: VehicleLocationDetailsProps) => {
  if (!vehicle) {
    return (
      <Card className="p-5 border rounded-xl space-y-4 bg-card">
        <div className="text-center py-8">
          <Car className="h-12 w-12 mx-auto text-muted-foreground opacity-20" />
          <h3 className="mt-4 font-medium text-muted-foreground">Select a vehicle to view details</h3>
        </div>
      </Card>
    );
  }

  // Status color mapping
  const statusColorMap = {
    active: "bg-green-100 text-green-800 border-green-300",
    parked: "bg-blue-100 text-blue-800 border-blue-300",
    maintenance: "bg-amber-100 text-amber-800 border-amber-300",
    unavailable: "bg-red-100 text-red-800 border-red-300",
  };

  const statusIconMap = {
    active: <Gauge className="h-4 w-4" />,
    parked: <MapPin className="h-4 w-4" />,
    maintenance: <CircleAlert className="h-4 w-4" />,
    unavailable: <CircleAlert className="h-4 w-4" />,
  };

  return (
    <Card className="p-5 border rounded-xl space-y-4 bg-card">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{vehicle.name}</h3>
          <p className="text-sm text-muted-foreground">{vehicle.licensePlate}</p>
        </div>
        <Badge variant="outline" className={`${statusColorMap[vehicle.status]} flex items-center gap-1.5 px-2.5 py-1`}>
          {statusIconMap[vehicle.status]}
          <span className="capitalize">{vehicle.status}</span>
        </Badge>
      </div>

      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Driver</p>
            <p className="font-medium">{vehicle.driver}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Gauge className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Speed</p>
            <p className="font-medium">{vehicle.speed}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <MapPin className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Location</p>
            <p className="font-medium">
              {vehicle.latitude.toFixed(4)}, {vehicle.longitude.toFixed(4)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Clock className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last Updated</p>
            <p className="font-medium">{vehicle.lastUpdated}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VehicleLocationDetails;
