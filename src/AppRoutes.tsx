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
import MaintenanceManagement from "./pages/MaintenanceManagement";
import InsuranceManagement from "./pages/InsuranceManagement";

// Update role IDs in ROLES to reflect new backend order:
const ROLES = {
  TRANSPORT_DIRECTOR: 1,
  DEPLOYMENT_MANAGER: 2,
  FUEL_MANAGER: 3,
  INSURANCE_MANAGER: 4,
  MAINTENANCE_MANAGER: 5,
  STORE_MANAGER: 6,
  OPERATIONAL_DIRECTOR: 7,
  FUEL_ATTENDANT: 8,
  OFFICIER: 9,
  DRIVER: 10,
  MECHANIC: 11
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

            <Route path="/maintenance-management" element={
            <ProtectedRoute requiredRoleId={ROLES.TRANSPORT_DIRECTOR}>
                <MaintenanceManagement />
            </ProtectedRoute>
            } />

            <Route path="/insurance-management" element={
            <ProtectedRoute requiredRoleId={ROLES.TRANSPORT_DIRECTOR}>
                <InsuranceManagement />
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

            {/* Fallback routes */}
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    );
}
