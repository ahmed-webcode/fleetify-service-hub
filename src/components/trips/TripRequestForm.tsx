
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Clock, Users, X, Car, User } from "lucide-react";
import { toast } from "sonner";

interface TripRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TripRequestForm({ isOpen, onClose }: TripRequestFormProps) {
  const [formData, setFormData] = useState({
    vehicle: "",
    driver: "",
    purpose: "",
    startLocation: "",
    destination: "",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    passengers: "1",
    notes: ""
  });

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
    const requiredFields = ['purpose', 'startLocation', 'destination', 'startDate', 'startTime', 'endDate', 'endTime', 'passengers'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Submit the form
    toast.success("Trip request submitted successfully");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-6">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="text-2xl font-bold text-left">New Trip Request</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                <Label htmlFor="vehicle">Vehicle</Label>
              </div>
              <Select 
                value={formData.vehicle} 
                onValueChange={(value) => handleSelectChange("vehicle", value)}
              >
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="v1">Toyota Land Cruiser (AAU-3201)</SelectItem>
                  <SelectItem value="v2">Nissan Patrol (AAU-1450)</SelectItem>
                  <SelectItem value="v3">Toyota Hilux (AAU-8742)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <Label htmlFor="driver">Driver</Label>
              </div>
              <Select 
                value={formData.driver} 
                onValueChange={(value) => handleSelectChange("driver", value)}
              >
                <SelectTrigger id="driver">
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="d1">John Doe</SelectItem>
                  <SelectItem value="d2">Jane Smith</SelectItem>
                  <SelectItem value="d3">Michael Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose *</Label>
            <Input 
              id="purpose"
              name="purpose"
              placeholder="Purpose of the trip"
              value={formData.purpose}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <Label htmlFor="startLocation">Start Location *</Label>
              </div>
              <Input 
                id="startLocation"
                name="startLocation"
                placeholder="Starting point"
                value={formData.startLocation}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <Label htmlFor="destination">Destination *</Label>
              </div>
              <Input 
                id="destination"
                name="destination"
                placeholder="Destination"
                value={formData.destination}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <Label htmlFor="startDate">Start Date *</Label>
              </div>
              <div className="relative">
                <Input 
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <Label htmlFor="endDate">End Date *</Label>
              </div>
              <div className="relative">
                <Input 
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                />
                <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <Label htmlFor="startTime">Start Time *</Label>
              </div>
              <div className="relative">
                <Input 
                  id="startTime"
                  name="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={handleChange}
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <Label htmlFor="endTime">End Time *</Label>
              </div>
              <div className="relative">
                <Input 
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleChange}
                />
                <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <Label htmlFor="passengers">Number of Passengers *</Label>
            </div>
            <Input 
              id="passengers"
              name="passengers"
              type="number"
              min="1"
              value={formData.passengers}
              onChange={handleChange}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea 
              id="notes"
              name="notes"
              placeholder="Additional details about the trip"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
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
              className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto"
            >
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
