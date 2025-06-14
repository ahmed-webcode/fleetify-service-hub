
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Vehicles from "./pages/Vehicles";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import FuelManagement from "./pages/FuelManagement";
import VehicleDetail from './pages/VehicleDetail';
import ProjectsManagement from './pages/ProjectsManagement';
import TripManagement from "./pages/TripManagement";
import UserManagement from "./pages/UserManagement";

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

export function AppRoutes() {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes - MVP */}
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

            <Route path="/trip-management" element={
            <ProtectedRoute>
                <TripManagement />
            </ProtectedRoute>
            } />
            
            <Route path="/fuel-management" element={
            <ProtectedRoute>
                <FuelManagement />
            </ProtectedRoute>
            } />

            <Route path="/projects-management" element={
            <ProtectedRoute requiredRoleId={ROLES.TRANSPORT_DIRECTOR}>
                <ProjectsManagement />
            </ProtectedRoute>
            } />

            <Route path="/user-management" element={
            <ProtectedRoute requiredRoleId={ROLES.TRANSPORT_DIRECTOR}>
                <UserManagement />
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

            {/* Commented out routes for future implementation */}
            {/* ... commented routes from App.tsx */}
            
            {/* Fallback routes */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    );
}
