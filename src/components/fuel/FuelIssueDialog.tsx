import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { RecordType } from "@/types/fuel";
import { useQuery } from "@tanstack/react-query";

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

  const [vehicleId, setVehicleId] = useState<string>("");
  const [fuelTypeId, setFuelTypeId] = useState<string>("");
  const [issuedAmount, setIssuedAmount] = useState<string>("");

  const [processing, setProcessing] = useState(false);

  // Fetch vehicles and fuel types
  const { data: vehicles, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ["allVehicles"],
    queryFn: async () =>
      apiClient.vehicles.getAll({ size: 1000 }).then(res => res.content),
  });
  const { data: fuelTypes, isLoading: isLoadingFuelTypes } = useQuery({
    queryKey: ["allFuelTypes"],
    queryFn: async () =>
      apiClient.fuel.getFuelTypes().then(res => res), // changed here!
  });

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
        recordType: RecordType.EXTERNAL,
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
    } catch {
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
          {/* Vehicle Select */}
          <div>
            <label htmlFor="vehicleId" className="block text-xs font-medium mb-1">
              Vehicle
            </label>
            <Select
              value={vehicleId}
              onValueChange={setVehicleId}
              disabled={processing || isLoadingVehicles}
            >
              <SelectTrigger id="vehicleId">
                <SelectValue placeholder={isLoadingVehicles ? "Loading vehicles..." : "Select vehicle"} />
              </SelectTrigger>
              <SelectContent>
                {vehicles?.length
                  ? vehicles.map((v: any) => (
                      <SelectItem key={v.id} value={String(v.id)}>
                        {v.plateNumber
                          ? `${v.plateNumber}${v.model ? " - " + v.model : ""}`
                          : `Vehicle #${v.id}`}
                      </SelectItem>
                    ))
                  : (
                    <SelectItem value="" disabled>
                      {isLoadingVehicles ? "Loading..." : "No vehicles found"}
                    </SelectItem>
                  )}
              </SelectContent>
            </Select>
          </div>
          {/* Fuel Type Select */}
          <div>
            <label htmlFor="fuelTypeId" className="block text-xs font-medium mb-1">
              Fuel Type
            </label>
            <Select
              value={fuelTypeId}
              onValueChange={setFuelTypeId}
              disabled={processing || isLoadingFuelTypes}
            >
              <SelectTrigger id="fuelTypeId">
                <SelectValue placeholder={isLoadingFuelTypes ? "Loading fuel types..." : "Select fuel type"} />
              </SelectTrigger>
              <SelectContent>
                {fuelTypes?.length
                  ? fuelTypes.map((f: any) => (
                      <SelectItem key={f.id} value={String(f.id)}>
                        {f.name}
                      </SelectItem>
                    ))
                  : (
                    <SelectItem value="" disabled>
                      {isLoadingFuelTypes ? "Loading..." : "No fuel types found"}
                    </SelectItem>
                  )}
              </SelectContent>
            </Select>
          </div>
          {/* Amount */}
          <div>
            <label htmlFor="issuedAmount" className="block text-xs font-medium mb-1">
              Issued Amount (L)
            </label>
            <input
              id="issuedAmount"
              type="number"
              placeholder="Enter issued amount"
              value={issuedAmount}
              onChange={e => setIssuedAmount(e.target.value)}
              disabled={processing}
              min={0.01}
              step={0.01}
              required
              className="w-full focus:ring-2 focus:ring-blue-500 rounded border px-3 py-2"
            />
          </div>
          {/* Buttons */}
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
