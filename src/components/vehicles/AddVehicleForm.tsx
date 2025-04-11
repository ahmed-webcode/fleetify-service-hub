import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DialogFooter } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

// Location Data
const centralDirectors = [
  "Executive Director",
  "Vice Executive Director for Academics",
  "Vice Executive Director for Research",
  "Administrative Director",
  "Finance Director",
  "Human Resource Director",
  "ICT Director",
  "Facility Management Director"
];

const colleges = [
  { name: "College of Business and Economics", campus: "FBE Campus, Commerce" },
  { name: "College of Social Science, Arts and Humanities", campus: "Main Campus, Yared Campus, Art Campus" },
  { name: "College of Veterinary Medicine and Agriculture", campus: "Debre Zeit Campus" },
  { name: "College of Technology and Built Environment", campus: "Technology, Built Environment" },
  { name: "College of Natural and Computational Sciences", campus: "4 Kilo Campus" },
  { name: "College of Education and Language Studies", campus: "5 Kilo Campus" },
  { name: "College of Health Science", campus: "Tikur Anbessa, Seferselam" },
  { name: "School of Law", campus: "Main Campus" }
];

const institutes = [
  { name: "Aklilu Lema Institute of Health Research (ALIHR)", location: "Tikur Anbessa" },
  { name: "Institute of Ethiopian Studies (IES)", location: "Central" },
  { name: "Institute of Water, Environment and Climate Research", location: "5 Kilo" },
  { name: "Institute of Social & Economic Research", location: "FBE" },
  { name: "Institute of Geophysics Space Science and Astronomy", location: "4 Kilo" },
  { name: "Institute of Peace and Security Studies", location: "Central" },
  { name: "Institute of Advanced Science and Technology", location: "5 Kilo" }
];

const projects = [
  { name: "NORHED Project", duration: "2023-2027", sponsor: "Norwegian Agency for Development Cooperation", cars: ["Toyota Land Cruiser", "Nissan Patrol"] },
  { name: "Thematic Research", duration: "2022-2025", sponsor: "Addis Ababa University", cars: ["Toyota Hilux", "Mitsubishi L200"] },
  { name: "Bill & Melinda Gates Project", duration: "2024-2026", sponsor: "Gates Foundation", cars: ["Toyota Land Cruiser", "Hyundai H-1"] },
  { name: "WHO Collaborative Research", duration: "2023-2024", sponsor: "World Health Organization", cars: ["Toyota Corolla", "Toyota Hilux"] },
  { name: "National Science Foundation", duration: "2021-2026", sponsor: "NSF", cars: ["Nissan Patrol", "Toyota Land Cruiser"] }
];

// Campus data based on college
const campuses = {
  "College of Business and Economics": ["FBE Campus", "Commerce Campus"],
  "College of Social Science, Arts and Humanities": ["Main Campus", "Yared Campus", "Art Campus"],
  "College of Veterinary Medicine and Agriculture": ["Debre Zeit Campus"],
  "College of Technology and Built Environment": ["Technology Campus", "Built Environment Campus"],
  "College of Natural and Computational Sciences": ["4 Kilo Campus"],
  "College of Education and Language Studies": ["5 Kilo Campus"],
  "College of Health Science": ["Tikur Anbessa Campus", "Seferselam Campus"],
  "School of Law": ["Main Campus"]
};

export function AddVehicleForm({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMobile = useIsMobile();
  
  // Location state
  const [locationType, setLocationType] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedCollege, setSelectedCollege] = useState<string>("");
  const [selectedCampus, setSelectedCampus] = useState<string>("");
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [showProjectFields, setShowProjectFields] = useState(false);
  const [showProjectCars, setShowProjectCars] = useState(false);
  const [selectedProjectCar, setSelectedProjectCar] = useState<string>("");
  
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Vehicle added successfully", {
        description: "The new vehicle has been added to the fleet."
      });
      onClose();
    }, 1500);
  };

  // Get project cars for the selected project
  const getProjectCars = () => {
    const project = projects.find(p => p.name === selectedProject);
    return project ? project.cars : [];
  };

  // Determine which dropdown to show based on location type
  const renderLocationDropdown = () => {
    if (!locationType) return null;
    
    switch (locationType) {
      case "central":
        return (
          <div className="space-y-2">
            <Label htmlFor="centralDirector">Central Director</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger id="centralDirector">
                <SelectValue placeholder="Select director" />
              </SelectTrigger>
              <SelectContent>
                {centralDirectors.map((director) => (
                  <SelectItem key={director} value={director}>
                    {director}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case "college":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="college">College</Label>
              <Select value={selectedCollege} onValueChange={(value) => {
                setSelectedCollege(value);
                setSelectedCampus("");
              }}>
                <SelectTrigger id="college">
                  <SelectValue placeholder="Select college" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((college) => (
                    <SelectItem key={college.name} value={college.name}>
                      {college.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedCollege && (
              <div className="space-y-2">
                <Label htmlFor="campus">Campus</Label>
                <Select value={selectedCampus} onValueChange={setSelectedCampus}>
                  <SelectTrigger id="campus">
                    <SelectValue placeholder="Select campus" />
                  </SelectTrigger>
                  <SelectContent>
                    {campuses[selectedCollege as keyof typeof campuses]?.map((campus) => (
                      <SelectItem key={campus} value={campus}>
                        {campus}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );
      
      case "institute":
        return (
          <div className="space-y-2">
            <Label htmlFor="institute">Institute</Label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger id="institute">
                <SelectValue placeholder="Select institute" />
              </SelectTrigger>
              <SelectContent>
                {institutes.map((institute) => (
                  <SelectItem key={institute.name} value={institute.name}>
                    {institute.name}
                    <span className="block text-xs text-muted-foreground">{institute.location}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );
      
      case "project":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="project">Project</Label>
              <Select value={selectedProject} onValueChange={(value) => {
                setSelectedProject(value);
                setSelectedProjectCar("");
              }}>
                <SelectTrigger id="project">
                  <SelectValue placeholder="Select project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project) => (
                    <SelectItem key={project.name} value={project.name}>
                      {project.name}
                      <span className="block text-xs text-muted-foreground">
                        Duration: {project.duration} | Sponsor: {project.sponsor}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedProject && (
              <div className="space-y-2">
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="showProjectFields"
                      checked={showProjectFields}
                      onChange={(e) => setShowProjectFields(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="showProjectFields">Add project details</Label>
                  </div>
                  
                  {showProjectFields && (
                    <div className="space-y-4 border rounded-md p-3 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="projectDuration">Project Duration</Label>
                        <Input id="projectDuration" placeholder="e.g. 2023-2026" />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="projectDocument">Project Document</Label>
                        <Input id="projectDocument" type="file" />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <input
                      type="checkbox"
                      id="showProjectCars"
                      checked={showProjectCars}
                      onChange={(e) => setShowProjectCars(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor="showProjectCars">Select from project vehicles</Label>
                  </div>
                  
                  {showProjectCars && (
                    <div className="space-y-4 border rounded-md p-3 mt-2">
                      <div className="space-y-2">
                        <Label htmlFor="projectCars">Project Vehicles</Label>
                        <Select value={selectedProjectCar} onValueChange={setSelectedProjectCar}>
                          <SelectTrigger id="projectCars">
                            <SelectValue placeholder="Select vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            {getProjectCars().map((car) => (
                              <SelectItem key={car} value={car}>
                                {car}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {selectedProjectCar && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Selected vehicle: {selectedProjectCar}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto p-1">
      <div className="space-y-2">
        <h3 className="text-lg font-medium flex items-center gap-2 flex-wrap">
          Location Information
          <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">የቦታ መረጃ</Badge>
        </h3>
        <Separator />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="locationType">Location Type</Label>
          <Select value={locationType} onValueChange={(value) => {
            setLocationType(value);
            setSelectedLocation("");
            setSelectedCollege("");
            setSelectedCampus("");
            setSelectedProject("");
            setSelectedProjectCar("");
            setShowProjectCars(false);
          }}>
            <SelectTrigger id="locationType">
              <SelectValue placeholder="Select location type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="central">Central</SelectItem>
              <SelectItem value="college">College</SelectItem>
              <SelectItem value="institute">Institute</SelectItem>
              <SelectItem value="project">Project</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {renderLocationDropdown()}
      </div>

      <div className="space-y-2 pt-2">
        <h3 className="text-lg font-medium flex items-center gap-2 flex-wrap">
          Vehicle Description
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">የትራንስportoርት መረጃ</Badge>
        </h3>
        <Separator />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleType">Vehicle Type</Label>
            <Select required>
              <SelectTrigger id="vehicleType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="suv">SUV</SelectItem>
                <SelectItem value="sedan">Sedan</SelectItem>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="van">Van</SelectItem>
                <SelectItem value="truck">Truck</SelectItem>
                <SelectItem value="bus">Bus</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="brand">Brand/Make</Label>
            <Input id="brand" placeholder="e.g. Toyota" required />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input id="model" placeholder="e.g. Land Cruiser" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input id="year" type="number" min="1990" max="2025" placeholder="e.g. 2012" required />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="licensePlate">License Plate</Label>
            <Input id="licensePlate" placeholder="e.g. HZJ76L-RKMRS" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chassisNumber">Chassis Number</Label>
            <Input id="chassisNumber" placeholder="e.g. JTEEB71J10-7017683" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="motorNumber">Motor Number</Label>
            <Input id="motorNumber" placeholder="e.g. 1HZ-0720146" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input id="color" placeholder="e.g. White" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="seats">Seats</Label>
            <Input id="seats" type="number" min="1" placeholder="e.g. 4" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fuelType">Fuel Type</Label>
            <Select>
              <SelectTrigger id="fuelType">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tankCapacity">Fuel Tank Capacity (L)</Label>
            <Input id="tankCapacity" type="number" min="0" placeholder="e.g. 130" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="consumption">Fuel Consumption (L/100km)</Label>
            <Input id="consumption" type="number" min="0" step="0.1" placeholder="e.g. 30.35" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="mileage">Current Mileage (km)</Label>
            <Input id="mileage" type="number" min="0" placeholder="e.g. 4164" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select defaultValue="active" required>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">In Maintenance</SelectItem>
                <SelectItem value="unavailable">Unavailable</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="horsePower">Horse Power</Label>
            <Input id="horsePower" type="number" min="0" placeholder="e.g. 150" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cylinderCount">Cylinder Count</Label>
            <Input id="cylinderCount" type="number" min="0" placeholder="e.g. 4" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="singleWeight">Single Weight (kg)</Label>
            <Input id="singleWeight" type="number" min="0" placeholder="e.g. 1500" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="totalWeight">Total Weight (kg)</Label>
            <Input id="totalWeight" type="number" min="0" placeholder="e.g. 2200" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="axleCount">Axle Count</Label>
            <Input id="axleCount" type="number" min="0" placeholder="e.g. 2" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="madeIn">Made In</Label>
            <Input id="madeIn" placeholder="e.g. Japan" />
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea id="notes" placeholder="Any additional information about the vehicle..." rows={3} />
      </div>
      
      <DialogFooter className={`flex ${isMobile ? 'flex-col gap-2' : 'flex-row gap-2'} mt-6`}>
        <Button type="button" variant="outline" onClick={onClose} className={isMobile ? 'w-full' : ''}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting} className={isMobile ? 'w-full' : ''}>
          {isSubmitting ? "Adding..." : "Add Vehicle"}
        </Button>
      </DialogFooter>
    </form>
  );
}
