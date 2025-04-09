
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { Permission } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  roles?: string[];
}

export const ProtectedRoute = ({ 
  children, 
  requiredPermission,
  roles
}: ProtectedRouteProps) => {
  const { isAuthenticated, hasPermission, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    // User doesn't have required permission, redirect to dashboard with message
    return <Navigate to="/dashboard" state={{ permissionDenied: true }} replace />;
  }

  // Check if this route is restricted to specific roles
  if (roles && roles.length > 0 && user) {
    if (!roles.includes(user.role)) {
      // User doesn't have the required role, redirect with message
      return <Navigate to="/dashboard" state={{ roleDenied: true }} replace />;
    }
  }

  return <PageLayout>{children}</PageLayout>;
};
