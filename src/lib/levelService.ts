import { Level } from '@/types/level';

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
