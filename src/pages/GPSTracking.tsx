
import { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Map, CarFront, List, MapPin, RefreshCcw } from "lucide-react";
import MapView, { VehicleLocation } from "@/components/maps/MapView";
import VehicleLocationsList from "@/components/vehicles/VehicleLocationsList";
import VehicleLocationDetails from "@/components/vehicles/VehicleLocationDetails";
import { getVehicleLocations } from "@/data/vehicleLocations";
import { useToast } from "@/hooks/use-toast";

const GPSTracking = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Simulate API call to get vehicle locations
  useEffect(() => {
    const fetchVehicles = () => {
      setIsLoading(true);
      // Simulate network delay
      setTimeout(() => {
        const data = getVehicleLocations();
        setVehicles(data);
        setIsLoading(false);
      }, 800);
    };
    
    fetchVehicles();
  }, []);
  
  const handleRefresh = () => {
    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      // Add some randomness to the vehicle locations
      const updatedVehicles = getVehicleLocations().map(vehicle => {
        if (vehicle.status === 'active') {
          return {
            ...vehicle,
            latitude: vehicle.latitude + (Math.random() - 0.5) * 0.005,
            longitude: vehicle.longitude + (Math.random() - 0.5) * 0.005,
            lastUpdated: 'just now'
          };
        }
        return vehicle;
      });
      
      setVehicles(updatedVehicles);
      setIsLoading(false);
      
      toast({
        title: "Locations Updated",
        description: "Vehicle locations have been refreshed.",
      });
    }, 800);
  };
  
  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle) || null;
  
  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">GPS Tracking</h1>
          <p className="text-muted-foreground">Track and monitor your fleet in real-time</p>
        </div>
        
        <Button variant="outline" onClick={handleRefresh} disabled={isLoading}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          {isLoading ? "Refreshing..." : "Refresh"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card rounded-xl border p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CarFront className="h-5 w-5 text-primary" />
              <span>Vehicles</span>
            </h3>
            
            <div className="space-y-4">
              <Select value={selectedVehicle} onValueChange={setSelectedVehicle}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map(vehicle => (
                    <SelectItem key={vehicle.id} value={vehicle.id}>
                      {vehicle.name} ({vehicle.licensePlate})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="space-y-2">
                {vehicles.map((vehicle) => (
                  <div 
                    key={vehicle.id}
                    className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
                      selectedVehicle === vehicle.id 
                        ? "bg-primary/10 border-primary" 
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedVehicle(vehicle.id)}
                  >
                    <div className={`w-2 h-2 rounded-full ${
                      vehicle.status === 'active' ? "bg-green-500" : 
                      vehicle.status === 'parked' ? "bg-blue-500" : 
                      vehicle.status === 'maintenance' ? "bg-amber-500" : "bg-red-500"
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{vehicle.name}</p>
                      <p className="text-xs text-muted-foreground">{vehicle.licensePlate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <VehicleLocationDetails vehicle={selectedVehicleData} />
        </div>
        
        <div className="lg:col-span-3">
          <Tabs defaultValue="map" className="space-y-4">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="map" className="gap-2">
                <Map className="h-4 w-4" />
                Map View
              </TabsTrigger>
              <TabsTrigger value="list" className="gap-2">
                <List className="h-4 w-4" />
                List View
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="map" className="space-y-4">
              <MapView 
                selectedVehicle={selectedVehicle || null} 
                vehicles={vehicles}
              />
            </TabsContent>
            
            <TabsContent value="list" className="space-y-4">
              <VehicleLocationsList 
                vehicles={vehicles}
                selectedVehicle={selectedVehicle || null}
                onSelectVehicle={setSelectedVehicle}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default GPSTracking;
