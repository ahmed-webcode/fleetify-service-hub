
import { useState } from "react";
import { Car, Calendar, Clock, MapPin, User, FileText, Fuel, Wrench, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

type ServiceType = "fleet" | "fuel" | "maintenance";

export function ServiceRequestForm() {
  const [serviceType, setServiceType] = useState<ServiceType>("fleet");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      // Show success toast - would need to add this functionality
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2">
          {(["fleet", "fuel", "maintenance"] as ServiceType[]).map((type) => (
            <ServiceTypeCard
              key={type}
              type={type}
              selected={serviceType === type}
              onClick={() => setServiceType(type)}
            />
          ))}
        </div>
        
        <div className="bg-card rounded-xl border border-border p-6 mt-6 animate-scale-in">
          <h3 className="text-lg font-medium mb-4">
            {serviceType === "fleet" && "Fleet Service Request"}
            {serviceType === "fuel" && "Fuel Service Request"}
            {serviceType === "maintenance" && "Maintenance Service Request"}
          </h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle</Label>
                <Select>
                  <SelectTrigger id="vehicle">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vehicle1">Toyota Land Cruiser (AAU-3201)</SelectItem>
                    <SelectItem value="vehicle2">Nissan Patrol (AAU-1450)</SelectItem>
                    <SelectItem value="vehicle3">Toyota Hilux (AAU-8742)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="requestDate">Request Date</Label>
                <Input type="date" id="requestDate" />
              </div>
            </div>
            
            {serviceType === "fleet" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="destination">Destination</Label>
                    <Input id="destination" placeholder="Where to?" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passengers">Number of Passengers</Label>
                    <Input id="passengers" type="number" min="1" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input type="date" id="startDate" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input type="date" id="endDate" />
                  </div>
                </div>
              </>
            )}
            
            {serviceType === "fuel" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fuelType">Fuel Type</Label>
                    <Select>
                      <SelectTrigger id="fuelType">
                        <SelectValue placeholder="Select fuel type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gasoline">Gasoline</SelectItem>
                        <SelectItem value="diesel">Diesel</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fuelAmount">Amount (Liters)</Label>
                    <Input id="fuelAmount" type="number" min="1" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentMileage">Current Mileage (km)</Label>
                  <Input id="currentMileage" type="number" min="0" />
                </div>
              </>
            )}
            
            {serviceType === "maintenance" && (
              <>
                <div className="space-y-2">
                  <Label>Maintenance Type</Label>
                  <RadioGroup defaultValue="preventive" className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="preventive" id="preventive" />
                      <Label htmlFor="preventive" className="font-normal">Preventive Maintenance</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="corrective" id="corrective" />
                      <Label htmlFor="corrective" className="font-normal">Corrective Maintenance</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maintenanceDetails">Maintenance Details</Label>
                  <Textarea 
                    id="maintenanceDetails" 
                    placeholder="Please describe the maintenance needs in detail..." 
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentMileage">Current Mileage (km)</Label>
                  <Input id="currentMileage" type="number" min="0" />
                </div>
              </>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea 
                id="notes" 
                placeholder="Any additional information..." 
                rows={2}
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" type="button">Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

interface ServiceTypeCardProps {
  type: ServiceType;
  selected: boolean;
  onClick: () => void;
}

function ServiceTypeCard({ type, selected, onClick }: ServiceTypeCardProps) {
  const typeConfig = {
    fleet: {
      icon: Truck,
      title: "Fleet Service",
      description: "Request vehicles for transportation needs"
    },
    fuel: {
      icon: Fuel,
      title: "Fuel Service",
      description: "Request fuel refill for vehicles"
    },
    maintenance: {
      icon: Wrench,
      title: "Maintenance",
      description: "Request vehicle maintenance or repairs"
    }
  };

  const config = typeConfig[type];

  return (
    <div 
      className={cn(
        "p-4 rounded-xl border cursor-pointer transition-all duration-300 press-animation",
        selected 
          ? "border-primary bg-primary/5" 
          : "border-border bg-card hover:bg-secondary/50"
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center p-2">
        <div 
          className={cn(
            "rounded-full p-3 mb-3",
            selected 
              ? "bg-primary/10 text-primary" 
              : "bg-secondary text-muted-foreground"
          )}
        >
          <config.icon className="h-6 w-6" />
        </div>
        <h3 className="font-medium">{config.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{config.description}</p>
      </div>
    </div>
  );
}
