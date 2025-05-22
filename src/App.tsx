
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
import RequestMaintenance from "./pages/RequestMaintenance";
import ReportIncident from "./pages/ReportIncident";
import InsuranceManagement from "./pages/InsuranceManagement";
import VehicleDetail from './pages/VehicleDetail';
import PositionsManagement from './pages/PositionsManagement';
import ProjectsManagement from './pages/ProjectsManagement';
import TripManagement from "./pages/TripManagement";

// Define role IDs for easier reference in protected routes
const ROLES = {
  TRANSPORT_DIRECTOR: 1,
  MAINTENANCE_MANAGER: 2,
  DEPLOYMENT_MANAGER: 3,
  FUEL_MANAGER: 4,
  OPERATIONAL_DIRECTOR: 5,
  FUEL_ATTENDANT: 6,
  DRIVER: 7,
  STAFF: 8,
  MECHANIC: 9
};

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
  return (
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
              
              <Route path="/vehicles" element={
                <ProtectedRoute>
                  <Vehicles />
                </ProtectedRoute>
              } />

              <Route path="/vehicles/:id" element={
                <ProtectedRoute>
                  <VehicleDetail />
                </ProtectedRoute>
              } />
              
              <Route path="/gps-tracking" element={
                <ProtectedRoute allowedRoleIds={[ROLES.TRANSPORT_DIRECTOR, ROLES.DEPLOYMENT_MANAGER, ROLES.OPERATIONAL_DIRECTOR]}>
                  <GPSTracking />
                </ProtectedRoute>
              } />
              
              <Route path="/trip-requests" element={
                <ProtectedRoute allowedRoleIds={[ROLES.TRANSPORT_DIRECTOR, ROLES.DEPLOYMENT_MANAGER, ROLES.STAFF, ROLES.OPERATIONAL_DIRECTOR]}>
                  <TripRequests />
                </ProtectedRoute>
              } />

              <Route path="/trip-management" element={
                <ProtectedRoute allowedRoleIds={[ROLES.TRANSPORT_DIRECTOR, ROLES.FUEL_MANAGER, ROLES.FUEL_ATTENDANT, ROLES.OPERATIONAL_DIRECTOR]}>
                  <TripManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/fuel-management" element={
                <ProtectedRoute allowedRoleIds={[ROLES.TRANSPORT_DIRECTOR, ROLES.FUEL_MANAGER, ROLES.FUEL_ATTENDANT, ROLES.OPERATIONAL_DIRECTOR]}>
                  <FuelManagement />
                </ProtectedRoute>
              } />

              
              {/* Service request routes */}
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
                <ProtectedRoute allowedRoleIds={[ROLES.TRANSPORT_DIRECTOR, ROLES.MAINTENANCE_MANAGER, ROLES.MECHANIC, ROLES.OPERATIONAL_DIRECTOR, ROLES.DRIVER]}>
                  <ServiceRequests />
                </ProtectedRoute>
              } />
              
              <Route path="/report-incident" element={
                <ProtectedRoute>
                  <ReportIncident />
                </ProtectedRoute>
              } />
              
              <Route path="/insurance-management" element={
                <ProtectedRoute allowedRoleIds={[ROLES.TRANSPORT_DIRECTOR, ROLES.MAINTENANCE_MANAGER]}>
                  <InsuranceManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/maintenance-requests" element={
                <ProtectedRoute allowedRoleIds={[ROLES.TRANSPORT_DIRECTOR, ROLES.MAINTENANCE_MANAGER, ROLES.MECHANIC]}>
                  <MaintenanceRequests />
                </ProtectedRoute>
              } />

              <Route path="/reports" element={
                <ProtectedRoute allowedRoleIds={[ROLES.TRANSPORT_DIRECTOR, ROLES.MAINTENANCE_MANAGER, ROLES.FUEL_MANAGER, ROLES.OPERATIONAL_DIRECTOR]}>
                  <Reports />
                </ProtectedRoute>
              } />
              
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
              
              <Route path="/manage-users" element={
                <ProtectedRoute requiredRoleId={ROLES.TRANSPORT_DIRECTOR}>
                  <ManageUsers />
                </ProtectedRoute>
              } />

              <Route path="/manage-colleges" element={
                <ProtectedRoute requiredRoleId={ROLES.TRANSPORT_DIRECTOR}>
                  <ManageColleges />
                </ProtectedRoute>
              } />
              
              <Route path="/manage-staff" element={
                <ProtectedRoute requiredRoleId={ROLES.TRANSPORT_DIRECTOR}>
                  <ManageStaff />
                </ProtectedRoute>
              } />

              <Route path="/driver-management" element={
                <ProtectedRoute allowedRoleIds={[ROLES.TRANSPORT_DIRECTOR, ROLES.DEPLOYMENT_MANAGER]}>
                  <DriverManagement />
                </ProtectedRoute>
              } />
              
              <Route path="/positions-management" element={
                <ProtectedRoute allowedRoleIds={[ROLES.TRANSPORT_DIRECTOR, ROLES.OPERATIONAL_DIRECTOR]}>
                  <PositionsManagement />
                </ProtectedRoute>
              } />

              <Route path="/projects-management" element={
                <ProtectedRoute allowedRoleIds={[ROLES.TRANSPORT_DIRECTOR, ROLES.OPERATIONAL_DIRECTOR]}>
                  <ProjectsManagement />
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
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
