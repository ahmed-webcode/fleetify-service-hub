import { Control } from "react-hook-form";

interface VehicleTechnicalDetailsProps {
    control: Control<any>;
}

// All technical details fields are deprecated in the new backend schema.
export function VehicleTechnicalDetails({ control }: VehicleTechnicalDetailsProps) {
    return (
        <div className="text-muted-foreground italic p-2">
            No technical details required for the new vehicle schema.
        </div>
    );
}
