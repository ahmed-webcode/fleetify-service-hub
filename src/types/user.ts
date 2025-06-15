// Enum for Gender
export enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
}

// DTO for Role
export interface RoleDto {
    id: number;
    name: string;
}

// DTO for creating a user (frontend version of CreateUserDto)
export interface CreateUserDto {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    universityId: string;
    email: string;
    gender: Gender;
    phoneNumber: string;
    levelId?: number;
    positionId?: number;
    canDrive?: boolean;
}

// DTO for updating a user (frontend version of UpdateUserDto)
export interface UpdateUserDto {
    id: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    universityId?: string;
    email?: string;
    phoneNumber?: string;
    levelId?: number;
    positionId?: number;
    canDrive?: boolean;
    gender?: Gender;
}

// DTO for displaying a user (frontend version of UserDto)
export interface UserDto {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    universityId: string;
    gender: Gender;
    phoneNumber: string;
    canDrive: boolean;
    drivingLicense?: string | null;
    enabled: boolean;
    levelName?: string | null;
    positionName?: string | null;
    roles: RoleDto[];
    createdAt: string;
    updatedAt: string;
    lastLogin?: string | null;
}

// For mapping the /me endpoint

export interface LevelRef {
    id: number;
    name: string;
}

export interface PositionRef {
    id: number;
    name: string;
    level?: LevelRef | null;
}

export interface RoleRef {
    id: number;
    name: string;
}

export interface UserRef {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
}

// This matches the UserFull DTO from backend
export interface UserFull {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    universityId: string;
    gender: Gender;
    phoneNumber: string;
    canDrive: boolean;
    drivingLicense?: string | null;
    enabled: boolean;
    levelName?: string | null;
    level?: LevelRef | null;
    position?: PositionRef | null;
    positionName?: string | null;
    roles: RoleRef[];
    createdAt: string;
    updatedAt: string;
    createdBy?: UserRef | null;
    updatedBy?: UserRef | null;
    lastLogin?: string | null;
}

// DTO for changing password
export interface ChangePasswordDto {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}
