import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { 
  decodeJwt, 
  isTokenExpired, 
  Role, 
  ROLE_DETAILS, 
  Permission, 
  ROLE_PERMISSIONS, 
  mapRoleNamesToRoles 
} from "@/lib/jwtUtils";

// Define authentication state interface
interface AuthState {
  token: string | null;
  user: { 
    id: number;
    username: string;
    fullName?: string; // Optional as it might not be in the JWT
    email?: string;
  } | null;
  roles: Role[];
  selectedRole: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Define authentication context interface
interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<{success: boolean, multipleRoles: boolean}>;
  logout: () => void;
  selectRole: (role: Role) => void;
  hasRole: (roleId: number) => boolean;
  hasPermission: (permission: Permission) => boolean;
}

// Create context with default values
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null,
    roles: [],
    selectedRole: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const navigate = useNavigate();

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("auth_token");
      const storedSelectedRole = localStorage.getItem("selected_role");
      const storedRoles = localStorage.getItem("auth_roles");

      if (storedToken && !isTokenExpired(storedToken)) {
        // Fetch updated user profile from /users/me to get id
        try {
          const rawUser = await apiClient.users.getMe();
          const roles = storedRoles ? JSON.parse(storedRoles) : [];
          const selectedRole = storedSelectedRole ? JSON.parse(storedSelectedRole) : 
                            (roles.length === 1 ? roles[0] : null);

          setAuthState({
            token: storedToken,
            user: rawUser ? {
              id: rawUser.id,
              username: rawUser.username || rawUser.email,
              fullName: `${rawUser.firstName} ${rawUser.lastName}`, // Fixed: Construct full name
              email: rawUser.email,
            } : null,
            roles,
            selectedRole,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (err) {
          // On error, clear everything
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
          localStorage.removeItem("selected_role");
          localStorage.removeItem("auth_roles");
          setAuthState(prev => ({...prev, isLoading: false}));
        }
      } else {
        // Clear storage if token is expired or invalid
        localStorage.removeItem("auth_token");
        localStorage.removeItem("auth_user");
        localStorage.removeItem("selected_role");
        localStorage.removeItem("auth_roles");
        setAuthState(prev => ({...prev, isLoading: false}));
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<{success: boolean, multipleRoles: boolean}> => {
    try {
      const response = await apiClient.auth.login(username, password);
      if (!response || !response.token) throw new Error("Authentication failed");
      const token = response.token;
      localStorage.setItem("auth_token", token);

      const roles = mapRoleNamesToRoles(response.roles);
      localStorage.setItem("auth_roles", JSON.stringify(roles));

      // Fetch full user info from /users/me
      let detailedUser: User | null = null;
      try {
        detailedUser = await apiClient.users.getMe();
      } catch (e) {
        detailedUser = null;
      }
      // Persist user
      localStorage.setItem("auth_user", JSON.stringify(detailedUser));
      const multipleRoles = roles.length > 1;

      if (roles.length === 1) {
        localStorage.setItem("selected_role", JSON.stringify(roles[0]));
        setAuthState({
          token,
          user: detailedUser,
          roles,
          selectedRole: roles[0],
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState({
          token,
          user: detailedUser,
          roles,
          selectedRole: null,
          isAuthenticated: true,
          isLoading: false,
        });
      }
      return { success: true, multipleRoles };
    } catch (error) {
      toast.error("Login failed: " + (error as Error).message);
      return { success: false, multipleRoles: false };
    }
  };

  // Role selection function
  const selectRole = (role: Role) => {
    localStorage.setItem("selected_role", JSON.stringify(role));
    setAuthState(prev => ({...prev, selectedRole: role}));
    navigate("/dashboard");
    toast.success(`Logged in as ${role.name}`);
  };

  // Logout function
  const logout = () => {
    // Call API logout endpoint if needed
    apiClient.auth.logout();
    
    // Reset auth state
    setAuthState({
      token: null,
      user: null,
      roles: [],
      selectedRole: null,
      isAuthenticated: false,
      isLoading: false,
    });
    
    // Redirect to login
    navigate("/login", { state: { loggedOut: true } });
  };

  // Function to check if user has a specific role
  const hasRole = (roleId: number): boolean => {
    if (!authState.selectedRole) return false;
    return authState.selectedRole.id === roleId;
  };

  // Function to check if user has a specific permission
  const hasPermission = (permission: Permission): boolean => {
    if (!authState.selectedRole) return false;
    const roleId = authState.selectedRole.id;
    return ROLE_PERMISSIONS[roleId]?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout: () => {
          apiClient.auth.logout();
          setAuthState({
            token: null,
            user: null,
            roles: [],
            selectedRole: null,
            isAuthenticated: false,
            isLoading: false,
          });
          navigate("/login", { state: { loggedOut: true } });
        },
        selectRole: (role: Role) => {
          localStorage.setItem("selected_role", JSON.stringify(role));
          setAuthState(prev => ({...prev, selectedRole: role}));
          navigate("/dashboard");
          toast.success(`Logged in as ${role.name}`);
        },
        hasRole: (roleId: number): boolean => {
          if (!authState.selectedRole) return false;
          return authState.selectedRole.id === roleId;
        },
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export role constants
export { ROLE_DETAILS };
export type { Role, Permission };

// Mock data for UI components that need it
export interface User {
  id: number;
  username: string;
  fullName?: string; // Optional as it might not be in the JWT
  email?: string;
  // ... other optional fields
}

export type UserRole = 'transport_director' | 'operational_director' | 'fotl' | 'ftl' | 'staff';

export const AVAILABLE_ROLES: UserRole[] = [
  'transport_director',
  'operational_director',
  'fotl',
  'ftl',
  'staff'
];

export const MOCK_COLLEGES = [
  { id: '1', name: 'College of Natural and Social Sciences' },
  { id: '2', name: 'College of Business and Economics' },
  { id: '3', name: 'College of Health Sciences' }
];

export const MOCK_INSTITUTES = [
  { id: '1', name: 'Institute of Technology', collegeId: '1' },
  { id: '2', name: 'Institute of Management', collegeId: '2' },
  { id: '3', name: 'Institute of Medicine', collegeId: '3' }
];

export const MOCK_CAMPUSES = [
  { id: '1', name: 'Main Campus', instituteId: '1' },
  { id: '2', name: 'Commerce Campus', instituteId: '2' },
  { id: '3', name: 'Black Lion Campus', instituteId: '3' }
];
