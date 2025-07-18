import { ActionType, RequestStatus } from "./common";

// DTO for creating a maintenance request (matches backend)
export interface MaintenanceRequestCreate {
    vehicleId: number;
    title: string;
    description: string;
}

// DTO for maintenance request action
export interface MaintenanceRequestAction {
    action: "APPROVE" | "REJECT"; // Use string union for action type
    actionNote?: string;
}

// Reference types for nested objects
export interface LevelRef {
    id: number;
    name: string;
}
export interface VehicleRef {
    id: number;
    plateNumber: string;
}
export interface UserRef {
    id: number;
    fullName: string;
}

// DTO for displaying a maintenance request (matches backend)
export interface MaintenanceRequestFull {
    id: number;
    level: LevelRef | null;
    vehicle: VehicleRef;
    title: string;
    description: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
    requestedBy: UserRef;
    requestedAt: string;
    actedAt?: string;
    actionNote?: string;
}

// Query Params for maintenance requests
export interface MaintenanceRequestQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: "ASC" | "DESC";
    vehicleId?: number;
}

// --- Maintenance Records ---
export interface MaintenanceRecordCreate {
    startDate: string; // ISO date string
    endDate: string; // ISO date string
    performedById: number;
    laborCost: number;
    description: string;
    maintenanceRequestId: number;
}

export interface CompanyRef {
    id: number;
    name: string;
}

export interface CompanyFull {
    id: number;
    name: string;
    address: string;
    phoneNumber: string;
    email: string;
    internal: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface MaintenanceRecordFull {
    id: number;
    level: LevelRef | null;
    startDate: string;
    endDate: string;
    performedBy: CompanyRef;
    laborCost: number;
    description: string;
    createdAt: string;
    updatedAt: string;
    maintenanceRequest: MaintenanceRequestFull;
}

export interface MaintenanceRecordQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: "ASC" | "DESC";
    vehicleId?: number;
}

// --- Maintenance Items ---
export interface MaintenanceItemIssue {
    maintenanceId: number;
    itemId: number;
    issuedQuantity: number;
    receivedBy: number;
}

export interface MaintenanceItemReceive {
    receivedQuantity: number;
}

export interface ItemRef {
    id: number;
    name: string;
    unit: string;
}

export interface UserRef {
    id: number;
    fullName: string;
}

export interface MaintenanceRecordRef {
    id: number;
    startDate: string;
    endDate: string;
}

export interface MaintenanceItemFull {
    id: number;
    maintenanceRecord: MaintenanceRecordRef;
    item: ItemRef;
    unitCost: number;
    totalCost: number;
    issuedQuantity: number;
    receivedQuantity?: number;
    issuedBy: UserRef;
    issuedAt: string;
    receivedBy: UserRef;
    receivedAt?: string;
}
