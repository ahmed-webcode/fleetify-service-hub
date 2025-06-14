
import { useState, useEffect } from 'react';
import { LightLevelDto } from '@/types/level';
import { apiClient } from '@/lib/apiClient';
import { FlattenedLevel } from '@/lib/levelService';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';

interface LevelSelectorProps {
  useProjects: boolean;
  levelId: number;
  onChange: (levelId: number) => void;
  onSearchChange: (value: string) => void;
  searchTerm: string;
  debouncedSearchTerm: string;
  levels: FlattenedLevel[];
}

export const LevelSelector = ({
  useProjects,
  levelId,
  onChange,
  onSearchChange,
  searchTerm,
  debouncedSearchTerm,
  levels
}: LevelSelectorProps) => {
  const [projects, setProjects] = useState<LightLevelDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Convert levelId to string for Select component
  const selectedValue = levelId ? levelId.toString() : "";
  
  // Find the selected level name for display
  const selectedLevelName = levels.find(level => level.id === levelId)?.name || "";

  // Handle selection change
  const handleSelectionChange = (value: string) => {
    // Convert string value back to number
    onChange(parseInt(value, 10));
  };

  // Fetch projects when search term changes
  useEffect(() => {
    if (useProjects && debouncedSearchTerm.length > 0) {
      const fetchProjects = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const data = await apiClient.projects.searchAutocomplete(debouncedSearchTerm);
          setProjects(data.content);
        } catch (err: any) {
          setError(err.message || 'Failed to fetch projects');
          setProjects([]);
        } finally {
          setIsLoading(false);
        }
      };

      fetchProjects();
    } else {
      setProjects([]);
    }
  }, [useProjects, debouncedSearchTerm]);

  // Render the appropriate selector based on useProjects flag
  if (useProjects) {
    return (
      <div className="relative">
        <Input
          placeholder="Search for a project..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {isLoading && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          </div>
        )}
        
        {debouncedSearchTerm && !isLoading && (
          <div className="absolute w-full mt-1 border rounded-md bg-white shadow-lg z-50 max-h-60 overflow-auto">
            {error ? (
              <div className="p-2 text-red-500 text-sm">{error}</div>
            ) : projects.length === 0 ? (
              <div className="p-2 text-gray-500 text-sm">No projects found</div>
            ) : (
              projects.map((project) => (
                <div
                  key={project.id}
                  className={`p-2 hover:bg-gray-100 cursor-pointer ${levelId === project.id ? 'bg-blue-50' : ''}`}
                  onClick={() => onChange(project.id)}
                >
                  {project.name}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    );
  }

  // Regular level selector with non-structural levels only
  return (
    <Select value={selectedValue} onValueChange={handleSelectionChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a level">
          {selectedLevelName || "Select a level"}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Levels</SelectLabel>
          {levels.map((level) => (
            <SelectItem key={level.id} value={level.id.toString()}>
              {level.name} {level.depth > 0 && `(${level.path.split(' > ').slice(0, -1).join(' > ')})`}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
