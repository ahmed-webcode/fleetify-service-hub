
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";

// Add this constant for the role names (assuming 11 role names as required)
export const ALL_ROLE_NAMES = [
  "Transport Director",
  "Deployment Manager",
  "Fuel Manager",
  "Insurance Manager",
  "Maintenance Manager",
  "Store Manager",
  "Operational Director",
  "Fuel Attendant",
  "Officier",
  "Driver",
  "Mechanic"
];

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

  // All Officier (to find role distribution)
  const usersQuery = useQuery({
    queryKey: ["dashboard", "users"],
    queryFn: () => apiClient.users.getAll(),
    refetchOnWindowFocus: false,
  });

  // Trips requests
  const tripRequestsQuery = useQuery({
    queryKey: ["dashboard", "tripRequests"],
    queryFn: () => apiClient.trips.requests.getAll({ size: 1 }),
    refetchOnWindowFocus: false,
  });

  // Recent trip records (latest 3)
  const recentTripsQuery = useQuery({
    queryKey: ["dashboard", "recentTrips"],
    queryFn: () => apiClient.tripRecords.getAll({ size: 3, direction: "DESC", sortBy: "assignedAt" }),
    refetchOnWindowFocus: false,
  });

  // Recent fuel records (latest 3)
  const recentFuelRecordsQuery = useQuery({
    queryKey: ["dashboard", "recentFuelRecords"],
    queryFn: () => apiClient.fuel.records.getAll({ size: 3, direction: "DESC", sortBy: "issuedAt" }),
    refetchOnWindowFocus: false,
  });

  return {
    vehiclesQuery,
    fuelRequestsQuery,
    usersQuery,
    tripRequestsQuery,
    recentTripsQuery,
    recentFuelRecordsQuery,
  };
}
