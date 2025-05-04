
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useSupabaseAuth } from "@/contexts/SupabaseAuthContext";
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
  const { isAuthenticated: mockAuth, hasPermission: mockHasPermission, user: mockUser } = useAuth();
  const { user: supabaseUser } = useSupabaseAuth();
  const location = useLocation();
  
  const isAuthenticated = !!supabaseUser || mockAuth;
  const user = supabaseUser || mockUser;
  
  // A function that checks permissions in both auth systems
  const hasPermission = (permission: Permission) => {
    // If the user is authenticated with Supabase
    if (supabaseUser) {
      // Get the role from user metadata
      const role = supabaseUser.user_metadata?.role;
      
      // Simplified permission check based on role
      if (role === 'transport_director') return true; // Directors have all permissions
      
      // Map permissions to roles
      const rolePermissions: Record<string, Permission[]> = {
        'operational_director': [
          "request_fuel", "request_fleet", "request_maintenance", "view_reports", "track_vehicles", "report_incidents"
        ],
        'fotl': ["approve_normal_fuel", "view_reports", "report_incidents"],
        'ftl': ["approve_fleet", "assign_driver", "view_reports", "track_vehicles", "report_incidents"],
        'mtl': ["approve_maintenance", "view_reports", "report_incidents"],
        'regular_staff': ["request_maintenance", "request_fuel", "request_fleet", "report_incidents"]
      };
      
      // Check if the user's role has the required permission
      return !!role && rolePermissions[role]?.includes(permission);
    }
    
    // Fall back to the mock auth system
    return mockHasPermission(permission);
  };

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
    const userRole = supabaseUser ? supabaseUser.user_metadata?.role : user.role;
    if (!userRole || !roles.includes(userRole)) {
      toast.error(`This page is restricted to: ${roles.join(", ").replace(/_/g, " ")}`);
      return <Navigate to="/dashboard" state={{ roleDenied: true }} replace />;
    }
  }

  return <PageLayout>{children}</PageLayout>;
};
