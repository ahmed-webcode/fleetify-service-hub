
import { apiClient, Level } from "./apiClient";
import { toast } from "sonner";

// Interface for flattened level in the UI
export interface FlattenedLevel {
  id: number;
  name: string;
  path: string;
  depth: number;
  parentNames?: string; // Add this property
}

// Key used for localStorage
const LEVELS_STORAGE_KEY = 'app_organizational_levels';

/**
 * Fetches levels from the API and stores in localStorage
 */
export const fetchAndStoreLevels = async (): Promise<void> => {
  try {
    const levels = await apiClient.levels.getAll();
    localStorage.setItem(LEVELS_STORAGE_KEY, JSON.stringify(levels));
    console.log("Levels fetched and stored in localStorage");
  } catch (error) {
    console.error("Failed to fetch levels:", error);
    toast.error("Failed to load organizational levels");
    // Use mock data as fallback if available
    const mockLevels = getMockLevels();
    if (mockLevels && mockLevels.length > 0) {
      localStorage.setItem(LEVELS_STORAGE_KEY, JSON.stringify(mockLevels));
    }
  }
};

/**
 * Gets levels from localStorage
 */
export const getLevelsFromStorage = (): Level[] | null => {
  try {
    const levelsData = localStorage.getItem(LEVELS_STORAGE_KEY);
    if (!levelsData) return null;
    return JSON.parse(levelsData) as Level[];
  } catch (error) {
    console.error("Error retrieving levels from localStorage:", error);
    return null;
  }
};

/**
 * Flattens the hierarchical level structure for use in UI components
 * like dropdowns, with paths showing the hierarchy
 */
export const getFlattenedLevels = (): FlattenedLevel[] => {
  const levels = getLevelsFromStorage();
  if (!levels || levels.length === 0) return [];
  
  const result: FlattenedLevel[] = [];
  
  // Create a map for quick lookup
  const levelMap = new Map<number, Level>();
  levels.forEach(level => levelMap.set(level.id, level));
  
  // Helper function to get a level's path
  const getLevelPath = (level: Level): string => {
    const path: string[] = [];
    let current: Level | undefined = level;
    
    while (current) {
      path.unshift(current.name);
      if (current.parentId === null) break;
      current = levelMap.get(current.parentId);
    }
    
    return path.join(" > ");
  };
  
  // Process each level
  levels.forEach(level => {
    const path = getLevelPath(level);
    const depth = path.split(" > ").length - 1;
    
    result.push({
      id: level.id,
      name: level.name,
      path,
      depth
    });
  });
  
  // Sort by path for hierarchical display
  result.sort((a, b) => a.path.localeCompare(b.path));
  
  return result;
};

/**
 * Mock data for fallback
 */
const getMockLevels = (): Level[] => {
  return [
    {
        "parentId": null,
        "id": 1,
        "name": "University",
        "children": [2, 24, 32],
        "createdAt": null,
        "updatedAt": null
    },
    {
        "parentId": 1,
        "id": 2,
        "name": "Colleges",
        "children": [3, 6],
        "createdAt": null,
        "updatedAt": null
    },
    {
        "parentId": 2,
        "id": 3,
        "name": "College of Technology & Built Environment",
        "children": [],
        "createdAt": null,
        "updatedAt": null
    },
    {
        "parentId": 2,
        "id": 6,
        "name": "College of Business and Economics",
        "children": [],
        "createdAt": null,
        "updatedAt": null
    }
  ];
};
