
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Fuel, 
  Calendar, 
  User, 
  Info, 
  MapPin, 
  MoreHorizontal,
  FileEdit,
  Trash2,
  ClipboardList
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface VehicleCardProps {
  id: string;
  model: string;
  licensePlate: string;
  fuelType: string;
  year: number;
  assignedStaff?: string;
  status: "active" | "maintenance" | "outOfService";
  lastLocation?: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewDetails?: (id: string) => void;
}

export function VehicleCard({ 
  id,
  model,
  licensePlate,
  fuelType,
  year,
  assignedStaff,
  status,
  lastLocation,
  onEdit,
  onDelete,
  onViewDetails
}: VehicleCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "maintenance":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "outOfService":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Active";
      case "maintenance":
        return "In Maintenance";
      case "outOfService":
        return "Out of Service";
      default:
        return status;
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <div className="relative">
        <div className="bg-gradient-to-r from-slate-700 to-slate-800 h-40 flex items-center justify-center">
          <Car className="h-12 w-12 text-white opacity-50" />
        </div>
        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-white/90 hover:bg-white h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetails?.(id)}>
                <Info className="mr-2 h-4 w-4" /> View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit?.(id)}>
                <FileEdit className="mr-2 h-4 w-4" /> Edit Vehicle
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600"
                onClick={() => onDelete?.(id)}
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete Vehicle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute -bottom-4 left-4">
          <Badge className={`${getStatusColor(status)} border`}>
            {getStatusText(status)}
          </Badge>
        </div>
      </div>
      
      <CardContent className="pt-6">
        <div className="mt-2">
          <h3 className="font-semibold text-lg">{model}</h3>
          <p className="text-muted-foreground">{licensePlate}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="flex items-center text-sm">
            <Fuel className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{fuelType}</span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{year}</span>
          </div>
          {assignedStaff && (
            <div className="flex items-center text-sm col-span-2">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>Owner: {assignedStaff}</span>
            </div>
          )}
          {lastLocation && (
            <div className="flex items-center text-sm col-span-2">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{lastLocation}</span>
            </div>
          )}
        </div>
        
        <div className="mt-5 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onViewDetails?.(id)}
          >
            Details
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
          >
            <ClipboardList className="h-4 w-4 mr-2" />
            Service Log
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
