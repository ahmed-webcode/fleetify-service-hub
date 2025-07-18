import { Control } from "react-hook-form";

interface VehicleStaffAndOwnershipProps {
    control: Control<any>;
    isLoadingUsers: boolean;
    staffUsers: any[];
    showDriverField: boolean;
    availableDrivers: any[];
}

// Staff and driver assignment is no longer part of the vehicle DTO.
export function VehicleStaffAndOwnership({
    control,
    isLoadingUsers,
    staffUsers,
    showDriverField,
    availableDrivers,
}: VehicleStaffAndOwnershipProps) {
    return (
        <div className="text-muted-foreground italic p-2">
            No staff or driver assignment required for the new vehicle schema.
        </div>
    );
}
