import { Level } from '@/types/level';
import { apiClient } from "./apiClient";

export interface FlattenedLevel extends Level {
    depth: number;
    path: string;
}

export const flattenLevels = (levels: Level[]): FlattenedLevel[] => {
    const levelMap: { [id: number]: Level } = {};
    levels.forEach(level => {
        levelMap[level.id] = level;
    });

    const flattened: FlattenedLevel[] = [];

    const traverse = (level: Level, depth: number, path: string) => {
        const currentPath = path ? `${path} > ${level.name}` : level.name;
        flattened.push({
            ...level,
            depth,
            path: currentPath
        });

        level.children.forEach(childId => {
            const child = levelMap[childId];
            if (child) {
                traverse(child, depth + 1, currentPath);
            }
        });
    };

    // Find root levels (those without a parent or with a parent that doesn't exist)
    const rootLevels = levels.filter(level => level.parentId === null || !levelMap[level.parentId]);
    rootLevels.forEach(level => traverse(level, 0, ''));

    return flattened;
};

export const buildLevelOptions = (levels: Level[]) => {
    return levels.map(level => ({
        value: level.id.toString(),
        label: level.name,
    }));
};

// Add the missing getFlattenedLevels function
export const getFlattenedLevels = (includeStructural: boolean = true): FlattenedLevel[] => {
    try {
        const storedLevels = localStorage.getItem('levels');
        if (!storedLevels) return [];
        
        const levels: Level[] = JSON.parse(storedLevels);
        const filteredLevels = includeStructural ? levels : levels.filter(level => !level.isStructural);
        return flattenLevels(filteredLevels);
    } catch (error) {
        console.error('Error getting flattened levels:', error);
        return [];
    }
};

// Update the fetchAndStoreLevels to make a real API call
export const fetchAndStoreLevels = async () => {
    try {
        console.log('Fetching levels from backend...');
        const levels = await apiClient.levels.getAll();
        localStorage.setItem('levels', JSON.stringify(levels));
        console.log('Levels fetched and stored in localStorage.');
    } catch (error) {
        console.error('Error fetching and storing levels:', error);
    }
};
