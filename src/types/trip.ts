import { ActionType, RequestStatus } from "./common";

export interface CreateTripRequestDto {
    purpose: string;
    description?: string;
    startTime: string;
    endTime: string;
    startLocation: string;
    endLocation: string;
    isRoundTrip: boolean;
    passengerCount: number;
}

export interface TripRequestActionDto {
    action: ActionType;
    actionNote?: string;
    vehicleId?: number;
    driverId?: number;
}

export interface TripRequestDto {
    id: number;
    purpose: string;
    description?: string;
    startTime: string;
    endTime: string;
    startLocation: string;
    endLocation: string;
    isRoundTrip: boolean;
    status: RequestStatus;
    passengerCount: number;
    requestedBy: string;
    requestedAt: string;
    actedBy?: string;
    actedAt?: string;
    actionNote?: string;
    vehiclePlateNumber?: string;
    driverName?: string;
    createdAt: string;
    updatedAt: string;
}

// DTOs for Trip Records

export interface TripRecordCreateDto {
    tripRequestId: number;
    vehicleId: number;
    driverId: number;
}

export interface TripRecordFullDto {
    id: number;
    level: {
        id: number;
        name: string;
    };
    tripRequest: {
        id: number;
        purpose: string;
    };
    vehicle: {
        id: number;
        plateNumber: string;
    };
    driver: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
    };
    assignedBy: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
    };
    assignedAt: string;
}
