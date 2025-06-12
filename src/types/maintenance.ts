import { ActionType, RequestStatus } from "./common";

// DTO for creating a maintenance request
export interface CreateMaintenanceRequestDto {
    vehicleId: number;
    title: string;
    description: string;
    maintenanceTypeId: number;
}

// DTO for maintenance request action (structurally same as TripRequestActionDto, but named for clarity)
// You can reuse TripRequestActionDto if you prefer, or define this:
export interface MaintenanceRequestActionDto {
    action: ActionType; // Reuses existing ActionType enum
    actionNote?: string;
    estimatedCost?: number;
}

// DTO for displaying a maintenance request
export interface MaintenanceRequestDto {
    id: number;
    plateNumber: string; // Vehicle's plate number
    title: string;
    description: string;
    status: RequestStatus; // Reuses existing RequestStatus enum
    maintenanceType: string;
    estimatedCost?: number;
    requestedBy: string;
    requestedAt: string;
    actedBy?: string;
    actedAt?: string;
    actionNote?: string;
    createdAt: string;
    updatedAt: string;
}

// Query Params for maintenance requests (can reuse existing RequestQueryParams if identical)
// For clarity, or if specific params are needed later:
export interface MaintenanceRequestQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: "ASC" | "DESC";
    // Add any specific maintenance search/filter params here if backend supports them
}
