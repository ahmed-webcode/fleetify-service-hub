
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export function useDashboardStats() {
  // Total vehicles
  const vehiclesQuery = useQuery({
    queryKey: ["dashboard", "vehicles"],
    queryFn: () => apiClient.vehicles.getAll({ size: 1 }),
    refetchOnWindowFocus: false,
  });

  // Service (maintenance) requests
  const serviceRequestsQuery = useQuery({
    queryKey: ["dashboard", "serviceRequests"],
    queryFn: () => apiClient.maintenance.requests.getAll({ size: 1 }),
    refetchOnWindowFocus: false,
  });

  // Fuel requests
  const fuelRequestsQuery = useQuery({
    queryKey: ["dashboard", "fuelRequests"],
    queryFn: () => apiClient.fuel.requests.getAll({ size: 1 }),
    refetchOnWindowFocus: false,
  });

  // Staff/drivers: count active users with role "DRIVER"
  const staffQuery = useQuery({
    queryKey: ["dashboard", "staff"],
    queryFn: async () => {
      const users = await apiClient.users.getAll();
      return Array.isArray(users)
        ? users.filter((u) => Array.isArray(u.roles) && u.roles.some((role) => role.name === "DRIVER"))
        : [];
    },
    refetchOnWindowFocus: false,
  });

  // Fuel/consumption stats - use fuel records as an example (could be replaced with reporting endpoint if available)
  const fuelRecordsQuery = useQuery({
    queryKey: ["dashboard", "fuelRecords"],
    queryFn: () => apiClient.fuel.records.getAll({ size: 100 }),
    refetchOnWindowFocus: false,
  });

  // Maintenance stats (statuses/counts by type)
  const maintenanceRequestsQuery = useQuery({
    queryKey: ["dashboard", "maintenanceRequests"],
    queryFn: () => apiClient.maintenance.requests.getAll({ size: 100 }),
    refetchOnWindowFocus: false,
  });

  return {
    vehiclesQuery,
    serviceRequestsQuery,
    fuelRequestsQuery,
    staffQuery,
    fuelRecordsQuery,
    maintenanceRequestsQuery,
  };
}
