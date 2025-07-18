import { useState, useEffect } from "react";
import { Car, Calendar, Clock, MapPin, User, FileText, Fuel, Wrench, Truck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type ServiceType = "fleet" | "fuel" | "maintenance";

interface ServiceRequestFormProps {
  defaultServiceType?: ServiceType;
  isDialog?: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onSubmitSuccess?: () => void;
}

export function ServiceRequestForm({ 
  defaultServiceType = "fleet", 
  isDialog = false,
  isOpen = false, 
  onClose = () => {},
  onSubmitSuccess = () => {}
}: ServiceRequestFormProps) {
  const [serviceType, setServiceType] = useState<ServiceType>(defaultServiceType);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    vehicle: "",
    requestDate: new Date().toISOString().split('T')[0],
    destination: "",
    passengers: "1",
    startDate: "",
    endDate: "",
    fuelType: "",
    fuelAmount: "",
    currentMileage: "",
    fuelStation: "",
    maintenanceType: "preventive",
    maintenanceDetails: "",
    notes: ""
  });

  useEffect(() => {
    setServiceType(defaultServiceType);
  }, [defaultServiceType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocumentFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let requiredFields: string[] = ['vehicle', 'requestDate'];
    
    if (serviceType === 'fleet') {
      requiredFields = [...requiredFields, 'destination', 'passengers', 'startDate', 'endDate'];
    } else if (serviceType === 'fuel') {
      requiredFields = [...requiredFields, 'fuelType', 'fuelAmount', 'currentMileage'];
    } else if (serviceType === 'maintenance') {
      requiredFields = [...requiredFields, 'maintenanceDetails', 'currentMileage'];
    }
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      setIsSubmitting(false);
      toast.error(`Please fill in all required fields`);
      return;
    }
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Request submitted successfully", {
        description: `Your ${serviceType} service request has been submitted.`
      });
      
      if (documentFiles.length > 0) {
        console.log("Files uploaded:", documentFiles);
      }
      
      if (isDialog && onClose) {
        onClose();
      }
      
      onSubmitSuccess();
    }, 1500);
  };

  const formContent = (
    <form onSubmit={handleSubmit} className="space-y-4">
      {!isDialog && (
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
        </div>
      )}
      
      <div className={cn(
        "space-y-6",
        isDialog ? "" : "bg-card rounded-xl border border-border p-6 mt-6 animate-scale-in"
      )}>
        {!isDialog && (
          <h3 className="text-lg font-medium mb-4">
            {serviceType === "fleet" && "Fleet Service Request"}
            {serviceType === "fuel" && "Fuel Service Request"}
            {serviceType === "maintenance" && "Maintenance Service Request"}
          </h3>
        )}
        
        <div className="space-y-4">
          <div className={cn(
            "grid gap-4",
            serviceType === "fuel" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          )}>
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle {isDialog && "*"}</Label>
              <Select
                value={formData.vehicle}
                onValueChange={(value) => handleSelectChange("vehicle", value)}
              >
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
            
            {serviceType === "fuel" && (
              <div className="space-y-2">
                <Label htmlFor="requestDate">Request Date {isDialog && "*"}</Label>
                <div className="relative">
                  <Input
                    type="date"
                    id="requestDate"
                    name="requestDate"
                    value={formData.requestDate}
                    onChange={handleChange}
                  />
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            )}
          </div>
          
          {serviceType === "fleet" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination</Label>
                  <Input 
                    id="destination"
                    name="destination"
                    placeholder="Where to?"
                    value={formData.destination}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passengers">Number of Passengers</Label>
                  <Input 
                    id="passengers"
                    name="passengers"
                    type="number"
                    min="1"
                    value={formData.passengers}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <div className="relative">
                    <Input 
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <div className="relative">
                    <Input 
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
            </>
          )}
          
          {serviceType === "fuel" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fuelType">Fuel Type {isDialog && "*"}</Label>
                  <Select
                    value={formData.fuelType}
                    onValueChange={(value) => handleSelectChange("fuelType", value)}
                  >
                    <SelectTrigger id="fuelType">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gasoline">Gasoline</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="petrol">Petrol</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fuelAmount">Amount (Liters) {isDialog && "*"}</Label>
                  <Input
                    id="fuelAmount"
                    name="fuelAmount"
                    type="number"
                    min="1"
                    value={formData.fuelAmount}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentMileage">Current Mileage (km) {isDialog && "*"}</Label>
                <Input
                  id="currentMileage"
                  name="currentMileage"
                  type="number"
                  min="0"
                  value={formData.currentMileage}
                  onChange={handleChange}
                />
              </div>
              
              {isDialog && (
                <div className="space-y-2">
                  <Label htmlFor="fuelStation">Fuel Station Name</Label>
                  <Input
                    id="fuelStation"
                    name="fuelStation"
                    placeholder="e.g., Total Bole"
                    value={formData.fuelStation}
                    onChange={handleChange}
                  />
                </div>
              )}
            </>
          )}
          
          {serviceType === "maintenance" && (
            <>
              <div className="space-y-2">
                <Label>Maintenance Type</Label>
                <RadioGroup 
                  defaultValue="preventive" 
                  className="flex flex-col space-y-1"
                  value={formData.maintenanceType}
                  onValueChange={(value) => handleSelectChange("maintenanceType", value)}
                >
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
                  name="maintenanceDetails" 
                  placeholder="Please describe the maintenance needs in detail..." 
                  rows={3}
                  value={formData.maintenanceDetails}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="currentMileage">Current Mileage (km)</Label>
                <Input 
                  id="currentMileage"
                  name="currentMileage"
                  type="number"
                  min="0"
                  value={formData.currentMileage}
                  onChange={handleChange}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="documentUpload">Upload Supporting Documents</Label>
                <div className="border border-dashed border-border rounded-md p-4">
                  <Input
                    id="documentUpload"
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Upload any relevant documents (e.g., inspection reports, photos)
                  </p>
                </div>
                {documentFiles.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-1">{documentFiles.length} file(s) selected:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {documentFiles.map((file, index) => (
                        <li key={index} className="truncate">
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea 
              id="notes"
              name="notes" 
              placeholder="Any additional information..." 
              rows={3}
              value={formData.notes}
              onChange={handleChange}
            />
          </div>
          
          <div className={cn(
            "flex gap-4",
            isDialog ? "justify-between mt-6" : "justify-end mt-6"
          )}>
            <Button 
              variant="outline" 
              type="button"
              onClick={isDialog ? onClose : undefined}
              className={isDialog ? "w-full md:w-auto" : ""}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className={cn(
                "bg-blue-600 hover:bg-blue-700",
                isDialog ? "w-full md:w-auto" : ""
              )}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );

  if (isDialog) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[550px] p-6 max-h-[95vh] overflow-y-auto">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">
              {serviceType === "fuel" && "New Fuel Request"}
              {serviceType === "fleet" && "New Trip Request"}
              {serviceType === "maintenance" && "New Maintenance Request"}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose} 
              className="h-8 w-8 rounded-full absolute right-4 top-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {formContent}
    </div>
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
