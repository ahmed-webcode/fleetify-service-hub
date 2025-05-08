
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { apiClient } from "@/lib/apiClient";
import { decodeJwt, isTokenExpired, getRolesFromToken, Role, ROLE_DETAILS } from "@/lib/jwtUtils";

// Define authentication state interface
interface AuthState {
  token: string | null;
  user: { username: string } | null;
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
    const initializeAuth = () => {
      const storedToken = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");
      const storedSelectedRole = localStorage.getItem("selected_role");
      
      if (storedToken && !isTokenExpired(storedToken)) {
        const roles = getRolesFromToken(storedToken);
        const user = storedUser ? JSON.parse(storedUser) : null;
        const selectedRole = storedSelectedRole ? JSON.parse(storedSelectedRole) : 
                           (roles.length === 1 ? roles[0] : null);
        
        setAuthState({
          token: storedToken,
          user,
          roles,
          selectedRole,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // Clear storage if token is expired or invalid
        if (storedToken) {
          localStorage.removeItem("auth_token");
          localStorage.removeItem("auth_user");
          localStorage.removeItem("selected_role");
        }
        setAuthState(prev => ({...prev, isLoading: false}));
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<{success: boolean, multipleRoles: boolean}> => {
    try {
      // Get JWT token from API
      const token = await apiClient.auth.login(username, password);
      
      if (!token) {
        throw new Error("Authentication failed");
      }
      
      // Store token in localStorage
      localStorage.setItem("auth_token", token);
      
      // Get user roles from token
      const roles = getRolesFromToken(token);
      
      // Store user info
      const user = { username };
      localStorage.setItem("auth_user", JSON.stringify(user));
      
      // Determine if we need role selection
      const multipleRoles = roles.length > 1;
      
      // If there's only one role, select it automatically
      if (roles.length === 1) {
        localStorage.setItem("selected_role", JSON.stringify(roles[0]));
        setAuthState({
          token,
          user,
          roles,
          selectedRole: roles[0],
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        // Don't set selectedRole yet if multiple roles
        setAuthState({
          token,
          user,
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

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        logout,
        selectRole,
        hasRole,
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
export type { Role };
