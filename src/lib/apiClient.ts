import { toast } from "sonner";

// Base URL configuration
const API_BASE_URL = "http://localhost:8080/api";

// Response type for login
interface LoginResponse {
  roles: string[];
  token: string;
}

// Utility function to handle HTTP errors
const handleHttpError = (error: any): never => {
  const message = error.message || "An unknown error occurred";
  console.error("API Error:", error);
  toast.error(`API Error: ${message}`);
  throw error;
};

// Default headers for all requests
const getDefaultHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add auth token if available
  const token = localStorage.getItem("auth_token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

// Generic fetch wrapper with error handling
async function fetchWithErrorHandling<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    // Merge default headers with any provided headers
    const mergedHeaders = {
      ...getDefaultHeaders(),
      ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: mergedHeaders,
    });

    // Handle non-200 responses
    if (!response.ok) {
      const errorData = await response.text();
      try {
        const jsonError = JSON.parse(errorData);
        throw new Error(jsonError.message || `Server error: ${response.status}`);
      } catch (e) {
        // If parsing fails, use the raw text
        throw new Error(errorData || `Server error: ${response.status}`);
      }
    }

    // Check content type to determine how to parse the response
    const contentType = response.headers.get("content-type");
    
    if (contentType && contentType.includes("application/json")) {
      return await response.json() as T;
    } else {
      // For text responses
      const textResult = await response.text();
      // Attempt to cast as T - this works for primitive types like string
      return textResult as unknown as T;
    }
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
    getAll: () => {
      return fetchWithErrorHandling("/vehicles");
    },
    getById: (id: string) => {
      return fetchWithErrorHandling(`/vehicles/${id}`);
    },
    create: (vehicleData: any) => {
      return fetchWithErrorHandling("/vehicles", {
        method: "POST",
        body: JSON.stringify(vehicleData),
      });
    },
    update: (id: string, vehicleData: any) => {
      return fetchWithErrorHandling(`/vehicles/${id}`, {
        method: "PUT",
        body: JSON.stringify(vehicleData),
      });
    },
    delete: (id: string) => {
      return fetchWithErrorHandling(`/vehicles/${id}`, {
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
    }
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
    }
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
