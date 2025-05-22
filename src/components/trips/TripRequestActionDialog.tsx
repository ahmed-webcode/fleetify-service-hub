import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { apiClient, TripRequestDto, ActionType, TripRequestActionDto } from "@/lib/apiClient"; // Adjust path

interface TripRequestActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  request: TripRequestDto | null;
  onActionComplete: () => void;
}

export function TripRequestActionDialog({
  isOpen,
  onClose,
  request,
  onActionComplete,
}: TripRequestActionDialogProps) {
  const [action, setAction] = useState<ActionType | undefined>(undefined);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!request || !action) {
      toast.error("Please select an action.");
      return;
    }
    if (action === ActionType.REJECT && !reason.trim()) {
      toast.error("Reason is required for rejection.");
      return;
    }

    setLoading(true);
    try {
      const actionData: TripRequestActionDto = {
        action: action,
        actionReason: reason || undefined,
      };
      await apiClient.trips.requests.act(request.id, actionData);
      toast.success(`Trip request ${action.toLowerCase()}ed successfully.`);
      onActionComplete();
      handleClose();
    } catch (error: any) {
      toast.error("Failed to process request: " + (error.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setAction(undefined);
    setReason("");
    onClose();
  };

  if (!request) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review Trip Request #{request.id}</DialogTitle>
          <DialogDescription>
            Approve or reject the trip request for: {request.purpose}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label htmlFor="action">Action</Label>
            <Select
              onValueChange={(value) => setAction(value as ActionType)}
              value={action}
            >
              <SelectTrigger id="action">
                <SelectValue placeholder="Select an action" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ActionType.APPROVE}>Approve</SelectItem>
                <SelectItem value={ActionType.REJECT}>Reject</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {(action === ActionType.REJECT || action === ActionType.APPROVE_WITH_MODIFICATION) && ( // Future: APPROVE_WITH_MODIFICATION
            <div>
              <Label htmlFor="reason">
                Reason {action === ActionType.REJECT ? "(Required)" : "(Optional)"}
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Provide a reason for your action"
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
          </DialogClose>
          <Button onClick={handleSubmit} disabled={loading || !action}>
            {loading ? "Processing..." : "Submit Action"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}