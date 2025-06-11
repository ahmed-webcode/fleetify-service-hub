export interface Level {
    id: number;
    parentId: number | null;
    name: string;
    children: number[];
    isStructural: boolean;
    createdAt: string | null;
    updatedAt: string | null;
}

export interface LightLevelDto {
    id: number;
    name: string;
}
