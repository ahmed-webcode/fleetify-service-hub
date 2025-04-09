
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceRequestForm } from "@/components/services/ServiceRequestForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface FuelServiceRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FuelServiceRequestDialog({ isOpen, onClose }: FuelServiceRequestDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-6">
        <DialogHeader className="flex items-center justify-between">
          <DialogTitle className="text-2xl font-bold">New Fuel Request</DialogTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <ServiceRequestForm 
          defaultServiceType="fuel"
          isDialog={false}
        />
      </DialogContent>
    </Dialog>
  );
}
