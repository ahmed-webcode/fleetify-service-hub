// Pagination types
export interface PageResponse<T> {
    content: T[];
    pageable: Pageable;
    last: boolean;
    totalElements: number;
    totalPages: number;
    first: boolean;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    empty: boolean;
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    unpaged: boolean;
    paged: boolean;
}

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface RequestQueryParams {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: "ASC" | "DESC";
}

export enum TargetType {
    GENERATOR = "GENERATOR",
    VEHICLE = "VEHICLE",
}

export enum ActionType {
    APPROVE = "APPROVE",
    REJECT = "REJECT",
    APPROVE_WITH_MODIFICATION = "APPROVE_WITH_MODIFICATION",
}

export enum RequestStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED",
}
