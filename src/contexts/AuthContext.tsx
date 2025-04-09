
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define user roles
export type UserRole = 
  | "transport_director" 
  | "operational_director" 
  | "fotl" 
  | "ftl";

// Define permission types
export type Permission = 
  | "approve_special_fuel" 
  | "add_users" 
  | "add_vehicle" 
  | "view_reports" 
  | "track_vehicles"
  | "request_fuel" 
  | "request_fleet" 
  | "request_maintenance"
  | "approve_normal_fuel"
  | "approve_fleet"
  | "assign_driver";

interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: Permission) => boolean;
}

// Mock users for demonstration purposes
const MOCK_USERS = [
  {
    id: "1",
    username: "transport_director",
    password: "password123",
    fullName: "Transport Director",
    role: "transport_director" as UserRole,
  },
  {
    id: "2",
    username: "operational_director",
    password: "password123",
    fullName: "Operational Director",
    role: "operational_director" as UserRole,
  },
  {
    id: "3",
    username: "fotl",
    password: "password123",
    fullName: "FOTL User",
    role: "fotl" as UserRole,
  },
  {
    id: "4",
    username: "ftl",
    password: "password123",
    fullName: "FTL User",
    role: "ftl" as UserRole,
  },
];

// Role permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  transport_director: [
    "approve_special_fuel",
    "add_users",
    "add_vehicle",
    "view_reports",
    "track_vehicles"
  ],
  operational_director: [
    "request_fuel",
    "request_fleet",
    "request_maintenance",
    "view_reports"
  ],
  fotl: [
    "approve_normal_fuel",
    "view_reports"
  ],
  ftl: [
    "approve_fleet",
    "assign_driver",
    "view_reports"
  ]
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    const foundUser = MOCK_USERS.find(
      (u) => u.username === username && u.password === password
    );

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      toast.success(`Welcome back, ${foundUser.fullName}!`);
      return true;
    }

    toast.error("Invalid username or password");
    return false;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
    toast.info("You have been logged out");
  };

  // Check if user has a specific permission
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role].includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
