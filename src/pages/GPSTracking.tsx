
import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Map, CarFront, List, MapPin } from "lucide-react";

const GPSTracking = () => {
  const [selectedVehicle, setSelectedVehicle] = useState<string>("");
  
  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">GPS Tracking</h1>
          <p className="text-muted-foreground">Track and monitor your fleet in real-time</p>
        </div>
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
                  <SelectItem value="vehicle1">Toyota Land Cruiser (AAU-3201)</SelectItem>
                  <SelectItem value="vehicle2">Nissan Patrol (AAU-1450)</SelectItem>
                  <SelectItem value="vehicle3">Toyota Hilux (AAU-8742)</SelectItem>
                  <SelectItem value="vehicle4">Toyota Corolla (AAU-5214)</SelectItem>
                  <SelectItem value="vehicle5">Hyundai H-1 (AAU-6390)</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="space-y-2">
                {["vehicle1", "vehicle2", "vehicle3", "vehicle4", "vehicle5"].map((id, index) => (
                  <div 
                    key={id}
                    className={`p-3 rounded-lg border flex items-center gap-3 cursor-pointer transition-colors ${
                      selectedVehicle === id 
                        ? "bg-primary/10 border-primary" 
                        : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedVehicle(id)}
                  >
                    <div className={`w-2 h-2 rounded-full ${index < 3 ? "bg-green-500" : "bg-amber-500"}`} />
                    <div>
                      <p className="font-medium text-sm">
                        {index === 0 && "Toyota Land Cruiser"}
                        {index === 1 && "Nissan Patrol"}
                        {index === 2 && "Toyota Hilux"}
                        {index === 3 && "Toyota Corolla"}
                        {index === 4 && "Hyundai H-1"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {index === 0 && "AAU-3201"}
                        {index === 1 && "AAU-1450"}
                        {index === 2 && "AAU-8742"}
                        {index === 3 && "AAU-5214"}
                        {index === 4 && "AAU-6390"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border p-4">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <List className="h-5 w-5 text-primary" />
              <span>Details</span>
            </h3>
            
            {selectedVehicle ? (
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Current Speed</p>
                  <p className="font-medium">56 km/h</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Current Location</p>
                  <p className="font-medium">Main Campus, Addis Ababa</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-medium">2 minutes ago</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Driver</p>
                  <p className="font-medium">Mohammed Ahmed</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span> 
                    Active
                  </p>
                </div>
                
                <Button className="w-full mt-2">View Detailed History</Button>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Select a vehicle to view details</p>
            )}
          </div>
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
              <div className="bg-card rounded-xl border border-border flex items-center justify-center h-[600px] relative">
                <div className="absolute inset-0 bg-muted/30 flex items-center justify-center rounded-xl overflow-hidden">
                  <div className="bg-card p-8 rounded-lg flex flex-col items-center justify-center max-w-md text-center space-y-4">
                    <MapPin className="h-12 w-12 text-muted-foreground" />
                    <h3 className="text-xl font-medium">Map Integration Required</h3>
                    <p className="text-muted-foreground">
                      Real-time GPS tracking will be available after integrating with a maps service like Mapbox or Google Maps.
                    </p>
                    <Button>Configure Map Integration</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="list" className="space-y-4">
              <div className="bg-card rounded-xl border border-border overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium">Vehicle</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Driver</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Current Location</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Speed</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {[
                      { id: 'v1', vehicle: 'Toyota Land Cruiser', plate: 'AAU-3201', driver: 'Mohammed Ahmed', location: 'Main Campus, Addis Ababa', speed: '56 km/h', status: 'active', updated: '2 minutes ago' },
                      { id: 'v2', vehicle: 'Nissan Patrol', plate: 'AAU-1450', driver: 'Daniel Bekele', location: 'Science Faculty, Addis Ababa', speed: '0 km/h', status: 'parked', updated: '5 minutes ago' },
                      { id: 'v3', vehicle: 'Toyota Hilux', plate: 'AAU-8742', driver: 'Abebe Tadesse', location: 'Sidist Kilo Campus', speed: '32 km/h', status: 'active', updated: '1 minute ago' },
                      { id: 'v4', vehicle: 'Toyota Corolla', plate: 'AAU-5214', driver: 'Sara Haile', location: '6 Kilo Campus', speed: '0 km/h', status: 'inactive', updated: '45 minutes ago' },
                      { id: 'v5', vehicle: 'Hyundai H-1', plate: 'AAU-6390', driver: 'Yonas Gebru', location: 'Administration Building', speed: '27 km/h', status: 'active', updated: '8 minutes ago' },
                    ].map((vehicle) => (
                      <tr key={vehicle.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{vehicle.vehicle}</p>
                            <p className="text-xs text-muted-foreground">{vehicle.plate}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          {vehicle.driver}
                        </td>
                        <td className="py-3 px-4">
                          {vehicle.location}
                        </td>
                        <td className="py-3 px-4">
                          {vehicle.speed}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            vehicle.status === 'active' 
                              ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : vehicle.status === 'parked'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                          }`}>
                            {vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {vehicle.updated}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageLayout>
  );
};

export default GPSTracking;
