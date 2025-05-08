
import { ReactNode } from "react";
import { useAuth, Permission } from "@/contexts/AuthContext";

interface HasPermissionProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export const HasPermission = ({ permission, children, fallback = null }: HasPermissionProps) => {
  const { hasPermission } = useAuth();
  
  if (hasPermission(permission)) {
    return <>{children}</>;
  }
  
  return <>{fallback}</>;
};
