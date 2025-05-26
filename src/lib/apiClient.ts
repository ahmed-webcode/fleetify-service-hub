import axios, { AxiosError, AxiosRequestConfig, AxiosRequestHeaders, Method } from "axios";
import { toast } from "sonner";

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
        if (typeof axiosError.response.data === 'string') {
          message = axiosError.response.data;
        } else if (axiosError.response.data.message && typeof axiosError.response.data.message === 'string') {
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

async function fetchWithErrorHandling<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const axiosConfig: AxiosRequestConfig = {
      url: url,
      method: (options.method as Method) || 'GET',
      headers: options.headers as AxiosRequestHeaders,
    };

    if (options.body) {
      if (typeof options.body === 'string' || options.body instanceof FormData || options.body instanceof URLSearchParams || options.body instanceof Blob) {
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
    }
  },

  // User endpoints
  users: {
    getAll: () => {
      return fetchWithErrorHandling("/users");
    }
  },

  // Vehicle endpoints
  vehicles: {
    getAll: (params?: VehicleQueryParams) => {
      const queryString = params ? 
        `?${new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [key, value.toString()])
        ).toString()}` : '';
      
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
      getAll: (params?: MaintenanceRequestQueryParams) => { // Or use RequestQueryParams
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
        return fetchWithErrorHandling<MaintenanceRequestDto>(
          `/maintenance/requests/${id}`
        );
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
      act: (id: number, actionData: MaintenanceRequestActionDto) => { // Or use TripRequestActionDto
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
      return fetchWithErrorHandling("/fuel/types");
    },
    
    // New fuel request endpoints
    requests: {
      getAll: (params?: RequestQueryParams) => {
        const queryString = params ? 
          `?${new URLSearchParams(
            Object.entries(params)
              .filter(([_, value]) => value !== undefined && value !== null)
              .map(([key, value]) => [key, value.toString()])
          ).toString()}` : '';
        
        return fetchWithErrorHandling<PageResponse<FuelRequestDto>>(`/fuel/requests${queryString}`);
      },
      getById: (id: number) => {
        return fetchWithErrorHandling<FuelRequestDto>(`/fuel/requests/${id}`);
      },
      create: (requestData: CreateFuelRequestDto) => {
        return fetchWithErrorHandling<FuelRequestDto>("/fuel/requests", {
          method: "POST",
          body: JSON.stringify(requestData),
        });
      },
      act: (id: number, actionData: FuelRequestActionDto) => {
        return fetchWithErrorHandling<FuelRequestDto>(`/fuel/requests/${id}`, {
          method: "PATCH",
          body: JSON.stringify(actionData),
        });
      }
    }
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
          `/trips/requests${queryString}`
        );
      },
      getById: (id: number) => {
        return fetchWithErrorHandling<TripRequestDto>(
          `/trips/requests/${id}`
        );
      },
      create: (requestData: CreateTripRequestDto) => {
        return fetchWithErrorHandling<TripRequestDto>("/trips/requests", {
          method: "POST",
          body: JSON.stringify(requestData),
          headers: {
            "Content-Type": "application/json",
          },
        });
      },
      act: (id: number, actionData: TripRequestActionDto) => {
        return fetchWithErrorHandling<TripRequestDto>(
          `/trips/requests/${id}`,
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
    }
  },

  // Positions endpoints
  positions: {
    getAll: (params?: PositionQueryParams) => {
      const queryString = params ? 
        `?${new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [key, value.toString()])
        ).toString()}` : '';
      
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
      return fetchWithErrorHandling<Position>("/positions", {
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
      return fetchWithErrorHandling<PageResponse<LightLevelDto>>(`/projects/search?name=${encodeURIComponent(search)}&limit=${limit}`);
    },
    
    getAll: (params?: ProjectQueryParams) => {
      const queryString = params ? 
        `?${new URLSearchParams(
          Object.entries(params)
            .filter(([_, value]) => value !== undefined && value !== null)
            .map(([key, value]) => [key, value.toString()])
        ).toString()}` : '';
      
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
    }
  }
};

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
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ON_HOLD = 'ON_HOLD'
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

// Types for Project Management
export interface Project {
  id: number;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
}

export enum ProjectStatus {
  PENDING = 'PENDING',
  ON_GOING = 'ON_GOING',
  ON_HOLD = 'ON_HOLD',
  EXPIRED = 'EXPIRED'
}

export interface CreateProjectDto {
  name: string;
  description?: string;
  status: ProjectStatus;
  startDate: string;
  endDate: string;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  startDate?: string;
  endDate?: string;
}

// Types for Vehicle Management
export interface VehicleDto {
  id: number;
  plateNumber: string;
  isPrivate: boolean;
  vehicleType: VehicleType;
  status: VehicleStatus;
  model: string;
  fuelTypeName: string;
  madeYear: number;
  workEnvironment: string;
  kmReading: number;
  color: string;
  imgSrc: string | null;
  libreSrc: string | null;
  madeIn: string;
  chassisNumber: string;
  motorNumber: string;
  horsePower: number;
  singleWeight: number;
  totalWeight: number;
  axleCount: number | null;
  cylinderCount: number;
  seatsCount: number;
  fuelConsumptionRate: number;
  insuranceCompany: string | null;
  lastQuotaRefuel: string | null;
  insuranceEndDate: string | null;
  boloEndDate: string | null;
  responsibleStaffName: string;
  driverName: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VehicleDetail {
  general: VehicleDto;
  maintenances: PageResponse<any>;
  incidents: PageResponse<any>;
  insurances: PageResponse<any>;
}

export enum VehicleType {
  Coaster = 'Coaster',
  Bus = 'Bus',
  Truck = 'Truck',
  Car = 'Car',
  Van = 'Van',
  Motorcycle = 'Motorcycle'
}

export enum VehicleStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  UNDER_MAINTENANCE = 'UNDER_MAINTENANCE',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

export interface CreateVehicleDto {
  plateNumber: string;
  vehicleType: VehicleType;
  model: string;
  fuelTypeId: number;
  status: VehicleStatus;
  isPrivate: boolean;
  chassisNumber: string;
  motorNumber: string;
  color: string;
  madeYear: number;
  responsibleStaffId: number;
  madeIn: string;
  horsePower: number;
  singleWeight: number;
  totalWeight: number;
  axleCount?: number;
  cylinderCount: number;
  seatsCount: number;
  kmReading: number;
  workEnvironment: string;
  fuelConsumptionRate: number;
  driverId?: number;
  insuranceCompany?: string;
  insuranceEndDate?: string;
  boloEndDate?: string;
  lastQuotaRefuel?: string;
  vehicleImg?: File;
  libreImg?: File;
}

export interface UpdateVehicleDto {
  plateNumber?: string;
  vehicleType?: VehicleType;
  model?: string;
  fuelTypeId?: number;
  status?: VehicleStatus;
  isPrivate?: boolean;
  chassisNumber?: string;
  motorNumber?: string;
  color?: string;
  madeYear?: number;
  responsibleStaffId?: number;
  madeIn?: string;
  horsePower?: number;
  singleWeight?: number;
  totalWeight?: number;
  axleCount?: number;
  cylinderCount?: number;
  seatsCount?: number;
  kmReading?: number;
  workEnvironment?: string;
  fuelConsumptionRate?: number;
  driverId?: number;
  insuranceCompany?: string;
  insuranceEndDate?: string;
  boloEndDate?: string;
  lastQuotaRefuel?: string;
  vehicleImg?: File;
  libreImg?: File;
}

export interface Level {
  id: number;
  parentId: number | null;
  name: string;
  children: number[];
  isStructural: boolean;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface LightLevelDto {
  id: number;
  name: string;
}

// Types for Fuel Request Management
export interface CreateFuelRequestDto {
  targetType: TargetType;
  vehicleId?: number;
  fuelTypeId: number;
  requestNote?: string;
  requestedAmount: number;
}

export interface FuelRequestActionDto {
  action: ActionType;
  actedAmount?: number;
  actionReason?: string;
}

export interface FuelRequestDto {
  id: number;
  targetType: TargetType;
  vehiclePlateNumber?: string;
  levelName: string;
  fuelTypeName: string;
  status: RequestStatus;
  requestedBy: string;
  requestedAmount: number;
  requestNote?: string;
  requestedAt: string;
  actedByName?: string;
  actedAt?: string;
  actedAmount?: number;
  actionReason?: string;
  createdAt?: string;
  updatedAt: string;
}

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
  actionReason?: string;
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
  actionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export enum TargetType {
  GENERATOR = 'GENERATOR',
  VEHICLE = 'VEHICLE'
}

export enum ActionType {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  APPROVE_WITH_MODIFICATION = 'APPROVE_WITH_MODIFICATION'
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}


// DTO for creating a maintenance request
export interface CreateMaintenanceRequestDto {
  vehicleId: number;
  title: string;
  description: string;
}

// DTO for maintenance request action (structurally same as TripRequestActionDto, but named for clarity)
// You can reuse TripRequestActionDto if you prefer, or define this:
export interface MaintenanceRequestActionDto {
  action: ActionType; // Reuses existing ActionType enum
  actionReason?: string;
}

// DTO for displaying a maintenance request
export interface MaintenanceRequestDto {
  id: number;
  plateNumber: string; // Vehicle's plate number
  title: string;
  description: string;
  status: RequestStatus; // Reuses existing RequestStatus enum
  requestedBy: string;
  requestedAt: string;
  actedBy?: string;
  actedAt?: string;
  actionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Query Params for maintenance requests (can reuse existing RequestQueryParams if identical)
// For clarity, or if specific params are needed later:
export interface MaintenanceRequestQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
  // Add any specific maintenance search/filter params here if backend supports them
}

export interface RequestQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

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

export interface PositionQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

export interface ProjectQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}

export interface VehicleQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  direction?: 'ASC' | 'DESC';
}
