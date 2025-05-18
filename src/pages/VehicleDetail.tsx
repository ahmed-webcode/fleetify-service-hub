
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Car, 
  Fuel, 
  FileText, 
  Wrench, 
  AlertTriangle,
  ArrowLeft,
  Calendar,
  User,
  MapPin,
  Truck,
  Tag,
  Gauge,
  Eye,
  CheckCircle,
  XCircle
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { apiClient, VehicleStatus, VehicleDetail as VehicleDetailType } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";

const getStatusColor = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "bg-green-100 text-green-800 border-green-300";
    case "IN_USE":
      return "bg-blue-100 text-blue-800 border-blue-300";
    case "UNDER_MAINTENANCE":
      return "bg-amber-100 text-amber-800 border-amber-300";
    case "OUT_OF_SERVICE":
      return "bg-red-100 text-red-800 border-red-300";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "AVAILABLE":
      return "Available";
    case "IN_USE":
      return "In Use";
    case "UNDER_MAINTENANCE":
      return "Under Maintenance";
    case "OUT_OF_SERVICE":
      return "Out of Service";
    default:
      return status;
  }
};

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: vehicleDetail, isLoading, error } = useQuery({
    queryKey: ["vehicleDetail", id],
    queryFn: () => apiClient.vehicles.getDetails(Number(id)),
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div className="page-container">
        <div className="flex justify-center items-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading vehicle information...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !vehicleDetail) {
    return (
      <div className="page-container">
        <div className="flex flex-col items-center justify-center h-[60vh]">
          <AlertTriangle className="h-10 w-10 text-amber-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Vehicle Not Found</h2>
          <p className="text-muted-foreground mb-6">The requested vehicle information could not be found.</p>
          <Button onClick={() => navigate("/vehicles")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Vehicles
          </Button>
        </div>
      </div>
    );
  }

  const vehicle = vehicleDetail.general;

  return (
    <div className="page-container">
      <div className="page-title-container">
        <div className="flex items-start justify-between">
          <div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate("/vehicles")}
              className="mb-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Vehicles
            </Button>
            <h1 className="page-title">{vehicle.model}</h1>
            <div className="flex items-center gap-2">
              <p className="text-muted-foreground">{vehicle.plateNumber}</p>
              <Badge className={`${getStatusColor(vehicle.status)} border`}>
                {getStatusText(vehicle.status)}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              Edit Vehicle
            </Button>
            <Button>
              Service Log
            </Button>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="general" className="mt-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general" className="flex items-center gap-1">
            <FileText className="h-4 w-4" /> General
          </TabsTrigger>
          <TabsTrigger value="fuel" className="flex items-center gap-1">
            <Fuel className="h-4 w-4" /> Fuel History
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-1">
            <Wrench className="h-4 w-4" /> Maintenance History
          </TabsTrigger>
          <TabsTrigger value="incidents" className="flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" /> Incident History
          </TabsTrigger>
        </TabsList>
        
        {/* General Information Tab */}
        <TabsContent value="general" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Vehicle Details</CardTitle>
                  <CardDescription>General information about the vehicle</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Type</h4>
                        <p className="flex items-center">
                          <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                          {vehicle.vehicleType}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Model</h4>
                        <p className="flex items-center">
                          <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                          {vehicle.model}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">License Plate</h4>
                        <p className="flex items-center">
                          <Tag className="h-4 w-4 mr-2 text-muted-foreground" />
                          {vehicle.plateNumber}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Year</h4>
                        <p className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {vehicle.madeYear}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Fuel Type</h4>
                        <p className="flex items-center">
                          <Fuel className="h-4 w-4 mr-2 text-muted-foreground" />
                          {vehicle.fuelTypeName}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Color</h4>
                        <p>{vehicle.color}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Made In</h4>
                        <p>{vehicle.madeIn}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Private Vehicle</h4>
                        <p className="flex items-center">
                          {vehicle.isPrivate ? (
                            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 mr-2 text-red-500" />
                          )}
                          {vehicle.isPrivate ? "Yes" : "No"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Assigned To</h4>
                        <p className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          {vehicle.responsibleStaffName || "Not assigned"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Driver</h4>
                        <p className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          {vehicle.driverName || "Not assigned"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Work Environment</h4>
                        <p className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {vehicle.workEnvironment || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Odometer Reading</h4>
                        <p className="flex items-center">
                          <Gauge className="h-4 w-4 mr-2 text-muted-foreground" />
                          {vehicle.kmReading ? `${vehicle.kmReading.toLocaleString()} km` : "N/A"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Chassis Number</h4>
                        <p>{vehicle.chassisNumber || "N/A"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Motor Number</h4>
                        <p>{vehicle.motorNumber || "N/A"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Insurance Company</h4>
                        <p>{vehicle.insuranceCompany || "N/A"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Insurance End Date</h4>
                        <p>{vehicle.insuranceEndDate ? format(parseISO(vehicle.insuranceEndDate), "PPP") : "N/A"}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Horse Power</h4>
                      <p>{vehicle.horsePower ? `${vehicle.horsePower} HP` : "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Cylinder Count</h4>
                      <p>{vehicle.cylinderCount || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Axle Count</h4>
                      <p>{vehicle.axleCount || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Seats Count</h4>
                      <p>{vehicle.seatsCount || "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Fuel Consumption Rate</h4>
                      <p>{vehicle.fuelConsumptionRate ? `${vehicle.fuelConsumptionRate} L/100km` : "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Quota Refuel</h4>
                      <p>{vehicle.lastQuotaRefuel ? format(parseISO(vehicle.lastQuotaRefuel), "PPP") : "N/A"}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Single Weight</h4>
                      <p>{vehicle.singleWeight ? `${vehicle.singleWeight.toLocaleString()} kg` : "N/A"}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Weight</h4>
                      <p>{vehicle.totalWeight ? `${vehicle.totalWeight.toLocaleString()} kg` : "N/A"}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card className="overflow-hidden">
                <div className="h-48 overflow-hidden">
                  {vehicle.imgSrc ? (
                    <img 
                      src={vehicle.imgSrc} 
                      alt={vehicle.model} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Car className="h-12 w-12 text-muted-foreground opacity-40" />
                    </div>
                  )}
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-semibold text-lg mb-2">Quick Stats</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Created At</span>
                      <span className="font-medium">{format(parseISO(vehicle.createdAt), "PP")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Updated At</span>
                      <span className="font-medium">{format(parseISO(vehicle.updatedAt), "PP")}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Weight</span>
                      <span className="font-medium">{vehicle.totalWeight ? `${vehicle.totalWeight.toLocaleString()} kg` : "N/A"}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" disabled={!vehicle.libreSrc}>
                    <Eye className="h-4 w-4 mr-2" /> View Libre Document
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Fuel History Tab */}
        <TabsContent value="fuel" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Fuel History</CardTitle>
              <CardDescription>Record of fuel purchases and consumption</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Fuel className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  Fuel history details will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Maintenance Tab */}
        <TabsContent value="maintenance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
              <CardDescription>Record of all maintenance activities</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <Wrench className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  Maintenance history details will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Incidents Tab */}
        <TabsContent value="incidents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Incident History</CardTitle>
              <CardDescription>Record of incidents involving this vehicle</CardDescription>
            </CardHeader>
            <CardContent className="min-h-[400px] flex items-center justify-center">
              <div className="text-center">
                <AlertTriangle className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground">
                  Incident history details will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
