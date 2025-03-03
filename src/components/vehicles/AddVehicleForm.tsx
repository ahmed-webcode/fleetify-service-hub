
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DialogFooter } from "@/components/ui/dialog";

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Vehicle Name</Label>
          <Input id="name" placeholder="Toyota Land Cruiser" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="type">Vehicle Type</Label>
          <Select required>
            <SelectTrigger id="type">
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
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input id="model" placeholder="Land Cruiser Prado" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input id="year" type="number" min="1990" max="2025" placeholder="2023" required />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="licensePlate">License Plate</Label>
          <Input id="licensePlate" placeholder="AAU-1234" required />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mileage">Current Mileage (km)</Label>
          <Input id="mileage" type="number" min="0" placeholder="0" required />
        </div>
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
      
      <div className="space-y-2">
        <Label htmlFor="location">Current Location</Label>
        <Input id="location" placeholder="Main Campus, Addis Ababa" required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Additional Details</Label>
        <Textarea id="description" placeholder="Any additional information about the vehicle..." rows={3} />
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
