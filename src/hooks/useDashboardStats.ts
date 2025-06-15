
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

export function useDashboardStats() {
  // Total vehicles
  const vehiclesQuery = useQuery({
    queryKey: ["dashboard", "vehicles"],
    queryFn: () => apiClient.vehicles.getAll({ size: 1 }),
    refetchOnWindowFocus: false,
  });

  // Fuel requests
  const fuelRequestsQuery = useQuery({
    queryKey: ["dashboard", "fuelRequests"],
    queryFn: () => apiClient.fuel.requests.getAll({ size: 1 }),
    refetchOnWindowFocus: false,
  });

  // Users that are drivers
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

  // Trips requests
  const tripRequestsQuery = useQuery({
    queryKey: ["dashboard", "tripRequests"],
    queryFn: () => apiClient.trips.requests.getAll({ size: 1 }),
    refetchOnWindowFocus: false,
  });

  // Optionally, recent trips (not used in summary cards—could be used for a small chart)
  // const recentTripsQuery = useQuery({
  //   queryKey: ["dashboard", "recentTrips"],
  //   queryFn: () => apiClient.trips.requests.getAll({ size: 10, direction: "DESC" }),
  //   refetchOnWindowFocus: false,
  // });

  return {
    vehiclesQuery,
    fuelRequestsQuery,
    staffQuery,
    tripRequestsQuery
    // recentTripsQuery,
  };
}
