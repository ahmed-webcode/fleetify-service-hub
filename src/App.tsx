import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthProvider as SupabaseAuthProvider } from "@/contexts/SupabaseAuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { useEffect } from "react";
import { createVehiclesStorageBucket } from "@/lib/createStorageBucket";
import { createVehicleImageBucket } from "./lib/createStorageBucket";
import Login from "./pages/Login";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import ServiceRequests from "./pages/ServiceRequests";
import GPSTracking from "./pages/GPSTracking";
import NotFound from "./pages/NotFound";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import TripRequests from "./pages/TripRequests";
import FuelManagement from "./pages/FuelManagement";
import ManageUsers from "./pages/ManageUsers";
import ManageColleges from "./pages/ManageColleges";
import ManageStaff from "./pages/ManageStaff";
import DriverManagement from "./pages/DriverManagement";
import MaintenanceRequests from "./pages/MaintenanceRequests";
import RequestMaintenance from "./pages/RequestMaintenance";
import ReportIncident from "./pages/ReportIncident";
import InsuranceManagement from "./pages/InsuranceManagement";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  // Initialize the storage bucket on app start
  useEffect(() => {
    createVehiclesStorageBucket();
  }, []);

  // Initialize the vehicle images storage bucket
  createVehicleImageBucket().catch(console.error);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <SupabaseAuthProvider>
          <AuthProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner position="top-right" closeButton richColors />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Navigate to="/login" replace />} />
                <Route path="/login" element={<Login />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Protected routes without PageLayout */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                
                <Route path="/vehicles" element={
                  <ProtectedRoute>
                    <Vehicles />
                  </ProtectedRoute>
                } />
                
                <Route path="/gps-tracking" element={
                  <ProtectedRoute requiredPermission="track_vehicles">
                    <GPSTracking />
                  </ProtectedRoute>
                } />
                
                <Route path="/trip-requests" element={
                  <ProtectedRoute requiredPermission="request_fleet">
                    <TripRequests />
                  </ProtectedRoute>
                } />
                
                <Route path="/fuel-management" element={
                  <ProtectedRoute>
                    <FuelManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/service-requests" element={
                  <ProtectedRoute>
                    <ServiceRequests />
                  </ProtectedRoute>
                } />
                
                <Route path="/service-requests/fleet" element={
                  <ProtectedRoute>
                    <ServiceRequests />
                  </ProtectedRoute>
                } />
                
                <Route path="/service-requests/fuel" element={
                  <ProtectedRoute>
                    <ServiceRequests />
                  </ProtectedRoute>
                } />
                
                <Route path="/service-requests/maintenance" element={
                  <ProtectedRoute>
                    <ServiceRequests />
                  </ProtectedRoute>
                } />
                
                <Route path="/request-maintenance" element={
                  <ProtectedRoute requiredPermission="request_maintenance">
                    <RequestMaintenance />
                  </ProtectedRoute>
                } />
                
                <Route path="/report-incident" element={
                  <ProtectedRoute requiredPermission="report_incidents">
                    <ReportIncident />
                  </ProtectedRoute>
                } />
                
                <Route path="/insurance-management" element={
                  <ProtectedRoute>
                    <InsuranceManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/maintenance-requests" element={
                  <ProtectedRoute>
                    <MaintenanceRequests />
                  </ProtectedRoute>
                } />

                <Route path="/reports" element={
                  <ProtectedRoute requiredPermission="view_reports">
                    <Reports />
                  </ProtectedRoute>
                } />
                
                <Route path="/settings" element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                } />
                
                <Route path="/manage-users" element={
                  <ProtectedRoute requiredPermission="add_users">
                    <ManageUsers />
                  </ProtectedRoute>
                } />

                <Route path="/manage-colleges" element={
                  <ProtectedRoute requiredPermission="add_users">
                    <ManageColleges />
                  </ProtectedRoute>
                } />
                
                <Route path="/manage-staff" element={
                  <ProtectedRoute requiredPermission="add_users">
                    <ManageStaff />
                  </ProtectedRoute>
                } />

                <Route path="/driver-management" element={
                  <ProtectedRoute requiredPermission="add_users">
                    <DriverManagement />
                  </ProtectedRoute>
                } />
                
                <Route path="/notifications" element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                } />
                
                {/* Fallback routes */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </TooltipProvider>
          </AuthProvider>
        </SupabaseAuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
