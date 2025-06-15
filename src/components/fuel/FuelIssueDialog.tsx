
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { RecordType } from "@/types/fuel";
import { useQuery } from "@tanstack/react-query";

const RECORD_TYPE_LABELS = {
  [RecordType.EXTERNAL]: "External issue",
  [RecordType.QUOTA]: "Quota issue",
  [RecordType.REQUEST]: "Request issue",
};

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

  const [recordType, setRecordType] = useState<string>(RecordType.EXTERNAL);
  const [vehicleId, setVehicleId] = useState<string>("");
  const [fuelTypeId, setFuelTypeId] = useState<string>("");
  const [receiverId, setReceiverId] = useState<string>("");
  const [fuelRequestId, setFuelRequestId] = useState<string>("");
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
      apiClient.fuel.getFuelTypes().then(res => res as { id: number; name: string }[]),
  });

  // Fetch users for receiver
  const { data: users, isLoading: isLoadingUsers } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () =>
      apiClient.users.getAll({ size: 1000 }).then(res => res.content),
  });

  // Fetch fuel requests for fuelRequestId field
  const { data: fuelRequests, isLoading: isLoadingFuelRequests } = useQuery({
    queryKey: ["allFuelRequests"],
    queryFn: async () =>
      apiClient.fuel.requests.getAll({ page: 0, size: 100, sortBy: "requestedAt", direction: "DESC" }).then(res => res.content),
  });

  const handleSubmit = async () => {
    if (!recordType || !fuelTypeId || !issuedAmount) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (isNaN(Number(issuedAmount))) {
      toast.error("Amount must be a number.");
      return;
    }
    if (Number(issuedAmount) <= 0) {
      toast.error("Issued amount must be greater than 0.");
      return;
    }
    if (vehicleId && isNaN(Number(vehicleId))) {
      toast.error("Vehicle ID must be a number.");
      return;
    }
    // Validate receiverId if selected
    if (receiverId && isNaN(Number(receiverId))) {
      toast.error("Receiver selection error.");
      return;
    }
    // Validate fuelRequestId if selected
    if (fuelRequestId && isNaN(Number(fuelRequestId))) {
      toast.error("Fuel Request selection error.");
      return;
    }
    // Compile DTO, using null for blanks
    const dto = {
      recordType: recordType as RecordType,
      vehicleId: vehicleId ? Number(vehicleId) : null,
      receiverId: receiverId ? Number(receiverId) : null,
      fuelRequestId: fuelRequestId ? Number(fuelRequestId) : null,
      fuelTypeId: Number(fuelTypeId),
      issuedAmount: Number(issuedAmount),
    };

    setProcessing(true);
    try {
      await apiClient.fuel.records.issue(dto);
      toast.success("Fuel issued successfully!");
      setRecordType(RecordType.EXTERNAL);
      setVehicleId("");
      setFuelTypeId("");
      setReceiverId("");
      setFuelRequestId("");
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
          {/* Record Type */}
          <div>
            <label htmlFor="recordType" className="block text-xs font-medium mb-1">
              Record Type
            </label>
            <Select
              value={recordType}
              onValueChange={setRecordType}
              disabled={processing}
            >
              <SelectTrigger id="recordType">
                <SelectValue placeholder="Select record type" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(RECORD_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
                <SelectValue placeholder={isLoadingVehicles ? "Loading vehicles..." : "Select vehicle (optional)"} />
              </SelectTrigger>
              <SelectContent>
                {vehicles && vehicles.length > 0
                  ? vehicles.map((v: any) => (
                      <SelectItem key={v.id} value={String(v.id)}>
                        {v.plateNumber
                          ? `${v.plateNumber}${v.model ? " - " + v.model : ""}`
                          : `Vehicle #${v.id}`}
                      </SelectItem>
                    ))
                  : (
                    isLoadingVehicles
                      ? <SelectItem value="none" disabled>Loading...</SelectItem>
                      : <SelectItem value="none" disabled>No vehicles found</SelectItem>
                  )}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">(Optional)</span>
          </div>
          {/* Receiver Select */}
          <div>
            <label htmlFor="receiverId" className="block text-xs font-medium mb-1">
              Receiver
            </label>
            <Select
              value={receiverId}
              onValueChange={setReceiverId}
              disabled={processing || isLoadingUsers}
            >
              <SelectTrigger id="receiverId">
                <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Select receiver (optional)"} />
              </SelectTrigger>
              <SelectContent>
                {users && users.length > 0
                  ? users.map((u: any) => (
                      <SelectItem key={u.id} value={String(u.id)}>
                        {u.firstName} {u.lastName} {u.email && <span className="text-xs text-muted-foreground">({u.email})</span>}
                      </SelectItem>
                    ))
                  : (
                    isLoadingUsers
                      ? <SelectItem value="none" disabled>Loading...</SelectItem>
                      : <SelectItem value="none" disabled>No users found</SelectItem>
                  )}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">(Optional)</span>
          </div>
          {/* Fuel Request Select */}
          <div>
            <label htmlFor="fuelRequestId" className="block text-xs font-medium mb-1">
              Related Fuel Request
            </label>
            <Select
              value={fuelRequestId}
              onValueChange={setFuelRequestId}
              disabled={processing || isLoadingFuelRequests}
            >
              <SelectTrigger id="fuelRequestId">
                <SelectValue placeholder={isLoadingFuelRequests ? "Loading requests..." : "Select request (optional)"} />
              </SelectTrigger>
              <SelectContent>
                {fuelRequests && fuelRequests.length > 0
                  ? fuelRequests.map((fr: any) => (
                      <SelectItem key={fr.id} value={String(fr.id)}>
                        {/* Show fuel type, requestedBy, and vehicle or level name */}
                        {fr.fuelTypeName} - {fr.requestedAmount}L for {fr.vehiclePlateNumber || fr.levelName} (by {fr.requestedBy})
                      </SelectItem>
                    ))
                  : (
                    isLoadingFuelRequests
                      ? <SelectItem value="none" disabled>Loading...</SelectItem>
                      : <SelectItem value="none" disabled>No requests found</SelectItem>
                  )}
              </SelectContent>
            </Select>
            <span className="text-xs text-muted-foreground">(Optional)</span>
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
                {fuelTypes && fuelTypes.length > 0
                  ? fuelTypes.map((f: any) => (
                      <SelectItem key={f.id} value={String(f.id)}>
                        {f.name}
                      </SelectItem>
                    ))
                  : (
                    isLoadingFuelTypes
                      ? <SelectItem value="none" disabled>Loading...</SelectItem>
                      : <SelectItem value="none" disabled>No fuel types found</SelectItem>
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
