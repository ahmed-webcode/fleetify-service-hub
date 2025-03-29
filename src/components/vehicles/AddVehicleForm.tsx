
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

export function AddVehicleForm({ onClose }: { onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium flex items-center gap-2">
          Owner Description
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">የባለሃብት መረጃ</Badge>
        </h3>
        <Separator />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="ownerName">Name</Label>
            <Input id="ownerName" placeholder="Full name" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="ownerAddress">Address</Label>
            <Input id="ownerAddress" placeholder="Address" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" placeholder="e.g. 0111-239798" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Registration Number</Label>
            <Input id="registrationNumber" placeholder="e.g. ኢ.ት-04-01-18006" />
          </div>
        </div>
      </div>

      <div className="space-y-2 pt-2">
        <h3 className="text-lg font-medium flex items-center gap-2">
          Vehicle Description
          <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-200">የትራንስፖርት መረጃ</Badge>
        </h3>
        <Separator />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Input id="model" placeholder="e.g. Land Cruiser" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="year">Year</Label>
            <Input id="year" type="number" min="1990" max="2025" placeholder="e.g. 2012" required />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="licensePlate">License Plate</Label>
            <Input id="licensePlate" placeholder="e.g. HZJ76L-RKMRS" required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="chassisNumber">Chassis Number</Label>
            <Input id="chassisNumber" placeholder="e.g. JTEEB71J10-7017683" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="motorNumber">Motor Number</Label>
            <Input id="motorNumber" placeholder="e.g. 1HZ-0720146" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input id="color" placeholder="e.g. White" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="tankCapacity">Fuel Tank Capacity (L)</Label>
            <Input id="tankCapacity" type="number" min="0" placeholder="e.g. 130" />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="consumption">Fuel Consumption (L/100km)</Label>
            <Input id="consumption" type="number" min="0" step="0.1" placeholder="e.g. 30.35" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea id="notes" placeholder="Any additional information about the vehicle..." rows={3} />
      </div>
      
      <DialogFooter>
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Vehicle"}
        </Button>
      </DialogFooter>
    </form>
  );
}
