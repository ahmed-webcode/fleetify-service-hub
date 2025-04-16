import { useState, useEffect, useCallback } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Map, CarFront, List, RefreshCcw, Clock } from "lucide-react";
import MapView, { VehicleLocation } from "@/components/maps/MapView";
import VehicleLocationsList from "@/components/vehicles/VehicleLocationsList";
import VehicleLocationDetails from "@/components/vehicles/VehicleLocationDetails";
import { getVehicleLocations, simulateVehicleMovement } from "@/data/vehicleLocations";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const GPSTracking = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  const [vehicles, setVehicles] = useState<VehicleLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<number>(10);
  const { toast } = useToast();
  
  const refreshVehicleData = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      if (vehicles.length === 0) {
        const data = getVehicleLocations();
        setVehicles(data);
      } else {
        const updatedVehicles = simulateVehicleMovement(vehicles);
        setVehicles(updatedVehicles);
      }
      
      setIsLoading(false);
      
      toast({
        title: "Locations Updated",
        description: "Vehicle locations have been refreshed.",
      });
    }, 800);
  }, [vehicles, toast]);
  
  useEffect(() => {
    refreshVehicleData();
  }, []);
  
  useEffect(() => {
    if (!autoRefresh) return;
    
    const intervalId = setInterval(() => {
      refreshVehicleData();
    }, refreshInterval * 1000);
    
    return () => clearInterval(intervalId);
  }, [autoRefresh, refreshInterval, refreshVehicleData]);
  
  const selectedVehicleData = vehicles.find(v => v.id === selectedVehicle) || null;
  
  const activeVehicles = vehicles.filter(v => v.status === 'active').length;
  const parkedVehicles = vehicles.filter(v => v.status === 'parked').length;
  const maintenanceVehicles = vehicles.filter(v => v.status === 'maintenance').length;
  const unavailableVehicles = vehicles.filter(v => v.status === 'unavailable').length;
  
  return (
    <PageLayout>
      <div className="page-container">
        <div className="page-title-container">
          <h1 className="page-title">GPS Tracking</h1>
          <p className="page-description">Track and monitor your fleet in real-time</p>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="auto-refresh"
                checked={autoRefresh}
                onCheckedChange={setAutoRefresh}
              />
              <Label htmlFor="auto-refresh" className="cursor-pointer">Auto Refresh</Label>
            </div>
            
            {autoRefresh && (
              <Select
                value={refreshInterval.toString()}
                onValueChange={(val) => setRefreshInterval(parseInt(val))}
              >
                <SelectTrigger className="w-[120px]">
                  <Clock className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Interval" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 seconds</SelectItem>
                  <SelectItem value="10">10 seconds</SelectItem>
                  <SelectItem value="30">30 seconds</SelectItem>
                  <SelectItem value="60">1 minute</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
          
          <Button variant="outline" onClick={refreshVehicleData} disabled={isLoading}>
            <RefreshCcw className="h-4 w-4 mr-2" />
            {isLoading ? "Refreshing..." : "Refresh"}
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Active</h3>
              <p className="text-2xl font-bold">{activeVehicles}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Parked</h3>
              <p className="text-2xl font-bold">{parkedVehicles}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Maintenance</h3>
              <p className="text-2xl font-bold">{maintenanceVehicles}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-amber-500"></div>
            </div>
          </Card>
          
          <Card className="p-4 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">Unavailable</h3>
              <p className="text-2xl font-bold">{unavailableVehicles}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
            </div>
          </Card>
        </div>
        
        <div className="card-uniform">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-card rounded-xl border p-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <CarFront className="h-5 w-5 text-primary" />
                  <span>Vehicles</span>
                </h3>
                
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
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
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
        </div>
      </div>
    </PageLayout>
  );
};

export default GPSTracking;
