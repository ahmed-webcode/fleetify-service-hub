
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { ArrowLeft, Car, Fuel, Wrench, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data for the UI while APIs are being integrated
const mockVehicleDetails = {
  id: "v001",
  name: "Toyota Hiace",
  model: "Hiace",
  type: "Bus",
  year: 2018,
  licensePlate: "A12345",
  status: "active",
  mileage: 45000,
  lastLocation: "Main Campus",
  fuelType: "Diesel",
  fuelCapacity: 70,
  lastMaintenance: "2023-03-15",
  assignedDriver: "John Doe",
  department: "Engineering",
};

const mockFuelHistory = [
  { id: "f1", date: "2023-05-01", amount: 45.5, cost: 2275, location: "Central Station" },
  { id: "f2", date: "2023-04-15", amount: 40.2, cost: 2010, location: "North Station" },
  { id: "f3", date: "2023-03-28", amount: 50.0, cost: 2500, location: "East Station" },
  { id: "f4", date: "2023-03-10", amount: 35.8, cost: 1790, location: "Central Station" },
];

const mockMaintenanceHistory = [
  { id: "m1", date: "2023-03-15", type: "Regular Service", cost: 5000, description: "Oil change, filters, and general inspection" },
  { id: "m2", date: "2022-12-10", type: "Brake Replacement", cost: 8500, description: "Front brake pads and rotors replacement" },
  { id: "m3", date: "2022-09-22", type: "Tire Replacement", cost: 12000, description: "All four tires replaced" },
  { id: "m4", date: "2022-06-15", type: "Regular Service", cost: 4500, description: "Oil change, filters, and general inspection" },
];

const mockIncidentHistory = [
  { id: "i1", date: "2022-11-05", type: "Minor Accident", location: "University Gate", description: "Side mirror damaged in parking" },
  { id: "i2", date: "2022-07-12", type: "Breakdown", location: "Highway 5", description: "Vehicle overheated and required towing" },
];

export default function VehicleDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vehicle, setVehicle] = useState<any>(null);
  const [fuelHistory, setFuelHistory] = useState<any[]>([]);
  const [maintenanceHistory, setMaintenanceHistory] = useState<any[]>([]);
  const [incidentHistory, setIncidentHistory] = useState<any[]>([]);

  // Fetch vehicle data
  useEffect(() => {
    // In a real app, you would call your API here
    // apiClient.vehicles.getById(id)...

    // Using setTimeout to simulate API call
    const timer = setTimeout(() => {
      setVehicle(mockVehicleDetails);
      setFuelHistory(mockFuelHistory);
      setMaintenanceHistory(mockMaintenanceHistory);
      setIncidentHistory(mockIncidentHistory);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  const handleBack = () => {
    navigate(-1);
  };

  // Status badge style based on vehicle status
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-amber-100 text-amber-800";
      case "outOfService":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-8 w-[200px]" />
            <Skeleton className="h-4 w-[300px]" />
          </div>
          <Skeleton className="h-10 w-[100px]" />
        </div>
        
        <Skeleton className="h-[500px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">{vehicle.name}</h1>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(vehicle.status)}`}>
              {vehicle.status === "active"
                ? "Active"
                : vehicle.status === "maintenance"
                ? "In Maintenance"
                : "Out of Service"}
            </span>
          </div>
          <p className="text-muted-foreground">{vehicle.licensePlate} • {vehicle.model} • {vehicle.year}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Schedule Maintenance</Button>
          <Button>Edit Details</Button>
        </div>
      </div>

      {/* Main content with tabs */}
      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid grid-cols-4 md:w-[400px]">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="fuel">Fuel</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
        </TabsList>
        
        {/* General Information Tab */}
        <TabsContent value="general" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Vehicle Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-slate-600">Type</dt>
                    <dd>{vehicle.type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-slate-600">Model</dt>
                    <dd>{vehicle.model}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-slate-600">Year</dt>
                    <dd>{vehicle.year}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-slate-600">License Plate</dt>
                    <dd>{vehicle.licensePlate}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-slate-600">Current Mileage</dt>
                    <dd>{vehicle.mileage.toLocaleString()} km</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-slate-600">Fuel Type</dt>
                    <dd>{vehicle.fuelType}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-slate-600">Fuel Capacity</dt>
                    <dd>{vehicle.fuelCapacity} liters</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Assignment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-slate-600">Current Driver</dt>
                    <dd>{vehicle.assignedDriver}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-slate-600">Department</dt>
                    <dd>{vehicle.department}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-slate-600">Last Maintenance</dt>
                    <dd>{new Date(vehicle.lastMaintenance).toLocaleDateString()}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-sm font-medium text-slate-600">Last Known Location</dt>
                    <dd>{vehicle.lastLocation}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Fuel History Tab */}
        <TabsContent value="fuel">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Fuel className="h-5 w-5" />
                  Fuel History
                </CardTitle>
                <Button variant="outline" size="sm">Add Fuel Record</Button>
              </div>
            </CardHeader>
            <CardContent>
              {fuelHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount (L)</TableHead>
                      <TableHead>Cost (Birr)</TableHead>
                      <TableHead>Fuel Station</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fuelHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>{record.amount.toFixed(1)}</TableCell>
                        <TableCell>{record.cost.toLocaleString()}</TableCell>
                        <TableCell>{record.location}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-500">No fuel records found for this vehicle.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Maintenance History Tab */}
        <TabsContent value="maintenance">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Wrench className="h-5 w-5" />
                  Maintenance History
                </CardTitle>
                <Button variant="outline" size="sm">Schedule Maintenance</Button>
              </div>
            </CardHeader>
            <CardContent>
              {maintenanceHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Cost (Birr)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {maintenanceHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>{record.type}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">{record.description}</div>
                        </TableCell>
                        <TableCell>{record.cost.toLocaleString()}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-500">No maintenance records found for this vehicle.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Incidents Tab */}
        <TabsContent value="incidents">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Incident History
                </CardTitle>
                <Button variant="outline" size="sm">Report Incident</Button>
              </div>
            </CardHeader>
            <CardContent>
              {incidentHistory.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {incidentHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>{record.type}</TableCell>
                        <TableCell>{record.location}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">{record.description}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">View</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6">
                  <p className="text-slate-500">No incidents reported for this vehicle.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
