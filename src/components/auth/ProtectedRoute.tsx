
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { PageLayout } from "@/components/layout/PageLayout";
import { useEffect } from "react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoleId?: number;
  allowedRoleIds?: number[];
}

export const ProtectedRoute = ({ 
  children, 
  requiredRoleId,
  allowedRoleIds
}: ProtectedRouteProps) => {
  const { isAuthenticated, selectedRole, isLoading } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // Check for access denied messages from state
    if (location.state?.accessDenied) {
      toast.error("You don't have access to the requested page");
      // Clear the state so the message doesn't show again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated || !selectedRole) {
    // Redirect to login page but save the location they were trying to access
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check for required role
  if (requiredRoleId && selectedRole.id !== requiredRoleId) {
    toast.error(`This page requires specific role access`);
    return <Navigate to="/dashboard" state={{ accessDenied: true }} replace />;
  }

  // Check if role is in allowed roles list
  if (allowedRoleIds && allowedRoleIds.length > 0) {
    if (!allowedRoleIds.includes(selectedRole.id)) {
      toast.error(`This page is restricted to specific roles`);
      return <Navigate to="/dashboard" state={{ accessDenied: true }} replace />;
    }
  }

  // User is authenticated and has required role
  return <PageLayout>{children}</PageLayout>;
};
