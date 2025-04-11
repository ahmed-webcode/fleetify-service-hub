
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehiclesSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
}

export function VehiclesSearch({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus
}: VehiclesSearchProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto">
      <div className="md:col-span-2 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search vehicles..." 
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <Select 
        value={filterStatus}
        onValueChange={setFilterStatus}
      >
        <SelectTrigger>
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="maintenance">In Maintenance</SelectItem>
          <SelectItem value="unavailable">Unavailable</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
