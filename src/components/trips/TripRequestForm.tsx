
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { MapPin, Calendar, Clock, Users, X } from "lucide-react";
import { toast } from "sonner";

interface TripRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TripRequestForm({ isOpen, onClose }: TripRequestFormProps) {
  const [formData, setFormData] = useState({
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="flex flex-row justify-between items-center">
          <div>
            <DialogTitle>New Trip Request</DialogTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="purpose" className="text-sm font-medium flex items-center gap-1">
              Purpose <span className="text-red-500">*</span>
            </Label>
            <Input 
              id="purpose"
              name="purpose"
              placeholder="Brief description of trip purpose"
              value={formData.purpose}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="startLocation" className="text-sm font-medium flex items-center gap-1">
              Start Location <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="startLocation"
                name="startLocation"
                placeholder="e.g., AAU Main Campus"
                value={formData.startLocation}
                onChange={handleChange}
                className="pl-9"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="destination" className="text-sm font-medium flex items-center gap-1">
              Destination <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="destination"
                name="destination"
                placeholder="e.g., Ministry of Education"
                value={formData.destination}
                onChange={handleChange}
                className="pl-9"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate" className="text-sm font-medium flex items-center gap-1">
                Start Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="startDate"
                  name="startDate"
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="startTime" className="text-sm font-medium flex items-center gap-1">
                Start Time <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="startTime"
                  name="startTime"
                  type="time"
                  placeholder="--:-- --"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="endDate" className="text-sm font-medium flex items-center gap-1">
                End Date <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="endDate"
                  name="endDate"
                  type="date"
                  placeholder="mm/dd/yyyy"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="endTime" className="text-sm font-medium flex items-center gap-1">
                End Time <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-1">
                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  id="endTime"
                  name="endTime"
                  type="time"
                  placeholder="--:-- --"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="pl-9"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="passengers" className="text-sm font-medium flex items-center gap-1">
              Number of Passengers <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-1">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                id="passengers"
                name="passengers"
                type="number"
                min="1"
                placeholder="1"
                value={formData.passengers}
                onChange={handleChange}
                className="pl-9"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="notes" className="text-sm font-medium">
              Additional Notes
            </Label>
            <Textarea 
              id="notes"
              name="notes"
              placeholder="Any special requirements or information"
              value={formData.notes}
              onChange={handleChange}
              className="mt-1"
            />
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="mt-2 sm:mt-0"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
            >
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
