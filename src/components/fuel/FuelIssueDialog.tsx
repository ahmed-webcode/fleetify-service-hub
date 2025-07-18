import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiClient } from "@/lib/apiClient";
import { toast } from "sonner";
import { FuelRequestStatus, RecordType } from "@/types/fuel";
import { useQuery } from "@tanstack/react-query";

const RECORD_TYPE_LABELS = {
  [RecordType.REQUEST]: "Request Issue",
  [RecordType.QUOTA]: "Quota Issue",
  [RecordType.EXTERNAL]: "External Issue",
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

  // Form fields state
  const [recordType, setRecordType] = useState<RecordType>(RecordType.REQUEST);
  const [vehicleId, setVehicleId] = useState<string>("");
  const [fuelTypeId, setFuelTypeId] = useState<string>("");
  const [receiverId, setReceiverId] = useState<string>("");
  const [fuelRequestId, setFuelRequestId] = useState<string>("");
  const [issuedAmount, setIssuedAmount] = useState<string>("");

  const [processing, setProcessing] = useState(false);

  // Data queries
  const { data: vehicles = [], isLoading: isLoadingVehicles } = useQuery({
    queryKey: ["allVehicles"],
    queryFn: async () => apiClient.vehicles.getAll({ size: 1000 }).then(res => res.content),
    enabled: recordType === RecordType.QUOTA,
  });

  const { data: users = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => {
      const users = await apiClient.users.getAll();
      return users.filter((user) => user.roles.map((role) => role.id).includes(9)); // only have officier (role_id=9) users
    },
    enabled: recordType === RecordType.QUOTA || recordType === RecordType.EXTERNAL,
  });

  const { data: fuelTypes = [], isLoading: isLoadingFuelTypes } = useQuery({
    queryKey: ["allFuelTypes"],
    queryFn: async () => apiClient.fuel.getFuelTypes().then(res => res as { id: number; name: string }[]),
    enabled: recordType !== RecordType.REQUEST,
  });

  const { data: fuelRequests = [], isLoading: isLoadingFuelRequests } = useQuery({
    queryKey: ["allFuelRequests"],
    queryFn: async () => {
      const requests = await apiClient.fuel.requests.getAll({ page: 0, size: 100, sortBy: "requestedAt", direction: "DESC" }).then(res => res.content);
      return requests.filter((req)=>req.status === FuelRequestStatus.APPROVED);
    },
    enabled: recordType === RecordType.REQUEST,
  });

  // Autofill logic - NO property access to fuelTypeId/fuelType on FuelRequestDto
  const selectedRequest = useMemo(
    () => fuelRequests.find((fr: any) => String(fr.id) === fuelRequestId),
    [fuelRequests, fuelRequestId]
  );

  // Field visibility logic
  const showVehicle = recordType === RecordType.QUOTA;
  const showReceiver = recordType === RecordType.QUOTA;
  const showFuelType = recordType !== RecordType.REQUEST;
  const showFuelRequest = recordType === RecordType.REQUEST;

  // Handle record type change (clear incompatible fields)
  const handleRecordTypeChange = (val: RecordType) => {
    setRecordType(val);
    setVehicleId("");
    setFuelTypeId("");
    setReceiverId("");
    setFuelRequestId("");
  };

  // Compose the submission DTO according to backend rules
  const buildDto = () => {
    if (recordType === RecordType.REQUEST) {
      if (!fuelRequestId || !issuedAmount) return null;
      return {
        recordType,
        fuelRequestId: Number(fuelRequestId),
        issuedAmount: Number(issuedAmount),
        // For validation: the backend ignores this for recordType == REQUEST,
        // but it's required by our frontend type.
        fuelTypeId: 0,
      };
    } else if (recordType === RecordType.QUOTA) {
      if (!vehicleId || !fuelTypeId || !issuedAmount || !receiverId) return null;
      return {
        recordType,
        vehicleId: Number(vehicleId),
        fuelTypeId: Number(fuelTypeId),
        issuedAmount: Number(issuedAmount),
        receiverId: Number(receiverId),
      }
    } else if (recordType === RecordType.EXTERNAL) {
      if (!fuelTypeId || !issuedAmount) return null;
      // Receiver, vehicle, request are optional and not required
      return {
        recordType,
        fuelTypeId: Number(fuelTypeId),
        issuedAmount: Number(issuedAmount),
        receiverId: receiverId ? Number(receiverId) : null,
        vehicleId: vehicleId ? Number(vehicleId) : null,
        fuelRequestId: fuelRequestId ? Number(fuelRequestId) : null,
      }
    }
    return null;
  };

  const handleSubmit = async () => {
    const dto = buildDto();
    if (!dto) {
      toast.error("Please fill all required fields.");
      return;
    }
    if (isNaN(Number(issuedAmount)) || Number(issuedAmount) <= 0) {
      toast.error("Amount must be a number > 0.");
      return;
    }
    setProcessing(true);
    try {
      await apiClient.fuel.records.issue(dto);
      toast.success("Fuel issued successfully!");
      // Reset all states
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
              onValueChange={val => handleRecordTypeChange(val as RecordType)}
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

          {/* Fuel Request (if REQUEST) */}
          {showFuelRequest && (
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
                  <SelectValue placeholder={isLoadingFuelRequests ? "Loading requests..." : "Select request"} />
                </SelectTrigger>
                <SelectContent>
                  {fuelRequests.length > 0
                    ? fuelRequests.map((fr: any) => (
                        <SelectItem key={fr.id} value={String(fr.id)}>
                          {/* Show what is available */}
                          {fr.fuelTypeName} - {fr.requestedAmount}L for{" "}
                          {fr.vehiclePlateNumber || fr.levelName} (by {fr.requestedBy})
                        </SelectItem>
                      ))
                    : (
                        isLoadingFuelRequests
                        ? <SelectItem value="none" disabled>Loading...</SelectItem>
                        : <SelectItem value="none" disabled>No requests found</SelectItem>
                      )}
                </SelectContent>
              </Select>
              {/* Optionally show more info about selectedRequest */}
              {selectedRequest && (
                <div className="text-xs mt-1 text-muted-foreground">
                  Requester: {selectedRequest.requestedBy} | Requested: {selectedRequest.requestedAmount}L | Fuel: {selectedRequest.fuelTypeName}
                </div>
              )}
            </div>
          )}

          {/* Vehicle (QUOTA only) */}
          {showVehicle && (
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
                  {vehicles.length > 0
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
            </div>
          )}

          {/* Receiver (QUOTA/EXTERNAL) */}
          {showReceiver && (
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
                  <SelectValue placeholder={isLoadingUsers ? "Loading users..." : "Select receiver"} />
                </SelectTrigger>
                <SelectContent>
                  {users.length > 0
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
            </div>
          )}

          {/* Fuel Type (not needed for REQUEST, it will be derived) */}
          {showFuelType && (
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
                  {fuelTypes.length > 0
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
          )}

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
