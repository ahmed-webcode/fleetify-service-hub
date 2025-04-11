
import { Button } from "@/components/ui/button";
import { Car } from "lucide-react";

interface NoVehiclesFoundProps {
  resetFilters: () => void;
}

export function NoVehiclesFound({ resetFilters }: NoVehiclesFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted rounded-full p-4 mb-4">
        <Car className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">No vehicles found</h3>
      <p className="text-muted-foreground max-w-sm">
        No vehicles match your current search criteria. Try adjusting your filters.
      </p>
      <Button 
        variant="outline" 
        className="mt-4"
        onClick={resetFilters}
      >
        Reset Filters
      </Button>
    </div>
  );
}
