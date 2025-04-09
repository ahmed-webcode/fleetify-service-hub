
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { Permission } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { toast } from "sonner";

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

  useEffect(() => {
    // Check for permission or role denial messages from state
    if (location.state?.permissionDenied) {
      toast.error("You don't have permission to access that page");
      // Clear the state so the message doesn't show again on refresh
      window.history.replaceState({}, document.title);
    } else if (location.state?.roleDenied) {
      toast.error("This page is restricted to specific roles");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (!isAuthenticated) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    toast.error(`You don't have the necessary permission: ${requiredPermission.replace(/_/g, " ")}`);
    return <Navigate to="/dashboard" state={{ permissionDenied: true }} replace />;
  }

  // Check if this route is restricted to specific roles
  if (roles && roles.length > 0 && user) {
    if (!roles.includes(user.role)) {
      toast.error(`This page is restricted to: ${roles.join(", ").replace(/_/g, " ")}`);
      return <Navigate to="/dashboard" state={{ roleDenied: true }} replace />;
    }
  }

  return <PageLayout>{children}</PageLayout>;
};
