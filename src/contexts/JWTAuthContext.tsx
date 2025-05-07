
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

// Define user roles
export type UserRole = 
  | "transport_director" 
  | "operational_director" 
  | "fotl" 
  | "ftl"
  | "mtl"
  | "regular_staff";

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
  | "assign_driver"
  | "manage_drivers"
  | "approve_maintenance"
  | "report_incidents";

export interface User {
  id: string;
  username: string;
  fullName: string;
  role: UserRole;
  email?: string;
  college?: string;
  institute?: string;
  campus?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: Permission) => boolean;
}

// Role permissions mapping
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  transport_director: [
    "approve_special_fuel", "add_users", "add_vehicle", "view_reports",
    "track_vehicles", "approve_normal_fuel", "approve_fleet", "assign_driver",
    "manage_drivers", "request_fuel", "request_fleet", "request_maintenance", 
    "report_incidents"
  ],
  operational_director: [
    "request_fuel", "request_fleet", "request_maintenance", "view_reports",
    "track_vehicles", "report_incidents"
  ],
  fotl: ["approve_normal_fuel", "view_reports", "report_incidents"],
  ftl: ["approve_fleet", "assign_driver", "view_reports", "track_vehicles", "report_incidents"],
  mtl: ["approve_maintenance", "view_reports", "report_incidents"],
  regular_staff: ["request_maintenance", "request_fuel", "request_fleet", "report_incidents"]
};

// This would be replaced with your actual API URL
const API_URL = "https://your-api-url.com";

const JWTAuthContext = createContext<AuthContextType | undefined>(undefined);

export const JWTAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check if user is authenticated on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    if (storedToken) {
      try {
        // Decode JWT token to get user information
        // Note: In a real implementation, you'd use a proper JWT decoding library
        const payload = JSON.parse(atob(storedToken.split('.')[1]));
        
        // Check if token is expired
        if (payload.exp && payload.exp * 1000 < Date.now()) {
          // Token expired, logout
          logout();
          return;
        }
        
        // Set user from token payload
        setUser({
          id: payload.sub,
          username: payload.username,
          fullName: payload.fullName,
          role: payload.role,
          email: payload.email,
          college: payload.college,
          institute: payload.institute,
          campus: payload.campus
        });
        setToken(storedToken);
      } catch (error) {
        console.error("Failed to decode token", error);
        localStorage.removeItem("auth_token");
      }
    }
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      // This would be replaced with actual API call
      // const response = await fetch(`${API_URL}/auth/login`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ username, password }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Login failed');
      // }
      
      // const data = await response.json();
      // const { token, user } = data;
      
      // For demo purposes, we'll use a mock response
      // Remove this and uncomment the above code when connecting to your actual backend
      const mockLoginSuccess = username === "transport_director" && password === "password123";
      
      if (!mockLoginSuccess) {
        throw new Error("Invalid credentials");
      }
      
      // Mock token and user data
      const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxIiwidXNlcm5hbWUiOiJ0cmFuc3BvcnRfZGlyZWN0b3IiLCJmdWxsTmFtZSI6IlRyYW5zcG9ydCBEaXJlY3RvciIsInJvbGUiOiJ0cmFuc3BvcnRfZGlyZWN0b3IiLCJlbWFpbCI6InRyYW5zcG9ydC5kaXJlY3RvckBhYXUuZWR1LmV0IiwiZXhwIjoxNjc0ODk5MjAwfQ.mock_signature";
      const mockUser = {
        id: "1",
        username: "transport_director",
        fullName: "Transport Director",
        role: "transport_director" as UserRole,
        email: "transport.director@aau.edu.et",
        college: "Science",
        institute: "Technology",
        campus: "Main Campus"
      };
      
      setUser(mockUser);
      setToken(mockToken);
      
      // Store the token in localStorage
      localStorage.setItem("auth_token", mockToken);
      
      toast.success(`Welcome back, ${mockUser.fullName}!`);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please check your credentials.");
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    navigate("/login", { state: { loggedOut: true } });
  };

  // Check if user has a specific permission
  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    return ROLE_PERMISSIONS[user.role].includes(permission);
  };

  return (
    <JWTAuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!user,
        hasPermission
      }}
    >
      {children}
    </JWTAuthContext.Provider>
  );
};

export const useJWTAuth = (): AuthContextType => {
  const context = useContext(JWTAuthContext);
  if (context === undefined) {
    throw new Error("useJWTAuth must be used within a JWTAuthProvider");
  }
  return context;
};

// Export additional mock data for UI components
export const MOCK_COLLEGES = [
  { id: "1", name: "College of Natural and Social Sciences" },
  { id: "2", name: "College of Business and Economics" },
  { id: "3", name: "College of Health Sciences" },
  { id: "4", name: "College of Law and Governance" },
  { id: "5", name: "College of Education and Behavioral Studies" }
];

export const MOCK_INSTITUTES = [
  { id: "1", name: "Institute of Technology", collegeId: "1" },
  { id: "2", name: "Institute of Biotechnology", collegeId: "1" },
  { id: "3", name: "Institute of Management", collegeId: "2" },
  { id: "4", name: "Institute of Medicine", collegeId: "3" },
  { id: "5", name: "Institute of Legal Studies", collegeId: "4" },
  { id: "6", name: "Institute of Educational Research", collegeId: "5" }
];

export const MOCK_CAMPUSES = [
  { id: "1", name: "Main Campus", instituteId: "1" },
  { id: "2", name: "5 Kilo Campus", instituteId: "1" },
  { id: "3", name: "Lideta Campus", instituteId: "2" },
  { id: "4", name: "Commerce Campus", instituteId: "3" },
  { id: "5", name: "Black Lion Campus", instituteId: "4" },
  { id: "6", name: "Amist Kilo Campus", instituteId: "5" },
  { id: "7", name: "Sidist Kilo Campus", instituteId: "6" }
];

export const AVAILABLE_ROLES: UserRole[] = [
  "transport_director", 
  "operational_director", 
  "fotl", 
  "ftl", 
  "mtl", 
  "regular_staff"
];
