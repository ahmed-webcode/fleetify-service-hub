
export interface Role {
  id: number;
  name: string;
}

export interface JwtPayload {
  sub: string;
  roles: Role[];
  iat: number;
  exp: number;
}

// Decodes a JWT token to extract payload information
export function decodeJwt(token: string): JwtPayload | null {
  try {
    // JWT tokens are made up of three parts: header.payload.signature
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Base64Url decode the payload (second part)
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(
      decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
    );

    return payload as JwtPayload;
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

// Check if token is expired
export function isTokenExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload) return true;
  
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
}

// Get all roles from JWT token
export function getRolesFromToken(token: string): Role[] {
  const payload = decodeJwt(token);
  return payload?.roles || [];
}

// Map role IDs to role names and descriptions
export const ROLE_DETAILS: Record<number, { name: string, description: string }> = {
  1: { name: 'Transport Director', description: 'Manages the transport department' },
  2: { name: 'Maintenance Manager', description: 'Manages the maintenance department' },
  3: { name: 'Deployment Manager', description: 'Responsible for deploying the vehicle for trip' },
  4: { name: 'Fuel Manager', description: 'Responsible for managing the fuel' },
  5: { name: 'Operational Director', description: 'Reside in each campus and manage the transport department in the campus' },
  6: { name: 'Fuel Attendant', description: 'Responsible for issuing fuel' },
  7: { name: 'Driver', description: 'Responsible for driving the vehicle' },
  8: { name: 'Staff', description: 'General staff of the university' },
  9: { name: 'Mechanic', description: 'Responsible for maintaining the vehicle' },
};
