import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, Method } from "axios";
import { toast } from "sonner";
import { CreateUserDto, UpdateUserDto, UserDto } from "@/types/user";
import { PageResponse, RequestQueryParams } from "@/types/common";
import {
    MaintenanceRequestCreate,
    MaintenanceRequestAction,
    MaintenanceRequestFull,
    MaintenanceRequestQueryParams,
} from "@/types/maintenance";
import { CreateTripRequestDto, TripRequestActionDto, TripRequestDto } from "@/types/trip";
import { CreateFuelRequestDto, FuelRequestActionDto, FuelRequestDto } from "@/types/fuel";
import { VehicleDetail, VehicleDto, VehicleQueryParams } from "@/types/vehicle";
import {
    CreatePositionDto,
    Position,
    PositionQueryParams,
    UpdatePositionDto,
} from "@/types/position";
import { Level, LightLevelDto } from "@/types/level";
import { CreateProjectDto, Project, ProjectQueryParams, UpdateProjectDto } from "@/types/project";
import { TripRecordCreateDto, TripRecordFullDto } from "@/types/trip";
import {
    NotificationFull,
    NotificationUpdate,
    NotificationQueryParams,
} from "@/types/notification";

// Base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Response type for login (remains the same)
interface LoginResponse {
    roles: string[];
    token: string;
}

// Utility function to handle HTTP errors (adapted for Axios)
const handleHttpError = (error: any): never => {
    let message = "An unknown error occurred";

    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        if (axiosError.response) {
            if (axiosError.response.data) {
                if (typeof axiosError.response.data === "string") {
                    message = axiosError.response.data;
                } else if (
                    axiosError.response.data.message &&
                    typeof axiosError.response.data.message === "string"
                ) {
                    message = axiosError.response.data.message;
                } else if (axiosError.response.statusText) {
                    message = axiosError.response.statusText;
                } else {
                    message = `Server error: ${axiosError.response.status}`;
                }
            } else {
                message = `Server error: ${axiosError.response.status}`;
            }
        } else if (axiosError.request) {
            message = "No response received from server. Check network connection.";
        } else {
            message = axiosError.message;
        }
    } else if (error instanceof Error) {
        // Non-Axios error
        message = error.message;
    }

    if (message === "No response received from server. Check network connection.") {
        window.location.href = "/login"; // Redirect to login if no response
    }
    console.error("API Error:", error);
    toast.error(`API Error: ${message}`);
    throw error;
};

// Create an Axios instance
const axiosClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to include the auth token
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("auth_token");
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

async function fetchWithErrorHandling<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
        const axiosConfig: AxiosRequestConfig = {
            url: url,
            method: (options.method as Method) || "GET",
            headers: options.headers as AxiosRequestHeaders,
        };

        if (options.body) {
            if (
                typeof options.body === "string" ||
                options.body instanceof FormData ||
                options.body instanceof URLSearchParams ||
                options.body instanceof Blob
            ) {
                axiosConfig.data = options.body;
            } else {
                try {
                    axiosConfig.data = options.body;
                } catch (e) {
                    axiosConfig.data = options.body;
                }
            }
        }

        const response = await axiosClient.request<T>(axiosConfig);

        return response.data;
    } catch (error) {
        return handleHttpError(error);
    }
}

// API methods
export const apiClient = {
    // Auth endpoints
    auth: {
        login: (username: string, password: string): Promise<LoginResponse> => {
            return fetchWithErrorHandling<LoginResponse>("/auth/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });
        },
        logout: (): Promise<void> => {
            localStorage.removeItem("auth_token");
            localStorage.removeItem("auth_user");
            localStorage.removeItem("selected_role");
            localStorage.removeItem("auth_roles");
            return Promise.resolve();
        },
    },

    // User endpoints
    users: {
        getAll: () => {
            return fetchWithErrorHandling<UserDto[]>("/users");
        },
        getById: (id: number) => {
            return fetchWithErrorHandling<UserDto>(`/users/${id}`);
        },
        create: (userData: CreateUserDto) => {
            return fetchWithErrorHandling<UserDto>("/users", {
                method: "POST",
                body: JSON.stringify(userData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        },
        update: (userData: UpdateUserDto) => {
            return fetchWithErrorHandling<UserDto>(`/users/${userData.id}`, {
                method: "PATCH",
                body: JSON.stringify(userData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        },
        delete: (id: number) => {
            return fetchWithErrorHandling<void>(`/users/${id}`, {
                method: "DELETE",
            });
        },
        getMe: () => {
            return fetchWithErrorHandling<import("@/types/user").UserFull>("/users/me");
        },
        changePassword: (data: import("@/types/user").ChangePasswordDto) => {
            return fetchWithErrorHandling<void>("/users/change-password", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        },
    },

    // Vehicle endpoints
    vehicles: {
        getAll: (params?: VehicleQueryParams) => {
            const queryString = params
                ? `?${new URLSearchParams(
                      Object.entries(params)
                          .filter(([_, value]) => value !== undefined && value !== null)
                          .map(([key, value]) => [key, value.toString()])
                  ).toString()}`
                : "";

            return fetchWithErrorHandling<PageResponse<VehicleDto>>(`/vehicles${queryString}`);
        },
        getById: (id: number) => {
            return fetchWithErrorHandling<VehicleDto>(`/vehicles/${id}`);
        },
        getDetails: (id: number) => {
            return fetchWithErrorHandling<VehicleDetail>(`/vehicles/${id}/details`);
        },
        create: (vehicleData: FormData) => {
            // Do not set Content-Type for FormData, browser will set it
            return fetchWithErrorHandling<VehicleDto>("/vehicles", {
                method: "POST",
                body: vehicleData,
                headers: {
                    "Content-type": "multipart/form-data",
                },
            });
        },
        update: (id: number, vehicleData: FormData) => {
            // Do not set Content-Type for FormData, browser will set it
            return fetchWithErrorHandling<VehicleDto>(`/vehicles/${id}`, {
                method: "PATCH",
                body: vehicleData,
            });
        },
        delete: (id: number) => {
            return fetchWithErrorHandling<void>(`/vehicles/${id}`, {
                method: "DELETE",
            });
        },
    },

    // Maintenance endpoints
    maintenance: {
        types: {
            getAll: () => {
                return fetchWithErrorHandling("/maintenance/types");
            },
        },
        getAll: () => {
            return fetchWithErrorHandling("/maintenance");
        },
        getByVehicleId: (vehicleId: string) => {
            return fetchWithErrorHandling(`/maintenance/vehicle/${vehicleId}`);
        },
        create: (maintenanceData: any) => {
            return fetchWithErrorHandling("/maintenance", {
                method: "POST",
                body: JSON.stringify(maintenanceData),
            });
        },

        // New maintenance request endpoints
        requests: {
            getAll: (params?: import("@/types/maintenance").MaintenanceRequestQueryParams) => {
                const queryString = params
                    ? `?${new URLSearchParams(
                          Object.entries(params)
                              .filter(([_, value]) => value !== undefined && value !== null)
                              .map(([key, value]) => [key, String(value)])
                      ).toString()}`
                    : "";
                return fetchWithErrorHandling<
                    PageResponse<import("@/types/maintenance").MaintenanceRequestFull>
                >(`/maintenance-requests${queryString}`);
            },
            getMy: (params?: import("@/types/maintenance").MaintenanceRequestQueryParams) => {
                const queryString = params
                    ? `?${new URLSearchParams(
                          Object.entries(params)
                              .filter(([_, value]) => value !== undefined && value !== null)
                              .map(([key, value]) => [key, String(value)])
                      ).toString()}`
                    : "";
                return fetchWithErrorHandling<
                    PageResponse<import("@/types/maintenance").MaintenanceRequestFull>
                >(`/maintenance-requests/me${queryString}`);
            },
            getById: (id: number) => {
                return fetchWithErrorHandling<import("@/types/maintenance").MaintenanceRequestFull>(
                    `/maintenance-requests/${id}`
                );
            },
            create: (requestData: import("@/types/maintenance").MaintenanceRequestCreate) => {
                return fetchWithErrorHandling<import("@/types/maintenance").MaintenanceRequestFull>(
                    "/maintenance-requests",
                    {
                        method: "POST",
                        body: JSON.stringify(requestData),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            },
            act: (
                id: number,
                actionData: import("@/types/maintenance").MaintenanceRequestAction
            ) => {
                return fetchWithErrorHandling<import("@/types/maintenance").MaintenanceRequestFull>(
                    `/maintenance-requests/${id}`,
                    {
                        method: "PATCH",
                        body: JSON.stringify(actionData),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
            },
        },
        records: {
            getAll: (params?: import("@/types/maintenance").MaintenanceRecordQueryParams) => {
                const queryString = params
                    ? `?${new URLSearchParams(
                          Object.entries(params)
                              .filter(([_, value]) => value !== undefined && value !== null)
                              .map(([key, value]) => [key, String(value)])
                      ).toString()}`
                    : "";
                return fetchWithErrorHandling<
                    PageResponse<import("@/types/maintenance").MaintenanceRecordFull>
                >(`/maintenance-records${queryString}`);
            },
            getById: (id: number) => {
                return fetchWithErrorHandling<import("@/types/maintenance").MaintenanceRecordFull>(
                    `/maintenance-records/${id}`
                );
            },
            create: (data: import("@/types/maintenance").MaintenanceRecordCreate) => {
                return fetchWithErrorHandling<import("@/types/maintenance").MaintenanceRecordFull>(
                    `/maintenance-records`,
                    {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: { "Content-Type": "application/json" },
                    }
                );
            },
            update: (
                id: number,
                data: Partial<import("@/types/maintenance").MaintenanceRecordCreate>
            ) => {
                return fetchWithErrorHandling<import("@/types/maintenance").MaintenanceRecordFull>(
                    `/maintenance-records/${id}`,
                    {
                        method: "PATCH",
                        body: JSON.stringify(data),
                        headers: { "Content-Type": "application/json" },
                    }
                );
            },
        },
        companies: {
            getAll: () => {
                return fetchWithErrorHandling<import("@/types/maintenance").CompanyFull[]>(
                    "/maintenance-companies"
                );
            },
        },
        items: {
            getAll: (params?: {
                page?: number;
                size?: number;
                sortBy?: string;
                direction?: string;
            }) => {
                const queryString = params
                    ? `?${new URLSearchParams(
                          Object.entries(params)
                              .filter(([_, value]) => value !== undefined && value !== null)
                              .map(([key, value]) => [key, String(value)])
                      ).toString()}`
                    : "";
                return fetchWithErrorHandling<
                    PageResponse<import("@/types/maintenance").MaintenanceItemFull>
                >(`/maintenance-items${queryString}`);
            },
            getIssued: (params?: {
                page?: number;
                size?: number;
                sortBy?: string;
                direction?: string;
            }) => {
                const queryString = params
                    ? `?${new URLSearchParams(
                          Object.entries(params)
                              .filter(([_, value]) => value !== undefined && value !== null)
                              .map(([key, value]) => [key, String(value)])
                      ).toString()}`
                    : "";
                return fetchWithErrorHandling<
                    PageResponse<import("@/types/maintenance").MaintenanceItemFull>
                >(`/maintenance-items/issued${queryString}`);
            },
            getReceived: (params?: {
                page?: number;
                size?: number;
                sortBy?: string;
                direction?: string;
            }) => {
                const queryString = params
                    ? `?${new URLSearchParams(
                          Object.entries(params)
                              .filter(([_, value]) => value !== undefined && value !== null)
                              .map(([key, value]) => [key, String(value)])
                      ).toString()}`
                    : "";
                return fetchWithErrorHandling<
                    PageResponse<import("@/types/maintenance").MaintenanceItemFull>
                >(`/maintenance-items/received${queryString}`);
            },
            getById: (id: number) => {
                return fetchWithErrorHandling<import("@/types/maintenance").MaintenanceItemFull>(
                    `/maintenance-items/${id}`
                );
            },
            issue: (data: import("@/types/maintenance").MaintenanceItemIssue) => {
                return fetchWithErrorHandling<import("@/types/maintenance").MaintenanceItemFull>(
                    `/maintenance-items`,
                    {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: { "Content-Type": "application/json" },
                    }
                );
            },
            receive: (id: number, data: import("@/types/maintenance").MaintenanceItemReceive) => {
                return fetchWithErrorHandling<import("@/types/maintenance").MaintenanceItemFull>(
                    `/maintenance-items/${id}/receive`,
                    {
                        method: "PATCH",
                        body: JSON.stringify(data),
                        headers: { "Content-Type": "application/json" },
                    }
                );
            },
        },
    },

    // Fuel endpoints
    fuel: {
        getAll: () => {
            return fetchWithErrorHandling("/fuel");
        },
        getByVehicleId: (vehicleId: string) => {
            return fetchWithErrorHandling(`/fuel/vehicle/${vehicleId}`);
        },
        create: (fuelData: any) => {
            return fetchWithErrorHandling("/fuel", {
                method: "POST",
                body: JSON.stringify(fuelData),
            });
        },
        getFuelTypes: () => {
            return fetchWithErrorHandling("/fuel-types");
        },
        listFuels: () => {
            return fetchWithErrorHandling<import("@/types/fuel").FuelFull[]>("/fuels");
        },
        updateFuel: (id: number, update: { amount: number; pricePerLiter: number }) => {
            return fetchWithErrorHandling<import("@/types/fuel").FuelFull>(`/fuels/${id}`, {
                method: "PATCH",
                body: JSON.stringify(update),
                headers: { "Content-Type": "application/json" },
            });
        },
        // New fuel request endpoints
        requests: {
            getAll: (params?: RequestQueryParams) => {
                const queryString = params
                    ? `?${new URLSearchParams(
                          Object.entries(params)
                              .filter(([_, value]) => value !== undefined && value !== null)
                              .map(([key, value]) => [key, value.toString()])
                      ).toString()}`
                    : "";

                return fetchWithErrorHandling<PageResponse<FuelRequestDto>>(
                    `/fuel-requests${queryString}`
                );
            },
            getMy: (params?: RequestQueryParams) => {
                const queryString = params
                    ? `?${new URLSearchParams(
                          Object.entries(params)
                              .filter(([_, value]) => value !== undefined && value !== null)
                              .map(([key, value]) => [key, value.toString()])
                      ).toString()}`
                    : "";

                return fetchWithErrorHandling<PageResponse<FuelRequestDto>>(
                    `/fuel-requests/me${queryString}`
                );
            },
            getById: (id: number) => {
                return fetchWithErrorHandling<FuelRequestDto>(`/fuel-requests/${id}`);
            },
            create: (requestData: CreateFuelRequestDto) => {
                return fetchWithErrorHandling<FuelRequestDto>("/fuel-requests", {
                    method: "POST",
                    body: JSON.stringify(requestData),
                });
            },
            act: (id: number, actionData: FuelRequestActionDto) => {
                return fetchWithErrorHandling<FuelRequestDto>(`/fuel-requests/${id}`, {
                    method: "PATCH",
                    body: JSON.stringify(actionData),
                });
            },
        },

        records: {
            getAll: (params?: {
                page?: number;
                size?: number;
                sortBy?: string;
                direction?: string;
            }) => {
                const queryString = params
                    ? `?${new URLSearchParams(
                          Object.entries(params)
                              .filter(([_, value]) => value !== undefined && value !== null)
                              .map(([key, value]) => [key, String(value)])
                      ).toString()}`
                    : "";
                return fetchWithErrorHandling<
                    PageResponse<import("@/types/fuel").FuelRecordFullDto>
                >(`/fuel-records${queryString}`);
            },
            getMy: (params?: {
                page?: number;
                size?: number;
                sortBy?: string;
                direction?: string;
            }) => {
                const queryString = params
                    ? `?${new URLSearchParams(
                          Object.entries(params)
                              .filter(([_, value]) => value !== undefined && value !== null)
                              .map(([key, value]) => [key, String(value)])
                      ).toString()}`
                    : "";
                return fetchWithErrorHandling<
                    PageResponse<import("@/types/fuel").FuelRecordFullDto>
                >(`/fuel-records/me${queryString}`);
            },
            issue: (data: import("@/types/fuel").FuelIssueDto) => {
                return fetchWithErrorHandling<import("@/types/fuel").FuelRecordFullDto>(
                    "/fuel-records",
                    {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: { "Content-Type": "application/json" },
                    }
                );
            },
            receive: (id: number, data: import("@/types/fuel").FuelReceiveDto) => {
                return fetchWithErrorHandling<import("@/types/fuel").FuelRecordFullDto>(
                    `/fuel-records/${id}`,
                    {
                        method: "PATCH",
                        body: JSON.stringify(data),
                        headers: { "Content-Type": "application/json" },
                    }
                );
            },
        },
    },

    trips: {
        requests: {
            getAll: (params?: RequestQueryParams) => {
                const queryString = params
                    ? `?${new URLSearchParams(
                          Object.entries(params)
                              .filter(([_, value]) => value !== undefined && value !== null)
                              .map(([key, value]) => [key, String(value)])
                      ).toString()}`
                    : "";
                return fetchWithErrorHandling<PageResponse<TripRequestDto>>(
                    `/trip-requests${queryString}`
                );
            },
            getMy: (params?: RequestQueryParams) => {
                const queryString = params
                    ? `?${new URLSearchParams(
                          Object.entries(params)
                              .filter(([_, value]) => value !== undefined && value !== null)
                              .map(([key, value]) => [key, String(value)])
                      ).toString()}`
                    : "";
                return fetchWithErrorHandling<PageResponse<TripRequestDto>>(
                    `/trip-requests/me${queryString}`
                );
            },
            getById: (id: number) => {
                return fetchWithErrorHandling<TripRequestDto>(`/trip-requests/${id}`);
            },
            create: (requestData: CreateTripRequestDto) => {
                return fetchWithErrorHandling<TripRequestDto>("/trip-requests", {
                    method: "POST",
                    body: JSON.stringify(requestData),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            },
            act: (id: number, actionData: TripRequestActionDto) => {
                return fetchWithErrorHandling<TripRequestDto>(`/trip-requests/${id}`, {
                    method: "PATCH",
                    body: JSON.stringify(actionData),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            },
        },
    },

    tripRecords: {
        getAll: (params?: {
            page?: number;
            size?: number;
            sortBy?: string;
            direction?: string;
        }) => {
            const queryString = params
                ? `?${new URLSearchParams(
                      Object.entries(params)
                          .filter(([_, value]) => value !== undefined && value !== null)
                          .map(([key, value]) => [key, String(value)])
                  ).toString()}`
                : "";
            return fetchWithErrorHandling<PageResponse<TripRecordFullDto>>(
                `/trip-records${queryString}`
            );
        },
        getById: (id: number) => {
            return fetchWithErrorHandling<TripRecordFullDto>(`/trip-records/${id}`);
        },
        create: (data: TripRecordCreateDto) => {
            return fetchWithErrorHandling<TripRecordFullDto>(`/trip-records`, {
                method: "POST",
                body: JSON.stringify(data),
                headers: { "Content-Type": "application/json" },
            });
        },
    },

    // Incident endpoints
    incidents: {
        getAll: () => {
            return fetchWithErrorHandling("/incidents");
        },
        getByVehicleId: (vehicleId: string) => {
            return fetchWithErrorHandling(`/incidents/vehicle/${vehicleId}`);
        },
        create: (incidentData: any) => {
            return fetchWithErrorHandling("/incidents", {
                method: "POST",
                body: JSON.stringify(incidentData),
            });
        },
    },

    // Positions endpoints
    positions: {
        getAll: (params?: PositionQueryParams) => {
            const queryString = params
                ? `?${new URLSearchParams(
                      Object.entries(params)
                          .filter(([_, value]) => value !== undefined && value !== null)
                          .map(([key, value]) => [key, value.toString()])
                  ).toString()}`
                : "";

            return fetchWithErrorHandling<PageResponse<Position>>(`/positions${queryString}`);
        },
        getById: (id: number) => {
            return fetchWithErrorHandling<Position>(`/positions/${id}`);
        },
        create: (positionData: CreatePositionDto) => {
            return fetchWithErrorHandling<Position>("/positions", {
                method: "POST",
                body: JSON.stringify(positionData),
            });
        },
        update: (positionData: UpdatePositionDto) => {
            return fetchWithErrorHandling<Position>(`/positions/${positionData.id}`, {
                method: "PATCH",
                body: JSON.stringify(positionData),
            });
        },
        delete: (id: number) => {
            return fetchWithErrorHandling<void>(`/positions/${id}`, {
                method: "DELETE",
            });
        },
    },

    // Levels endpoints
    levels: {
        getAll: () => {
            return fetchWithErrorHandling<Level[]>("/levels");
        },
    },

    // Projects endpoints
    projects: {
        searchAutocomplete: (search: string, limit: number = 10) => {
            return fetchWithErrorHandling<PageResponse<LightLevelDto>>(
                `/projects/search?name=${encodeURIComponent(search)}&limit=${limit}`
            );
        },

        getAll: (params?: ProjectQueryParams) => {
            const queryString = params
                ? `?${new URLSearchParams(
                      Object.entries(params)
                          .filter(([_, value]) => value !== undefined && value !== null)
                          .map(([key, value]) => [key, value.toString()])
                  ).toString()}`
                : "";

            return fetchWithErrorHandling<PageResponse<Project>>(`/projects${queryString}`);
        },

        getById: (id: number) => {
            return fetchWithErrorHandling<Project>(`/projects/${id}`);
        },

        create: (projectData: CreateProjectDto) => {
            return fetchWithErrorHandling<Project>("/projects", {
                method: "POST",
                body: JSON.stringify(projectData),
            });
        },

        update: (id: number, projectData: UpdateProjectDto) => {
            return fetchWithErrorHandling<Project>(`/projects/${id}`, {
                method: "PATCH",
                body: JSON.stringify(projectData),
            });
        },
    },

    // Insurance endpoints
    insurances: {
        getAll: (params?: {
            page?: number;
            size?: number;
            sortBy?: string;
            direction?: "ASC" | "DESC";
            vehicleId?: number;
        }) => {
            const queryString = params
                ? `?${new URLSearchParams(
                      Object.entries(params)
                          .filter(([_, value]) => value !== undefined && value !== null)
                          .map(([key, value]) => [key, value.toString()])
                  ).toString()}`
                : "";
            return fetchWithErrorHandling<
                import("@/types/common").PageResponse<import("@/types/insurance").InsuranceFull>
            >(`/insurances${queryString}`);
        },
        create: (data: import("@/types/insurance").InsuranceCreate) => {
            return fetchWithErrorHandling<import("@/types/insurance").InsuranceFull>(
                "/insurances",
                {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: { "Content-Type": "application/json" },
                }
            );
        },
    },

    // Add notifications endpoints
    notifications: {
        getAll: (params?: NotificationQueryParams) => {
            const queryString = params
                ? `?${new URLSearchParams(
                      Object.entries(params)
                          .filter(([_, value]) => value !== undefined && value !== null)
                          .map(([key, value]) => [key, String(value)])
                  ).toString()}`
                : "";
            return fetchWithErrorHandling<PageResponse<NotificationFull>>(
                `/notifications${queryString}`
            );
        },
        markAsRead: (id: number, update: NotificationUpdate) => {
            return fetchWithErrorHandling<NotificationFull>(`/notifications/${id}`, {
                method: "PATCH",
                body: JSON.stringify(update),
                headers: {
                    "Content-Type": "application/json",
                },
            });
        },
    },
};

// Export types for use in other files
export type { Level, LightLevelDto };
