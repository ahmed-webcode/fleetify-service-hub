
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
  Gauge
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Define interfaces for the different vehicle data types
interface Vehicle {
  id: string;
  model: string;
  licensePlate: string;
  fuelType: string;
  year: number;
  assignedStaff?: string;
  status: "active" | "maintenance" | "outOfService";
  lastLocation?: string;
  // Additional vehicle details
  type?: string;
  color?: string;
  madeIn?: string;
  chassisNumber?: string;
  motorNumber?: string;
  ownership?: string;
  kmReading?: number;
  horsePower?: number;
  cylinderCount?: number;
  axleCount?: number;
  singleWeight?: number;
  totalWeight?: number;
  imageUrl?: string;
}

interface FuelRecord {
  id: string;
  date: string;
  amount: number;
  cost: number;
  stationName: string;
  odometerReading: number;
  driver: string;
}

interface MaintenanceRecord {
  id: string;
  date: string;
  type: string;
  description: string;
  cost: number;
  serviceProvider: string;
  status: "completed" | "pending" | "inProgress";
  nextServiceDate?: string;
}

interface IncidentRecord {
  id: string;
  date: string;
  location: string;
  description: string;
  reportedBy: string;
  severity: "minor" | "moderate" | "major";
  status: "resolved" | "pending" | "investigating";
}

// Mock data for demonstration - replace with API calls
const MOCK_VEHICLE: Vehicle = {
  id: "1",
  model: "Toyota Land Cruiser",
  licensePlate: "A12345",
  fuelType: "Diesel",
  year: 2020,
  assignedStaff: "Dr. Abebe Bekele",
  status: "active",
  lastLocation: "Main Campus",
  type: "SUV",
  color: "White",
  madeIn: "Japan",
  chassisNumber: "JT3HN86R0Y0269652",
  motorNumber: "1HD-FT3256",
  ownership: "AAU",
  kmReading: 45230,
  horsePower: 240,
  cylinderCount: 8,
  axleCount: 2,
  singleWeight: 2500,
  totalWeight: 3200,
  imageUrl: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=1470&auto=format&fit=crop"
};

const MOCK_FUEL_RECORDS: FuelRecord[] = [
  {
    id: "f1",
    date: "2023-05-12",
    amount: 45.5,
    cost: 2275,
    stationName: "Total Bole",
    odometerReading: 42500,
    driver: "Dawit Tesfaye"
  },
  {
    id: "f2",
    date: "2023-04-28",
    amount: 40,
    cost: 2000,
    stationName: "NOC Kazanchis",
    odometerReading: 42100,
    driver: "Dawit Tesfaye"
  },
  {
    id: "f3",
    date: "2023-04-15",
    amount: 50,
    cost: 2500,
    stationName: "Total Mexico",
    odometerReading: 41600,
    driver: "Solomon Abebe"
  }
];

const MOCK_MAINTENANCE_RECORDS: MaintenanceRecord[] = [
  {
    id: "m1",
    date: "2023-03-22",
    type: "Oil Change",
    description: "Regular oil change and filter replacement",
    cost: 1800,
    serviceProvider: "AAU Garage",
    status: "completed",
    nextServiceDate: "2023-06-22"
  },
  {
    id: "m2",
    date: "2022-12-15",
    type: "Brake Service",
    description: "Front brake pads replacement",
    cost: 3500,
    serviceProvider: "MOENCO",
    status: "completed"
  },
  {
    id: "m3",
    date: "2022-09-05",
    type: "Major Service",
    description: "Annual vehicle inspection and service",
    cost: 12000,
    serviceProvider: "MOENCO",
    status: "completed"
  }
];

const MOCK_INCIDENT_RECORDS: IncidentRecord[] = [
  {
    id: "i1",
    date: "2023-02-28",
    location: "Arat Kilo Roundabout",
    description: "Minor scratch on rear bumper from motorcycle",
    reportedBy: "Dawit Tesfaye",
    severity: "minor",
    status: "resolved"
  },
  {
    id: "i2",
    date: "2022-11-10",
    location: "Campus Parking Lot",
    description: "Side mirror damaged while parked",
    reportedBy: "Security Staff",
    severity: "minor",
    status: "resolved"
  }
];

export default function VehicleDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [fuelRecords, setFuelRecords] = useState<FuelRecord[]>([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState<MaintenanceRecord[]>([]);
  const [incidentRecords, setIncidentRecords] = useState<IncidentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchVehicleData() {
      setLoading(true);
      try {
        // In a real implementation, replace these with API calls using httpClient
        // const vehicleData = await httpClient.get<Vehicle>(`/api/vehicles/${id}`);
        // setVehicle(vehicleData);
        
        // const fuelData = await httpClient.get<FuelRecord[]>(`/api/vehicles/${id}/fuel-records`);
        // setFuelRecords(fuelData);
        
        // const maintenanceData = await httpClient.get<MaintenanceRecord[]>(`/api/vehicles/${id}/maintenance-records`);
        // setMaintenanceRecords(maintenanceData);
        
        // const incidentData = await httpClient.get<IncidentRecord[]>(`/api/vehicles/${id}/incident-records`);
        // setIncidentRecords(incidentData);
        
        // For now, use mock data
        setVehicle(MOCK_VEHICLE);
        setFuelRecords(MOCK_FUEL_RECORDS);
        setMaintenanceRecords(MOCK_MAINTENANCE_RECORDS);
        setIncidentRecords(MOCK_INCIDENT_RECORDS);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error("Error fetching vehicle data:", error);
        toast.error("Failed to load vehicle data");
      } finally {
        setLoading(false);
      }
    }
    
    fetchVehicleData();
  }, [id]);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-300";
      case "maintenance":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "outOfService":
        return "bg-red-100 text-red-800 border-red-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "pending":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "inProgress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-300";
      case "investigating":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "minor":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "moderate":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "major":
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
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "inProgress":
        return "In Progress";
      case "resolved":
        return "Resolved";
      case "investigating":
        return "Investigating";
      default:
        return status;
    }
  };

  if (loading) {
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

  if (!vehicle) {
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
              <p className="text-muted-foreground">{vehicle.licensePlate}</p>
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
                          {vehicle.type || "N/A"}
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
                          {vehicle.licensePlate}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Year</h4>
                        <p className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          {vehicle.year}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Fuel Type</h4>
                        <p className="flex items-center">
                          <Fuel className="h-4 w-4 mr-2 text-muted-foreground" />
                          {vehicle.fuelType}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Color</h4>
                        <p>{vehicle.color || "N/A"}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Made In</h4>
                        <p>{vehicle.madeIn || "N/A"}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Assigned To</h4>
                        <p className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          {vehicle.assignedStaff || "Not assigned"}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Last Location</h4>
                        <p className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          {vehicle.lastLocation || "Unknown"}
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
                        <h4 className="text-sm font-medium text-muted-foreground mb-1">Ownership</h4>
                        <p>{vehicle.ownership || "N/A"}</p>
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
                  {vehicle.imageUrl ? (
                    <img 
                      src={vehicle.imageUrl} 
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
                      <span className="text-sm text-muted-foreground">Last Service</span>
                      <span className="font-medium">3 months ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fuel Efficiency</span>
                      <span className="font-medium">8.2 km/L</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Distance</span>
                      <span className="font-medium">45,230 km</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    <MapPin className="h-4 w-4 mr-2" /> Track Location
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
            <CardContent>
              {fuelRecords.length > 0 ? (
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left font-medium">Date</th>
                          <th className="py-3 px-4 text-left font-medium">Amount</th>
                          <th className="py-3 px-4 text-left font-medium">Cost</th>
                          <th className="py-3 px-4 text-left font-medium">Station</th>
                          <th className="py-3 px-4 text-left font-medium">Odometer</th>
                          <th className="py-3 px-4 text-left font-medium">Driver</th>
                        </tr>
                      </thead>
                      <tbody>
                        {fuelRecords.map((record) => (
                          <tr key={record.id} className="border-b">
                            <td className="py-3 px-4">{record.date}</td>
                            <td className="py-3 px-4">{record.amount} L</td>
                            <td className="py-3 px-4">ETB {record.cost}</td>
                            <td className="py-3 px-4">{record.stationName}</td>
                            <td className="py-3 px-4">{record.odometerReading} km</td>
                            <td className="py-3 px-4">{record.driver}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Fuel className="h-8 w-8 mx-auto text-muted-foreground opacity-50 mb-2" />
                  <p className="text-muted-foreground">No fuel records available</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button>Add Fuel Record</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Maintenance History Tab */}
        <TabsContent value="maintenance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
              <CardDescription>Record of vehicle maintenance and repairs</CardDescription>
            </CardHeader>
            <CardContent>
              {maintenanceRecords.length > 0 ? (
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left font-medium">Date</th>
                          <th className="py-3 px-4 text-left font-medium">Type</th>
                          <th className="py-3 px-4 text-left font-medium">Description</th>
                          <th className="py-3 px-4 text-left font-medium">Cost</th>
                          <th className="py-3 px-4 text-left font-medium">Provider</th>
                          <th className="py-3 px-4 text-left font-medium">Status</th>
                          <th className="py-3 px-4 text-left font-medium">Next Service</th>
                        </tr>
                      </thead>
                      <tbody>
                        {maintenanceRecords.map((record) => (
                          <tr key={record.id} className="border-b">
                            <td className="py-3 px-4">{record.date}</td>
                            <td className="py-3 px-4">{record.type}</td>
                            <td className="py-3 px-4">{record.description}</td>
                            <td className="py-3 px-4">ETB {record.cost}</td>
                            <td className="py-3 px-4">{record.serviceProvider}</td>
                            <td className="py-3 px-4">
                              <Badge className={getStatusColor(record.status)}>
                                {getStatusText(record.status)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">{record.nextServiceDate || "N/A"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Wrench className="h-8 w-8 mx-auto text-muted-foreground opacity-50 mb-2" />
                  <p className="text-muted-foreground">No maintenance records available</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button>Add Maintenance Record</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Incidents History Tab */}
        <TabsContent value="incidents" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Incident History</CardTitle>
              <CardDescription>Record of accidents and incidents</CardDescription>
            </CardHeader>
            <CardContent>
              {incidentRecords.length > 0 ? (
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/50">
                        <tr className="border-b">
                          <th className="py-3 px-4 text-left font-medium">Date</th>
                          <th className="py-3 px-4 text-left font-medium">Location</th>
                          <th className="py-3 px-4 text-left font-medium">Description</th>
                          <th className="py-3 px-4 text-left font-medium">Reported By</th>
                          <th className="py-3 px-4 text-left font-medium">Severity</th>
                          <th className="py-3 px-4 text-left font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {incidentRecords.map((record) => (
                          <tr key={record.id} className="border-b">
                            <td className="py-3 px-4">{record.date}</td>
                            <td className="py-3 px-4">{record.location}</td>
                            <td className="py-3 px-4">{record.description}</td>
                            <td className="py-3 px-4">{record.reportedBy}</td>
                            <td className="py-3 px-4">
                              <Badge className={getStatusColor(record.severity)}>
                                {record.severity}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <Badge className={getStatusColor(record.status)}>
                                {getStatusText(record.status)}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertTriangle className="h-8 w-8 mx-auto text-muted-foreground opacity-50 mb-2" />
                  <p className="text-muted-foreground">No incident records available</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button>Report Incident</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
