
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Clock, Car } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TripRequestForm } from "@/components/trips/TripRequestForm";
import { useAuth } from "@/contexts/AuthContext";

export default function TripRequests() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [view, setView] = useState("pending");
  const { hasPermission } = useAuth();
  
  // Mock trip request data
  const tripRequests = [
    {
      id: "TR-2404",
      purpose: "Meeting at Ministry of Education",
      startLocation: "AAU Main Campus",
      destination: "Ministry of Education HQ",
      startDate: "2025-03-15",
      startTime: "09:00",
      endDate: "2025-03-15", 
      endTime: "14:00",
      passengers: 2,
      status: "pending"
    },
    {
      id: "TR-2403",
      purpose: "Field research at agricultural site",
      startLocation: "College of Agriculture",
      destination: "Debre Zeit Research Center",
      startDate: "2025-03-14",
      startTime: "08:30",
      endDate: "2025-03-14", 
      endTime: "17:00",
      passengers: 5,
      status: "approved"
    },
    {
      id: "TR-2402",
      purpose: "Student transport for conference",
      startLocation: "Technology Campus",
      destination: "Hilton Hotel Conference Center",
      startDate: "2025-03-12",
      startTime: "08:00",
      endDate: "2025-03-12", 
      endTime: "18:00",
      passengers: 12,
      status: "completed"
    },
    {
      id: "TR-2401",
      purpose: "Equipment transport",
      startLocation: "Main Campus",
      destination: "Science Faculty",
      startDate: "2025-03-10",
      startTime: "10:00",
      endDate: "2025-03-10", 
      endTime: "12:00",
      passengers: 2,
      status: "rejected"
    },
  ];
  
  // Filter trips based on current view
  const filteredTrips = tripRequests.filter(trip => {
    if (view === "all") return true;
    return trip.status === view;
  });
  
  const canRequestTrip = hasPermission("request_fleet");
  const canApproveTrip = hasPermission("approve_fleet");

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Trip Requests</h1>
          <p className="text-muted-foreground">Request and manage vehicle trips</p>
        </div>
        
        {canRequestTrip && (
          <Button 
            className="gap-2 bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={() => setIsFormOpen(true)}
          >
            <Plus className="h-4 w-4" />
            New Trip Request
          </Button>
        )}
      </div>
      
      <Tabs 
        defaultValue="pending" 
        value={view} 
        onValueChange={setView}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <TabsList className="h-auto p-1 w-full md:w-auto overflow-auto">
            <TabsTrigger value="pending" className="text-sm">Pending</TabsTrigger>
            <TabsTrigger value="approved" className="text-sm">Approved</TabsTrigger>
            <TabsTrigger value="completed" className="text-sm">Completed</TabsTrigger>
            <TabsTrigger value="rejected" className="text-sm">Rejected</TabsTrigger>
            <TabsTrigger value="all" className="text-sm">All Requests</TabsTrigger>
          </TabsList>
          
          <Button variant="outline" size="sm" className="gap-2 w-full md:w-auto">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
        
        <TabsContent value={view} className="animate-fade-in">
          {filteredTrips.length > 0 ? (
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium">ID</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Purpose</th>
                      <th className="text-left py-3 px-4 text-sm font-medium hidden md:table-cell">Destination</th>
                      <th className="text-left py-3 px-4 text-sm font-medium hidden lg:table-cell">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium">Status</th>
                      <th className="text-right py-3 px-4 text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredTrips.map((trip) => (
                      <tr key={trip.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 font-medium">{trip.id}</td>
                        <td className="py-3 px-4">{trip.purpose}</td>
                        <td className="py-3 px-4 hidden md:table-cell">{trip.destination}</td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          {new Date(trip.startDate).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            trip.status === 'completed' 
                              ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : trip.status === 'approved'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : trip.status === 'pending'
                              ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                              : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                          }`}>
                            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">Details</Button>
                            {canApproveTrip && trip.status === 'pending' && (
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                              >
                                Approve
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-muted rounded-full p-4 mb-4">
                <Car className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No trip requests found</h3>
              <p className="text-muted-foreground max-w-sm">
                There are no trip requests matching your current filter.
              </p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setView("all")}
              >
                View All Requests
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      <TripRequestForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}
