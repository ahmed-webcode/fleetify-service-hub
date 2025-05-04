
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AddVehicleForm } from "@/components/vehicles/AddVehicleForm";
import { VehiclesSearch } from "@/components/vehicles/VehiclesSearch";
import { VehiclesGrid } from "@/components/vehicles/VehiclesGrid";
import { VehiclesList } from "@/components/vehicles/VehiclesList";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/integrations/supabase/client";

// Define the Vehicle interface to match what's coming from the database
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

// Initial vehicles for fallback
const initialVehicles = [
  {
    id: "v1",
    name: "Toyota Land Cruiser",
    type: "SUV",
    model: "Land Cruiser Prado",
    year: 2020,
    licensePlate: "AAU-3201",
    status: "active" as const,
    lastLocation: "Main Campus, Addis Ababa",
    mileage: 35420
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
    mileage: 42680
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
    mileage: 28750
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
    mileage: 56300
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
    mileage: 38450
  },
  {
    id: "v6",
    name: "Mitsubishi L200",
    type: "Pickup",
    model: "L200 Double Cab",
    year: 2020,
    licensePlate: "AAU-7195",
    status: "outOfService" as const, // Changed from "unavailable" to "outOfService"
    lastLocation: "Field Research Site",
    mileage: 32140
  }
];

const Vehicles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [loading, setLoading] = useState(true);
  
  const {
    hasPermission
  } = useAuth();
  const canAddVehicle = hasPermission("add_vehicle");
  
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('vehicles')
          .select('*');
        
        if (error) {
          console.error('Error fetching vehicles:', error);
          toast.error('Failed to load vehicles');
        } else if (data && data.length > 0) {
          // Transform the data to match our Vehicle interface
          const transformedVehicles: Vehicle[] = data.map(v => ({
            id: v.id,
            name: v.type + ' ' + (v.model || ''),
            type: v.type || '',
            model: v.model || '',
            year: v.year || 2020,
            licensePlate: v.plate_number,
            status: mapDatabaseStatus(v.status),
            lastLocation: v.location_id || '',
            mileage: v.km_reading || 0
          }));
          setVehicles(transformedVehicles);
        }
      } catch (error) {
        console.error('Error in fetchVehicles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, []);
  
  // Helper function to map database status values to our Vehicle interface status
  const mapDatabaseStatus = (status?: string): "active" | "maintenance" | "outOfService" => {
    if (!status) return "active";
    
    switch (status.toLowerCase()) {
      case "available":
        return "active";
      case "maintenance":
        return "maintenance";
      case "out_of_service":
        return "outOfService";
      default:
        return "active";
    }
  };
  
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
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
  
  const resetFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
  };
  
  const handleFormSubmit = async (vehicleData: any) => {
    try {
      // Insert the vehicle into the database
      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          type: vehicleData.type,
          model: vehicleData.model,
          year: vehicleData.year,
          plate_number: vehicleData.plate_number,
          status: vehicleData.status,
          fuel_type: vehicleData.fuel_type,
          color: vehicleData.color,
          ownership: vehicleData.ownership,
          km_reading: vehicleData.km_reading || 0
        })
        .select();
      
      if (error) {
        toast.error('Failed to add vehicle: ' + error.message);
        return;
      }
      
      if (data && data.length > 0) {
        // Transform the new vehicle to match our interface
        const newVehicle: Vehicle = {
          id: data[0].id,
          name: data[0].type + ' ' + (data[0].model || ''),
          type: data[0].type,
          model: data[0].model || '',
          year: data[0].year || 2020,
          licensePlate: data[0].plate_number,
          status: mapDatabaseStatus(data[0].status),
          mileage: data[0].km_reading || 0
        };
        
        // Add the new vehicle to our state
        setVehicles([...vehicles, newVehicle]);
        setAddVehicleOpen(false);
        toast.success("Vehicle added successfully!");
      }
    } catch (error) {
      console.error('Error adding vehicle:', error);
      toast.error('An unexpected error occurred');
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} sidebarOpen={sidebarOpen} />
      <main className="flex-1 p-4 md:p-6">
        <div className="page-container">
          <div className="page-title-container">
            <h1 className="page-title">Vehicles</h1>
            <p className="page-description">Manage and monitor your fleet</p>
          </div>
          
          <div className="card-uniform">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 md:mb-6 gap-4">
              {canAddVehicle && (
                <Button className="gap-2 w-full md:w-auto" onClick={handleAddVehicleClick}>
                  <Plus className="h-4 w-4" />
                  Add Vehicle
                </Button>
              )}
              
              <VehiclesSearch 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                filterStatus={filterStatus} 
                setFilterStatus={setFilterStatus} 
              />
            </div>
          
            <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredVehicles.length} of {vehicles.length} vehicles
              </div>
              
              <Tabs defaultValue="grid" className="w-full sm:w-auto">
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
                
                <TabsContent value="grid" className="animate-fade-in w-full">
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <p>Loading vehicles...</p>
                    </div>
                  ) : (
                    <VehiclesGrid vehicles={filteredVehicles} resetFilters={resetFilters} />
                  )}
                </TabsContent>
                
                <TabsContent value="list" className="animate-fade-in w-full">
                  {loading ? (
                    <div className="flex justify-center p-8">
                      <p>Loading vehicles...</p>
                    </div>
                  ) : (
                    <VehiclesList vehicles={filteredVehicles} resetFilters={resetFilters} />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
          
          <Dialog open={addVehicleOpen} onOpenChange={setAddVehicleOpen}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Vehicle</DialogTitle>
              </DialogHeader>
              <AddVehicleForm onSubmit={handleFormSubmit} />
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
};

export default Vehicles;
