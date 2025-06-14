import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, Method } from "axios";
import { toast } from "sonner";
import { CreateUserDto, UpdateUserDto, UserDto } from "@/types/user";
import { PageResponse, RequestQueryParams } from "@/types/common";
import {
    CreateMaintenanceRequestDto,
    MaintenanceRequestActionDto,
    MaintenanceRequestDto,
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

// Base URL configuration
const API_BASE_URL = "http://localhost:8080/api";

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
            return fetchWithErrorHandling<UserDto>(`/users`, {
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
            return fetchWithErrorHandling<VehicleDto>("/vehicles", {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: vehicleData,
            });
        },
        update: (id: number, vehicleData: FormData) => {
            return fetchWithErrorHandling<VehicleDto>(`/vehicles/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
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
            getAll: (params?: MaintenanceRequestQueryParams) => {
                // Or use RequestQueryParams
                const queryString = params
                    ? `?${new URLSearchParams(
                          Object.entries(params)
                              .filter(([_, value]) => value !== undefined && value !== null)
                              .map(([key, value]) => [key, String(value)])
                      ).toString()}`
                    : "";
                return fetchWithErrorHandling<PageResponse<MaintenanceRequestDto>>(
                    `/maintenance/requests${queryString}` // Ensure prefix /api is handled by API_BASE_URL
                );
            },
            getById: (id: number) => {
                return fetchWithErrorHandling<MaintenanceRequestDto>(`/maintenance/requests/${id}`);
            },
            create: (requestData: CreateMaintenanceRequestDto) => {
                return fetchWithErrorHandling<MaintenanceRequestDto>("/maintenance/requests", {
                    method: "POST",
                    body: JSON.stringify(requestData),
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
            },
            act: (id: number, actionData: MaintenanceRequestActionDto) => {
                // Or use TripRequestActionDto
                return fetchWithErrorHandling<MaintenanceRequestDto>(
                    `/maintenance/requests/${id}`,
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
};
