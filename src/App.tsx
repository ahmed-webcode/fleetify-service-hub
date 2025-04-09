
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
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
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            
            {/* Vehicle management routes */}
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
            
            {/* Trip request routes - accessible to operational directors */}
            <Route path="/trip-requests" element={
              <ProtectedRoute roles={["operational_director"]}>
                <TripRequests />
              </ProtectedRoute>
            } />
            
            {/* Fuel management routes */}
            <Route path="/fuel-management" element={
              <ProtectedRoute>
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
              <ProtectedRoute>
                <ServiceRequests />
              </ProtectedRoute>
            } />

            {/* New pages */}
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
            
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } />
            
            {/* Fallback routes */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
