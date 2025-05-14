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
import { supabase } from "@/integrations/supabase/client";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

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
  made_in?: string;
  horse_power?: number;
  single_weight?: number;
  total_weight?: number;
  cylinder_count?: number;
  axle_count?: number;
  seats_count?: number;
  img_src?: string;
  libre_src?: string;
  responsible_staff_id?: number;
  driver_id?: number;
  insurance_company?: string;
  insurance_end_date?: string;
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
    mileage: 35420,
    made_in: "Japan",
    horse_power: 175,
    single_weight: 1850,
    total_weight: 2600,
    cylinder_count: 6,
    axle_count: 2,
    seats_count: 7,
    img_src: "/placeholder.svg",
    responsible_staff_id: 1,
    insurance_company: "Awash Insurance"
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
    made_in: "Japan",
    horse_power: 200,
    single_weight: 2100,
    total_weight: 2850,
    cylinder_count: 8,
    axle_count: 2,
    seats_count: 7,
    img_src: "/placeholder.svg",
    responsible_staff_id: 2,
    insurance_company: "Nyala Insurance" 
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
    made_in: "Thailand",
    horse_power: 150,
    single_weight: 1700,
    total_weight: 2500,
    cylinder_count: 4,
    axle_count: 2,
    seats_count: 5,
    img_src: "/placeholder.svg",
    responsible_staff_id: 3,
    driver_id: 5,
    insurance_company: "Ethiopia Insurance"
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
    made_in: "China",
    horse_power: 120,
    single_weight: 1300,
    total_weight: 1700,
    cylinder_count: 4,
    axle_count: 2,
    seats_count: 5,
    img_src: "/placeholder.svg",
    responsible_staff_id: 2,
    insurance_company: "Awash Insurance"
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
    made_in: "South Korea",
    horse_power: 140,
    single_weight: 1900,
    total_weight: 2600,
    cylinder_count: 4,
    axle_count: 2,
    seats_count: 12,
    img_src: "/placeholder.svg",
    responsible_staff_id: 1,
    driver_id: 6,
    insurance_company: "Nyala Insurance"
  },
  {
    id: "v6",
    name: "Mitsubishi L200",
    type: "Pickup",
    model: "L200 Double Cab",
    year: 2020,
    licensePlate: "AAU-7195",
    status: "outOfService" as const,
    lastLocation: "Field Research Site",
    mileage: 32140,
    made_in: "Thailand",
    horse_power: 130,
    single_weight: 1800,
    total_weight: 2400,
    cylinder_count: 4,
    axle_count: 2,
    seats_count: 5,
    img_src: "/placeholder.svg",
    responsible_staff_id: 4,
    insurance_company: "Ethiopia Insurance"
  },
  {
    id: "v7",
    name: "Ford Ranger",
    type: "Pickup",
    model: "Ranger Double Cab",
    year: 2021,
    licensePlate: "AAU-9234",
    status: "active" as const,
    lastLocation: "Agriculture College",
    mileage: 19750,
    made_in: "South Africa",
    horse_power: 160,
    single_weight: 1850,
    total_weight: 2500,
    cylinder_count: 4,
    axle_count: 2,
    seats_count: 5,
    img_src: "/placeholder.svg",
    responsible_staff_id: 5,
    insurance_company: "Awash Insurance"
  },
  {
    id: "v8",
    name: "Mercedes-Benz Sprinter",
    type: "Van",
    model: "Sprinter 315",
    year: 2020,
    licensePlate: "AAU-4587",
    status: "active" as const,
    lastLocation: "Student Center",
    mileage: 27340,
    made_in: "Germany",
    horse_power: 170,
    single_weight: 2300,
    total_weight: 3500,
    cylinder_count: 4,
    axle_count: 2,
    seats_count: 15,
    img_src: "/placeholder.svg",
    responsible_staff_id: 3,
    driver_id: 8,
    insurance_company: "Nyala Insurance"
  },
];

const Vehicles = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterLevelId, setFilterLevelId] = useState<number>(0);
  const [addVehicleOpen, setAddVehicleOpen] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [loading, setLoading] = useState(true);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Number of items per page
  
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
            year: v.made_year || 2020, // Using made_year from db as year in our interface
            licensePlate: v.plate_number,
            status: mapDatabaseStatus(v.status),
            lastLocation: v.location_id || '',
            mileage: v.km_reading || 0,
            made_in: v.made_in,
            horse_power: v.horse_power,
            single_weight: v.single_weight,
            total_weight: v.total_weight,
            cylinder_count: v.cylinder_count,
            axle_count: v.axle_count,
            seats_count: v.seats_count,
            img_src: v.img_src,
            libre_src: v.libre_src,
            responsible_staff_id: v.responsible_staff_id,
            driver_id: v.driver_id,
            insurance_company: v.insurance_company,
            insurance_end_date: v.insurance_end_date
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
  
  // Filter vehicles based on search query, status, and level
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      vehicle.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) || 
      vehicle.model.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || vehicle.status === filterStatus;
    // For the demo, we'll just consider any level filter as matching if the vehicle id is even or odd
    // In a real implementation, this would check if the vehicle belongs to the selected level
    const matchesLevel = filterLevelId === 0 || 
      (filterLevelId % 2 === 0 ? parseInt(vehicle.id.replace('v', '')) % 2 === 0 : parseInt(vehicle.id.replace('v', '')) % 2 !== 0);
    return matchesSearch && matchesStatus && matchesLevel;
  });
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredVehicles.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
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
    setFilterLevelId(0);
    setCurrentPage(1);
  };
  
  const handleFormSubmit = async (vehicleData: any) => {
    try {
      // Insert the vehicle into the database - using correct field names
      const { data, error } = await supabase
        .from('vehicles')
        .insert({
          type: vehicleData.type,
          model: vehicleData.model,
          made_year: vehicleData.made_year,
          plate_number: vehicleData.plate_number,
          status: vehicleData.status,
          fuel_type_id: vehicleData.fuel_type_id,
          color: vehicleData.color,
          chassis_number: vehicleData.chassis_number,
          motor_number: vehicleData.motor_number,
          horse_power: vehicleData.horse_power,
          single_weight: vehicleData.single_weight,
          total_weight: vehicleData.total_weight,
          axle_count: vehicleData.axle_count,
          cylinder_count: vehicleData.cylinder_count,
          km_reading: vehicleData.km_reading,
          is_private: vehicleData.is_private,
          made_in: vehicleData.made_in,
          seats_count: vehicleData.seats_count,
          responsible_staff_id: vehicleData.responsible_staff_id,
          driver_id: vehicleData.driver_id,
          insurance_company: vehicleData.insurance_company,
          insurance_end_date: vehicleData.insurance_end_date
        })
        .select();
      
      if (error) {
        toast.error('Failed to add vehicle: ' + error.message);
        return { success: false, error };
      }
      
      if (data && data.length > 0) {
        // Transform the new vehicle to match our interface
        const newVehicle: Vehicle = {
          id: data[0].id,
          name: data[0].type + ' ' + (data[0].model || ''),
          type: data[0].type,
          model: data[0].model || '',
          year: data[0].made_year || 2020, // Using made_year from db as year in our interface
          licensePlate: data[0].plate_number,
          status: mapDatabaseStatus(data[0].status),
          mileage: data[0].km_reading || 0,
          made_in: data[0].made_in,
          horse_power: data[0].horse_power,
          single_weight: data[0].single_weight,
          total_weight: data[0].total_weight,
          cylinder_count: data[0].cylinder_count,
          axle_count: data[0].axle_count,
          seats_count: data[0].seats_count,
          responsible_staff_id: data[0].responsible_staff_id,
          driver_id: data[0].driver_id,
          insurance_company: data[0].insurance_company,
          insurance_end_date: data[0].insurance_end_date
        };
        
        // Add the new vehicle to our state
        setVehicles([...vehicles, newVehicle]);
        setAddVehicleOpen(false);
        toast.success("Vehicle added successfully!");
        return { success: true, data: data[0] };
      }
      
      return { success: false };
    } catch (error: any) {
      console.error('Error adding vehicle:', error);
      toast.error('An unexpected error occurred');
      return { success: false, error };
    }
  };
  
  // Create an array of all page numbers
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  // Generate pagination items with ellipsis for large page counts
  const renderPaginationItems = () => {
    const items = [];
    
    if (totalPages <= 5) {
      // Render all page numbers if total pages is 5 or fewer
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink 
            isActive={1 === currentPage}
            onClick={() => handlePageChange(1)}
          >
            1
          </PaginationLink>
        </PaginationItem>
      );
      
      // Add ellipsis if current page is 4 or greater
      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink 
              isActive={i === currentPage}
              onClick={() => handlePageChange(i)}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
      
      // Add ellipsis if current page is totalPages-3 or less
      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      
      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink 
            isActive={totalPages === currentPage}
            onClick={() => handlePageChange(totalPages)}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };
  
  return (
    <>
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
              filterLevelId={filterLevelId}
              setFilterLevelId={setFilterLevelId}
            />
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
                  <VehiclesGrid vehicles={currentItems} resetFilters={resetFilters} />
                )}
              </TabsContent>
              
              <TabsContent value="list" className="animate-fade-in w-full">
                {loading ? (
                  <div className="flex justify-center p-8">
                    <p>Loading vehicles...</p>
                  </div>
                ) : (
                  <VehiclesList vehicles={currentItems} resetFilters={resetFilters} />
                )}
              </TabsContent>
              
              <div className="text-sm text-center text-muted-foreground mt-4 mb-6">
                Showing {currentItems.length} of {filteredVehicles.length} vehicles
              </div>
              
              {/* Pagination */}
              {filteredVehicles.length > itemsPerPage && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious 
                          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                          aria-disabled={currentPage === 1} 
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                      
                      {renderPaginationItems()}
                      
                      <PaginationItem>
                        <PaginationNext 
                          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                          aria-disabled={currentPage === totalPages}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </Tabs>
        </div>
        
        <Dialog open={addVehicleOpen} onOpenChange={setAddVehicleOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Vehicle</DialogTitle>
            </DialogHeader>
            <AddVehicleForm onSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default Vehicles;
