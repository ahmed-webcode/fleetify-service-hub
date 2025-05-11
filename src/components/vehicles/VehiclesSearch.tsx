
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LevelSelector } from "@/components/positions/LevelSelector";
import { useDebounce } from "@/hooks/useDebounce";
import { useState } from "react";

interface VehiclesSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterStatus: string;
  setFilterStatus: (status: string) => void;
  filterLevelId: number;
  setFilterLevelId: (levelId: number) => void;
}

export function VehiclesSearch({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterLevelId,
  setFilterLevelId
}: VehiclesSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const handleLevelChange = (levelId: number) => {
    setFilterLevelId(levelId);
  };

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
        <LevelSelector
          levelId={filterLevelId}
          onChange={handleLevelChange}
          useProjects={false}
          onSearchChange={setSearchTerm}
          searchTerm={searchTerm}
          debouncedSearchTerm={debouncedSearchTerm}
          levels={[]}
        />
      </div>
    </div>
  );
}
