import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { VehicleCard } from "@/components/vehicles/VehicleCard";
import { AddVehicleForm } from "@/components/vehicles/AddVehicleForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Car, Plus, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const vehicles = [
  {
    id: "v1",
    name: "Toyota Land Cruiser",
    type: "SUV",
    model: "Land Cruiser Prado",
    year: 2020,
    licensePlate: "AAU-3201",
    status: "active" as const,
    lastLocation: "Main Campus, Addis Ababa",
    mileage: 35420,
  },
  {
    id: "v2",
    name: "Nissan Patrol",
    type: "SUV",
    model: "Patrol Y62",
    year: 2019,
    licensePlate: "AAU-1450",
    status: "active" as const,
    lastLocation: "Science Faculty, Addis Ababa",
    mileage: 42680,
  },
  {
    id: "v3",
    name: "Toyota Hilux",
    type: "Pickup",
    model: "Hilux Double Cab",
    year: 2021,
    licensePlate: "AAU-8742",
    status: "maintenance" as const,
    lastLocation: "Maintenance Center",
    mileage: 28750,
  },
  {
    id: "v4",
    name: "Toyota Corolla",
    type: "Sedan",
    model: "Corolla Altis",
    year: 2018,
    licensePlate: "AAU-5214",
    status: "active" as const,
    lastLocation: "Administration Building",
    mileage: 56300,
  },
  {
    id: "v5",
    name: "Hyundai H-1",
    type: "Van",
    model: "H-1 Wagon",
    year: 2019,
    licensePlate: "AAU-6390",
    status: "active" as const,
    lastLocation: "Engineering Faculty",
    mileage: 38450,
  },
  {
    id: "v6",
    name: "Mitsubishi L200",
    type: "Pickup",
    model: "L200 Double Cab",
    year: 2020,
    licensePlate: "AAU-7195",
    status: "unavailable" as const,
    lastLocation: "Field Research Site",
    mileage: 32140,
  },
];

const Vehicles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const { hasPermission } = useAuth();
  
  const canAddVehicle = hasPermission("add_vehicle");
  
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = 
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = filterStatus === "all" || vehicle.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddVehicleClick = () => {
    if (canAddVehicle) {
      setAddVehicleOpen(true);
    } else {
      toast.error("You don't have permission to add vehicles");
    }
  };

  return (
    <PageLayout>
      <div className="page-container">
        <div className="page-title-container">
          <h1 className="page-title">Vehicles</h1>
          <p className="page-description">Manage and monitor your fleet</p>
        </div>
        
        <div className="card-uniform">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            {canAddVehicle && (
              <Button className="gap-2" onClick={handleAddVehicleClick}>
                <Plus className="h-4 w-4" />
                Add Vehicle
              </Button>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search vehicles..." 
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select 
                value={filterStatus}
                onValueChange={setFilterStatus}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">In Maintenance</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        
          <div className="mb-4 flex justify-between items-center">
            <div className="text-sm text-muted-foreground">
              Showing {filteredVehicles.length} of {vehicles.length} vehicles
            </div>
            
            <Tabs defaultValue="grid" className="space-y-4">
              <TabsList>
                <TabsTrigger value="grid" className="gap-2">
                  <div className="grid grid-cols-2 gap-0.5 w-3 h-3">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                  Grid
                </TabsTrigger>
                <TabsTrigger value="list" className="gap-2">
                  <div className="flex flex-col gap-0.5 w-3">
                    <div className="h-0.5 w-full bg-current rounded-sm"></div>
                    <div className="h-0.5 w-full bg-current rounded-sm"></div>
                    <div className="h-0.5 w-full bg-current rounded-sm"></div>
                  </div>
                  List
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="grid" className="animate-fade-in">
                {filteredVehicles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredVehicles.map((vehicle) => (
                      <VehicleCard key={vehicle.id} vehicle={vehicle} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-muted rounded-full p-4 mb-4">
                      <Car className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No vehicles found</h3>
                    <p className="text-muted-foreground max-w-sm">
                      No vehicles match your current search criteria. Try adjusting your filters.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery("");
                        setFilterStatus("all");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="list" className="animate-fade-in">
                {filteredVehicles.length > 0 ? (
                  <div className="rounded-lg border border-border overflow-hidden">
                    <table className="w-full responsive-table">
                      <thead className="bg-muted/50">
                        <tr>
                          <th>Vehicle</th>
                          <th className="hidden md:table-cell">License Plate</th>
                          <th className="hidden lg:table-cell">Year</th>
                          <th className="hidden lg:table-cell">Mileage</th>
                          <th>Status</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredVehicles.map((vehicle) => (
                          <tr key={vehicle.id} className="hover:bg-muted/30 transition-colors">
                            <td>
                              <div>
                                <p className="font-medium">{vehicle.name}</p>
                                <p className="text-xs text-muted-foreground">{vehicle.model}</p>
                              </div>
                            </td>
                            <td className="hidden md:table-cell">
                              {vehicle.licensePlate}
                            </td>
                            <td className="hidden lg:table-cell">
                              {vehicle.year}
                            </td>
                            <td className="hidden lg:table-cell">
                              {vehicle.mileage.toLocaleString()} km
                            </td>
                            <td>
                              <span className={`status-badge ${
                                vehicle.status === 'active' 
                                  ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : vehicle.status === 'maintenance'
                                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                              </span>
                            </td>
                            <td className="text-right">
                              <Button variant="ghost" size="sm">Details</Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="bg-muted rounded-full p-4 mb-4">
                      <Car className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">No vehicles found</h3>
                    <p className="text-muted-foreground max-w-sm">
                      No vehicles match your current search criteria. Try adjusting your filters.
                    </p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => {
                        setSearchQuery("");
                        setFilterStatus("all");
                      }}
                    >
                      Reset Filters
                    </Button>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <Dialog open={addVehicleOpen} onOpenChange={setAddVehicleOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <AddVehicleForm onClose={() => setAddVehicleOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
};

export default Vehicles;
