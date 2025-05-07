
/**
 * API client for making authenticated requests to your custom backend.
 * This handles JWT token management and provides generic API methods.
 */

// Get API base URL
const API_BASE_URL = "https://your-backend-api.com";

/**
 * Generic API client with JWT auth handling
 */
export const apiClient = {
  /**
   * Get the JWT token from localStorage
   */
  getToken(): string | null {
    return localStorage.getItem("auth_token");
  },
  
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    try {
      // Simple JWT expiry check
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch (e) {
      return false;
    }
  },
  
  /**
   * Login with username and password
   */
  async login(username: string, password: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
      
      const data = await response.json();
      
      // Store token in localStorage
      localStorage.setItem("auth_token", data.token);
      
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    // Remove token from localStorage
    localStorage.removeItem("auth_token");
    
    // You might want to call a logout endpoint on your API
    // await fetch(`${API_BASE_URL}/auth/logout`, {
    //   method: "POST",
    //   headers: {
    //     "Authorization": `Bearer ${this.getToken()}`
    //   }
    // });
  },
  
  /**
   * Make a GET request
   */
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>("GET", endpoint);
  },
  
  /**
   * Make a POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>("POST", endpoint, data);
  },
  
  /**
   * Make a PUT request
   */
  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>("PUT", endpoint, data);
  },
  
  /**
   * Make a DELETE request
   */
  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>("DELETE", endpoint);
  },
  
  /**
   * Make a request with JWT authentication
   */
  async request<T>(method: string, endpoint: string, data?: any): Promise<T> {
    const token = this.getToken();
    
    const headers: HeadersInit = {
      "Content-Type": "application/json"
    };
    
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    
    const config: RequestInit = {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    };
    
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("auth_token");
          window.location.href = "/login";
          throw new Error("Session expired. Please login again.");
        }
        
        const error = await response.json();
        throw new Error(error.message || `API request failed with status ${response.status}`);
      }
      
      const responseData = await response.json();
      return responseData as T;
    } catch (error) {
      console.error(`API ${method} ${endpoint} error:`, error);
      throw error;
    }
  }
};
