import { LevelRef } from "./user";
import { UserRef } from "./user";

export interface VehicleRef {
    id: number;
    plateNumber: string;
}

export interface InsuranceFull {
    id: number;
    vehicle: VehicleRef;
    level: LevelRef;
    insuranceCompany: string;
    insurancePolicyNumber: string;
    policyStartDate: string;
    policyEndDate: string;
    premiumAmount: number;
    createdAt: string;
    updatedAt: string;
    createdBy: UserRef;
    updatedBy: UserRef;
}

export interface InsuranceCreate {
    vehicleId: number;
    insuranceCompany: string;
    insurancePolicyNumber: string;
    policyStartDate: string;
    policyEndDate: string;
    premiumAmount: number;
}
