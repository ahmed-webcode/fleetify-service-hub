
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FuelRequestDto, RequestStatus, TargetType } from "@/lib/apiClient";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { CalendarClock, Car, Droplet, Info, User } from "lucide-react";

interface FuelRequestDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  request: FuelRequestDto | null;
}

export function FuelRequestDetailsDialog({
  isOpen,
  onClose,
  request,
}: FuelRequestDetailsDialogProps) {
  if (!request) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "MMM dd, yyyy HH:mm");
    } catch (e) {
      return dateString;
    }
  };

  const renderStatusBadge = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.PENDING:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</Badge>;
      case RequestStatus.APPROVED:
        return <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">Approved</Badge>;
      case RequestStatus.REJECTED:
        return <Badge variant="outline" className="bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400">Rejected</Badge>;
      case RequestStatus.CANCELLED:
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Fuel Request Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Request Status */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Request #{request.id}</h3>
            {renderStatusBadge(request.status)}
          </div>

          {/* Request Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Requested By</div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{request.requestedBy}</span>
              </div>
              <div className="text-xs text-muted-foreground">{request.levelName}</div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Requested At</div>
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4 text-muted-foreground" />
                <span>{formatDate(request.requestedAt)}</span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Target</div>
              <div className="flex items-center gap-2">
                {request.targetType === TargetType.VEHICLE ? (
                  <>
                    <Car className="h-4 w-4 text-muted-foreground" />
                    <span>Vehicle: {request.vehiclePlateNumber}</span>
                  </>
                ) : (
                  <>
                    <Droplet className="h-4 w-4 text-muted-foreground" />
                    <span>Generator</span>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Fuel Details</div>
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 text-muted-foreground" />
                <span>{request.fuelTypeName} - {request.requestedAmount} L</span>
              </div>
            </div>
          </div>

          {/* Request Note */}
          {request.requestNote && (
            <div className="space-y-2 border-t pt-4">
              <div className="text-sm font-medium text-muted-foreground">Request Note</div>
              <div className="p-3 bg-muted/50 rounded-md text-sm">
                {request.requestNote}
              </div>
            </div>
          )}

          {/* Action Information (For non-pending requests) */}
          {request.status !== RequestStatus.PENDING && (
            <div className="space-y-2 border-t pt-4">
              <div className="text-sm font-medium text-muted-foreground">Action Information</div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Acted By</div>
                  <div>{request.actedByName || "-"}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">Acted At</div>
                  <div>{formatDate(request.actedAt)}</div>
                </div>
                
                {request.status === RequestStatus.APPROVED && (
                  <div className="space-y-1">
                    <div className="text-xs text-muted-foreground">Approved Amount</div>
                    <div>{request.actedAmount} L</div>
                  </div>
                )}
              </div>
              
              {request.actionReason && (
                <div className="space-y-1 mt-2">
                  <div className="text-xs flex items-center gap-1 text-muted-foreground">
                    <Info className="h-3 w-3" />
                    <span>Reason</span>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-md text-sm">
                    {request.actionReason}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
