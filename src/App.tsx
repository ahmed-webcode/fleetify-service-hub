
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";
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

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner position="top-right" closeButton richColors />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Vehicle management routes - only transport director can add vehicles */}
            <Route path="/vehicles" element={
              <ProtectedRoute>
                <Vehicles />
              </ProtectedRoute>
            } />
            
            {/* GPS tracking - transport director, operation director, and FTL can access */}
            <Route path="/gps-tracking" element={
              <ProtectedRoute requiredPermission="track_vehicles">
                <GPSTracking />
              </ProtectedRoute>
            } />
            
            {/* Trip requests - accessible to users who can request fleet */}
            <Route path="/trip-requests" element={
              <ProtectedRoute requiredPermission="request_fleet">
                <TripRequests />
              </ProtectedRoute>
            } />
            
            {/* Fuel management - accessible to users who can approve or request fuel */}
            <Route path="/fuel-management" element={
              <ProtectedRoute>
                <FuelManagement />
              </ProtectedRoute>
            } />
            
            {/* Service request routes - maintenance team leader can access maintenance requests */}
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
            
            {/* New dedicated maintenance requests page */}
            <Route path="/maintenance-requests" element={
              <ProtectedRoute>
                <MaintenanceRequests />
              </ProtectedRoute>
            } />

            {/* Reports page - requires view_reports permission */}
            <Route path="/reports" element={
              <ProtectedRoute requiredPermission="view_reports">
                <Reports />
              </ProtectedRoute>
            } />
            
            {/* Settings page */}
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* User management - transport director only */}
            <Route path="/manage-users" element={
              <ProtectedRoute requiredPermission="add_users">
                <ManageUsers />
              </ProtectedRoute>
            } />

            {/* College/Institute management - transport director only */}
            <Route path="/manage-colleges" element={
              <ProtectedRoute requiredPermission="add_users">
                <ManageColleges />
              </ProtectedRoute>
            } />
            
            {/* Staff management - transport director only */}
            <Route path="/manage-staff" element={
              <ProtectedRoute requiredPermission="add_users">
                <ManageStaff />
              </ProtectedRoute>
            } />

            {/* Driver management - transport director only */}
            <Route path="/driver-management" element={
              <ProtectedRoute requiredPermission="add_users">
                <DriverManagement />
              </ProtectedRoute>
            } />
            
            {/* Notifications page */}
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
    </QueryClientProvider>
  </BrowserRouter>
);

export default App;
