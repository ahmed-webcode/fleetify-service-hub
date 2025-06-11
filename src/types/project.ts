// Types for Project Management
export interface Project {
    id: number;
    name: string;
    description?: string;
    startDate: string;
    endDate: string;
    status: ProjectStatus;
    createdAt: string;
    updatedAt: string;
}

export enum ProjectStatus {
    PENDING = "PENDING",
    ON_GOING = "ON_GOING",
    ON_HOLD = "ON_HOLD",
    EXPIRED = "EXPIRED",
}

export interface CreateProjectDto {
    name: string;
    description?: string;
    status: ProjectStatus;
    startDate: string;
    endDate: string;
}

export interface UpdateProjectDto {
    name?: string;
    description?: string;
    status?: ProjectStatus;
    startDate?: string;
    endDate?: string;
}

export interface ProjectQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: "ASC" | "DESC";
}
