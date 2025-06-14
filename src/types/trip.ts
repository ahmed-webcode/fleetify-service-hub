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
    createdAt: string;
    updatedAt: string;
}
