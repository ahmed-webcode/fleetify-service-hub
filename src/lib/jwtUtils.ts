
export interface Role {
  id: number;
  name: string;
}

export interface JwtPayload {
  sub: string;
  // No longer has roles in the JWT payload
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

// Get role ID from role name
export function getRoleIdByName(roleName: string): number {
  for (const [id, details] of Object.entries(ROLE_DETAILS)) {
    if (details.name === roleName) {
      return parseInt(id, 10);
    }
  }
  return 0; // Default if not found
}

// Map role names to Role objects
export function mapRoleNamesToRoles(roleNames: string[]): Role[] {
  return roleNames.map(name => {
    const id = getRoleIdByName(name);
    return { id, name };
  });
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

// Permission type definition
export type Permission = 
  | 'add_users'
  | 'manage_drivers' 
  | 'request_fleet'
  | 'approve_fleet'  // Added this permission
  | 'approve_maintenance'
  | 'request_maintenance'
  | 'report_incidents'
  | 'track_vehicles'
  | 'view_reports'
  | 'view_admin_section'
  | 'manage_users_section'
  | 'add_vehicle';    // Added this permission

// Map roles to permissions
export const ROLE_PERMISSIONS: Record<number, Permission[]> = {
  1: ['add_users', 'manage_drivers', 'approve_fleet', 'approve_maintenance', 'request_maintenance', 'report_incidents', 'track_vehicles', 'view_reports', 'add_vehicle', 'view_admin_section', 'manage_users_section'], // Transport Director
  2: ['approve_maintenance', 'request_maintenance', 'report_incidents', 'view_reports'], // Maintenance Manager
  3: ['manage_drivers', 'request_fleet', 'approve_fleet', 'report_incidents', 'track_vehicles'], // Deployment Manager
  4: ['request_maintenance', 'report_incidents', 'view_reports'], // Fuel Manager
  5: ['add_users', 'manage_drivers', 'request_fleet', 'approve_fleet', 'approve_maintenance', 'request_maintenance', 'report_incidents', 'track_vehicles', 'view_reports', 'add_vehicle'], // Operational Director
  6: ['request_maintenance', 'report_incidents'], // Fuel Attendant
  7: ['request_maintenance', 'report_incidents'], // Driver
  8: ['request_fleet'], // Staff
  9: ['request_maintenance', 'report_incidents'], // Mechanic
};
