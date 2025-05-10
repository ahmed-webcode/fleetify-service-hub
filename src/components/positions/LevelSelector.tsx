
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, Search, Loader } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { apiClient, ProjectOption } from "@/lib/apiClient";
import { FlattenedLevel } from "@/lib/levelService";

interface LevelSelectorProps {
  levelId: number;
  onChange: (value: number) => void;
  useProjects: boolean;
  onSearchChange: (value: string) => void;
  searchTerm: string;
  debouncedSearchTerm: string;
  levels: FlattenedLevel[];
}

export const LevelSelector = ({
  levelId,
  onChange,
  useProjects,
  onSearchChange,
  searchTerm,
  debouncedSearchTerm,
  levels,
}: LevelSelectorProps) => {
  const [open, setOpen] = useState(false);

  // Fetch projects when using projects mode and search term is present
  const {
    data: projects = [] as ProjectOption[],
    isLoading: isLoadingProjects,
  } = useQuery({
    queryKey: ["projects", debouncedSearchTerm],
    queryFn: () => apiClient.projects.searchAutocomplete(debouncedSearchTerm),
    enabled: useProjects && debouncedSearchTerm.length > 2,
  });

  // Get selected item label
  const getSelectedLabel = (): string => {
    if (levelId === 0) return "Select level";

    if (useProjects) {
      // Now TypeScript knows projects is ProjectOption[]
      const project = projects.find((p: ProjectOption) => p.id === levelId);
      return project ? project.name : "Select level";
    } else {
      const level = levels.find((l) => l.id === levelId);
      return level ? level.path : "Select level";
    }
  };

  // Reset selection when switching between projects and levels mode
  useEffect(() => {
    onChange(0);
  }, [useProjects, onChange]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          <span className="truncate">{getSelectedLabel()}</span>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <Command shouldFilter={false}>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <Input
              placeholder={
                useProjects
                  ? "Search for projects..."
                  : "Search for organizational levels..."
              }
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="flex h-10 w-full rounded-md border-0 bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          
          {useProjects ? (
            <CommandList>
              {debouncedSearchTerm.length > 0 ? (
                <>
                  {isLoadingProjects ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader className="h-4 w-4 animate-spin opacity-50" />
                      <span className="ml-2 text-sm text-muted-foreground">Searching projects...</span>
                    </div>
                  ) : (
                    <>
                      {/* Now TypeScript knows projects is ProjectOption[] */}
                      {projects.length === 0 ? (
                        <CommandEmpty>No projects found.</CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {projects.map((project: ProjectOption) => (
                            <CommandItem
                              key={project.id}
                              value={project.id.toString()}
                              onSelect={() => {
                                onChange(project.id);
                                setOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  levelId === project.id
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {project.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </>
                  )}
                </>
              ) : (
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Type at least 3 characters to search for projects
                </div>
              )}
            </CommandList>
          ) : (
            <CommandList>
              {levels.length === 0 ? (
                <CommandEmpty>No levels found.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {levels
                    .filter((level) =>
                      searchTerm 
                        ? level.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          level.path.toLowerCase().includes(searchTerm.toLowerCase())
                        : true
                    )
                    .map((level) => (
                      <CommandItem
                        key={level.id}
                        value={level.id.toString()}
                        onSelect={() => {
                          onChange(level.id);
                          setOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            levelId === level.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span
                          className="truncate"
                          style={{
                            paddingLeft: `${level.depth * 16}px`,
                          }}
                        >
                          {level.name}
                        </span>
                      </CommandItem>
                    ))}
                </CommandGroup>
              )}
            </CommandList>
          )}
        </Command>
      </PopoverContent>
    </Popover>
  );
};
