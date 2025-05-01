
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

// Mock vehicles data for the dropdown
const vehicles = [
  { id: "v1", name: "Toyota Land Cruiser", plate: "AAU-3201", fuelType: "diesel" },
  { id: "v2", name: "Nissan Patrol", plate: "AAU-1450", fuelType: "diesel" },
  { id: "v3", name: "Toyota Hilux", plate: "AAU-8742", fuelType: "diesel" },
  { id: "v4", name: "Toyota Corolla", plate: "AAU-5214", fuelType: "gasoline" },
  { id: "v5", name: "Hyundai H-1", plate: "AAU-6390", fuelType: "diesel" },
  { id: "v6", name: "Mitsubishi L200", plate: "AAU-7195", fuelType: "diesel" },
];

interface FuelServiceRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FuelServiceRequestDialog({
  isOpen,
  onClose,
}: FuelServiceRequestDialogProps) {
  const [vehicleId, setVehicleId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [justification, setJustification] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [vehicleFuelType, setVehicleFuelType] = useState<string>("");

  const filteredVehicles = vehicles.filter(vehicle => {
    const query = searchQuery.toLowerCase();
    return (
      vehicle.name.toLowerCase().includes(query) ||
      vehicle.plate.toLowerCase().includes(query)
    );
  });

  // Update fuel type when vehicle is selected
  useEffect(() => {
    if (vehicleId) {
      const selectedVehicle = vehicles.find(v => v.id === vehicleId);
      if (selectedVehicle) {
        setVehicleFuelType(selectedVehicle.fuelType);
      }
    } else {
      setVehicleFuelType("");
    }
  }, [vehicleId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission with the vehicle's fuel type
    console.log({
      vehicleId,
      fuelType: vehicleFuelType, // Use the vehicle's fuel type
      amount,
      justification,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Fuel Request</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicle">Vehicle</Label>
            <div className="relative">
              <Select 
                value={vehicleId} 
                onValueChange={setVehicleId}
                onOpenChange={(open) => {
                  if (open) {
                    setShowSearch(true);
                  } else {
                    setTimeout(() => setShowSearch(false), 200);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {showSearch && (
                    <div className="flex items-center border-b p-2 sticky top-0 bg-popover z-10">
                      <Search className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Input
                        placeholder="Search vehicles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        autoFocus
                      />
                    </div>
                  )}
                  {filteredVehicles.length > 0 ? (
                    filteredVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name} ({vehicle.plate})
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-6 text-center text-muted-foreground">
                      No vehicles found
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {vehicleFuelType && (
            <div className="space-y-2">
              <Label>Fuel Type</Label>
              <div className="p-2 bg-muted/30 border rounded-md">
                {vehicleFuelType.charAt(0).toUpperCase() + vehicleFuelType.slice(1)}
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (Liters)</Label>
            <Input
              id="amount"
              type="number"
              min="1"
              placeholder="Enter amount in liters"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="justification">Justification</Label>
            <Textarea
              id="justification"
              placeholder="Explain why you need this fuel request"
              rows={4}
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!vehicleId}>Submit Request</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
