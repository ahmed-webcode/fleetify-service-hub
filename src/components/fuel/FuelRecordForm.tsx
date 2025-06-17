
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Fuel, Calendar, X } from "lucide-react";
import { toast } from "sonner";

interface FuelRecordFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const FUEL_TYPES = ["Gasoline", "Diesel", "Petrol"];

export function FuelRecordForm({ isOpen, onClose }: FuelRecordFormProps) {
  const [formData, setFormData] = useState({
    vehicleId: "",
    date: new Date().toISOString().split('T')[0],
    odometer: "",
    liters: "",
    fuelType: "Gasoline",
    costPerLiter: "",
    totalCost: "0.00",
    station: "",
    notes: ""
  });

  // Calculate total cost when liters or cost per liter changes
  useEffect(() => {
    if (formData.liters && formData.costPerLiter) {
      const liters = parseFloat(formData.liters);
      const costPerLiter = parseFloat(formData.costPerLiter);
      
      if (!isNaN(liters) && !isNaN(costPerLiter)) {
        const totalCost = (liters * costPerLiter).toFixed(2);
        setFormData(prev => ({ ...prev, totalCost }));
      }
    }
  }, [formData.liters, formData.costPerLiter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['vehicleId', 'date', 'odometer', 'liters', 'fuelType', 'costPerLiter'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Submit the form
    toast.success("Fuel record saved successfully");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-6 max-h-[95vh] overflow-y-auto">
        <DialogHeader className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fuel className="h-5 w-5" />
            <DialogTitle className="text-2xl font-bold">Add Fuel Record</DialogTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        <p className="text-muted-foreground mt-1 mb-4">Enter details about your fuel purchase</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleId">Vehicle</Label>
            <Select 
              value={formData.vehicleId} 
              onValueChange={(value) => handleSelectChange("vehicleId", value)}
            >
              <SelectTrigger id="vehicleId">
                <SelectValue placeholder="Select a vehicle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="v1">Toyota Land Cruiser (AAU-3201)</SelectItem>
                <SelectItem value="v2">Nissan Patrol (AAU-1450)</SelectItem>
                <SelectItem value="v3">Toyota Hilux (AAU-8742)</SelectItem>
                <SelectItem value="v4">Toyota Corolla (AAU-5214)</SelectItem>
                <SelectItem value="v5">Hyundai H-1 (AAU-6390)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <div className="relative">
                <Input 
                  id="date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="odometer">Odometer (km)</Label>
              <Input 
                id="odometer"
                name="odometer"
                placeholder="Current odometer reading"
                value={formData.odometer}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="liters">Liters</Label>
              <Input 
                id="liters"
                name="liters"
                placeholder="Amount of fuel"
                value={formData.liters}
                onChange={handleChange}
                type="number"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fuelType">Fuel Type</Label>
              <Select 
                value={formData.fuelType} 
                onValueChange={(value) => handleSelectChange("fuelType", value)}
              >
                <SelectTrigger id="fuelType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FUEL_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="costPerLiter">Cost Per Liter ($)</Label>
              <Input 
                id="costPerLiter"
                name="costPerLiter"
                placeholder="2.5"
                value={formData.costPerLiter}
                onChange={handleChange}
                type="number"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalCost">Total Cost ($)</Label>
              <Input 
                id="totalCost"
                name="totalCost"
                value={formData.totalCost}
                readOnly
                disabled
                className="bg-gray-50"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="station">Fuel Station</Label>
            <Input 
              id="station"
              name="station"
              placeholder="Where was the vehicle refueled?"
              value={formData.station}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea 
              id="notes"
              name="notes"
              placeholder="Any additional notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
            />
          </div>
          
          <div className="flex gap-4 justify-end pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="w-full md:w-auto"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gray-600 hover:bg-gray-700 text-white w-full md:w-auto"
            >
              Save Record
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
