
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehiclesSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterPrivate: string;
  setFilterPrivate: (value: string) => void;
}

export function VehiclesSearch({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterPrivate,
  setFilterPrivate
}: VehiclesSearchProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 w-full">
      <div className="sm:col-span-1 md:col-span-5 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Search vehicles..." 
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      <div className="sm:col-span-1 md:col-span-4">
        <Select 
          value={filterStatus}
          onValueChange={setFilterStatus}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="z-50">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="maintenance">In Maintenance</SelectItem>
            <SelectItem value="outOfService">Out of Service</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="sm:col-span-2 md:col-span-3">
        <Select
          value={filterPrivate}
          onValueChange={setFilterPrivate}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by ownership" />
          </SelectTrigger>
          <SelectContent className="z-50">
            <SelectItem value="all">All Ownerships</SelectItem>
            <SelectItem value="private">Individually Owned</SelectItem>
            <SelectItem value="public">University Owned</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
