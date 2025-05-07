
// HTTP Client utility that automatically includes the JWT token in requests

// Get the API base URL from environment or use a default for development
const API_BASE_URL = "https://your-api-url.com";

/**
 * HTTP client that automatically includes the auth token in requests
 */
export const httpClient = {
  /**
   * Make a GET request
   * @param endpoint - The API endpoint to call (without the base URL)
   * @param options - Additional fetch options
   * @returns Promise with the response data
   */
  async get<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return await request<T>("GET", endpoint, null, options);
  },

  /**
   * Make a POST request
   * @param endpoint - The API endpoint to call (without the base URL)
   * @param data - The request body data
   * @param options - Additional fetch options
   * @returns Promise with the response data
   */
  async post<T = any>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    return await request<T>("POST", endpoint, data, options);
  },

  /**
   * Make a PUT request
   * @param endpoint - The API endpoint to call (without the base URL)
   * @param data - The request body data
   * @param options - Additional fetch options
   * @returns Promise with the response data
   */
  async put<T = any>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    return await request<T>("PUT", endpoint, data, options);
  },

  /**
   * Make a PATCH request
   * @param endpoint - The API endpoint to call (without the base URL)
   * @param data - The request body data
   * @param options - Additional fetch options
   * @returns Promise with the response data
   */
  async patch<T = any>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> {
    return await request<T>("PATCH", endpoint, data, options);
  },

  /**
   * Make a DELETE request
   * @param endpoint - The API endpoint to call (without the base URL)
   * @param options - Additional fetch options
   * @returns Promise with the response data
   */
  async delete<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return await request<T>("DELETE", endpoint, null, options);
  }
};

/**
 * Make an HTTP request with the JWT token included
 */
async function request<T>(
  method: string,
  endpoint: string,
  data: any = null,
  options: RequestInit = {}
): Promise<T> {
  // Get token from localStorage
  const token = localStorage.getItem("auth_token");
  
  // Build complete URL
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Prepare headers
  const headers = new Headers(options.headers || {});
  
  // Add content type if sending data
  if (data && !headers.has("Content-Type")) {
    headers.append("Content-Type", "application/json");
  }
  
  // Add authorization header if token exists
  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }
  
  // Prepare request options
  const requestOptions: RequestInit = {
    ...options,
    method,
    headers,
    body: data ? JSON.stringify(data) : null,
  };
  
  try {
    // Make the request
    const response = await fetch(url, requestOptions);
    
    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    
    // Parse response based on content type
    const responseData = isJson ? await response.json() : await response.text();
    
    // Handle error responses
    if (!response.ok) {
      const error = new Error(
        isJson && responseData.message ? responseData.message : "An error occurred"
      );
      throw Object.assign(error, {
        status: response.status,
        data: responseData
      });
    }
    
    return responseData as T;
  } catch (error) {
    // Rethrow the error for the caller to handle
    throw error;
  }
}
