
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

/**
 * The Fuel Issue Dialog.
 *
 * Props:
 * - open: whether the dialog is open
 * - onOpenChange: function to open/close the dialog
 * - onSuccess: callback after a successful issue
 */
export default function FuelIssueDialog({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}) {
  const { user } = useAuth();

  const [vehicleId, setVehicleId] = useState("");
  const [fuelTypeId, setFuelTypeId] = useState("");
  const [issuedAmount, setIssuedAmount] = useState("");
  const [processing, setProcessing] = useState(false);

  // TODO: In production, fetch list of vehicles and fuel types for dropdowns. For now, allow manual entry.
  const handleSubmit = async () => {
    if (!vehicleId || !fuelTypeId || !issuedAmount) {
      toast.error("Please fill all fields.");
      return;
    }
    if (isNaN(Number(vehicleId)) || isNaN(Number(fuelTypeId)) || isNaN(Number(issuedAmount))) {
      toast.error("IDs and amount must be numbers.");
      return;
    }
    if (Number(issuedAmount) <= 0) {
      toast.error("Issued amount must be greater than 0.");
      return;
    }

    setProcessing(true);
    try {
      await apiClient.fuel.records.issue({
        recordType: "EXTERNAL",
        vehicleId: Number(vehicleId),
        fuelTypeId: Number(fuelTypeId),
        issuedAmount: Number(issuedAmount),
      });
      toast.success("Fuel issued successfully!");
      setVehicleId("");
      setFuelTypeId("");
      setIssuedAmount("");
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (e) {
      toast.error("Failed to issue fuel.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Issue Fuel</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div>
            <label htmlFor="vehicleId" className="block text-xs font-medium mb-1">
              Vehicle ID
            </label>
            <Input
              id="vehicleId"
              type="number"
              placeholder="Enter vehicle ID"
              value={vehicleId}
              onChange={e => setVehicleId(e.target.value)}
              disabled={processing}
              min={1}
              required
            />
          </div>
          <div>
            <label htmlFor="fuelTypeId" className="block text-xs font-medium mb-1">
              Fuel Type ID
            </label>
            <Input
              id="fuelTypeId"
              type="number"
              placeholder="Enter fuel type ID"
              value={fuelTypeId}
              onChange={e => setFuelTypeId(e.target.value)}
              disabled={processing}
              min={1}
              required
            />
          </div>
          <div>
            <label htmlFor="issuedAmount" className="block text-xs font-medium mb-1">
              Issued Amount (L)
            </label>
            <Input
              id="issuedAmount"
              type="number"
              placeholder="Enter issued amount"
              value={issuedAmount}
              onChange={e => setIssuedAmount(e.target.value)}
              disabled={processing}
              min={0.01}
              step={0.01}
              required
            />
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={processing}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={processing}>
              Issue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
