// Types for Position Management
export interface Position {
    id: number;
    name: string;
    description: string;
    fuelQuota: number;
    vehicleEntitlement: boolean;
    policyReference: string;
    levelName: string;
    status?: string;
    createdAt: string;
    updatedAt: string;
}

export enum PositionStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    ON_HOLD = "ON_HOLD",
}

export interface CreatePositionDto {
    name: string;
    description: string;
    fuelQuota: number;
    vehicleEntitlement: boolean;
    policyReference: string;
    levelId: number;
    status: PositionStatus;
}

export interface UpdatePositionDto {
    id: number;
    name?: string;
    description?: string;
    fuelQuota?: number;
    vehicleEntitlement?: boolean;
    policyReference?: string;
    levelId?: number;
    status?: PositionStatus;
}

export interface PositionQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: "ASC" | "DESC";
}
