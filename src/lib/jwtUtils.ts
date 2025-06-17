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

/**
 * Permission mapping (backend | FE usage):
 * - VIEW_USER                => 'view_user'
 * - MANAGE_USER              => 'manage_user'
 * - MANAGE_POSITION          => 'manage_position'
 * - MANAGE_PROJECT           => 'manage_project'
 * - MANAGE_VEHICLE           => 'manage_vehicle'
 * - VIEW_VEHICLE             => 'view_vehicle'
 * - VIEW_VEHICLE_LIBRE       => 'view_vehicle_libre'
 * - VIEW_TRIP_REQUEST        => 'view_trip_request'
 * - MANAGE_TRIP_REQUEST      => 'manage_trip_request'
 * - REQUEST_TRIP             => 'request_trip'
 * - VIEW_FUEL_REQUEST        => 'view_fuel_request'
 * - MANAGE_FUEL_REQUEST      => 'manage_fuel_request'
 * - REQUEST_FUEL             => 'request_fuel'
 * - VIEW_MAINTENANCE_REQUEST => 'view_maintenance_request'
 * - MANAGE_MAINTENANCE_REQUEST => 'manage_maintenance_request'
 * - REQUEST_MAINTENANCE      => 'request_maintenance'
 * - VIEW_FUEL                => 'view_fuel'
 * - MANAGE_FUEL              => 'manage_fuel'
 * - ISSUE_FUEL               => 'issue_fuel'
 * - VIEW_ITEM                => 'view_item'
 * - MANAGE_ITEM              => 'manage_item'
 * - VIEW_INSURANCE           => 'view_insurance'
 * - MANAGE_INSURANCE         => 'manage_insurance'
 * - VIEW_INCIDENT            => 'view_incident'
 * - MANAGE_INCIDENT          => 'manage_incident'
 * - REPORT_INCIDENT          => 'report_incident'
 * - VIEW_MAINTENANCE         => 'view_maintenance'
 * - MANAGE_MAINTENANCE       => 'manage_maintenance'
 * - VIEW_TRIP                => 'view_trip'
 * - MANAGE_TRIP              => 'manage_trip'
 */

// Permission type definition
export type Permission =
  | 'view_user'
  | 'manage_user'
  | 'manage_position'
  | 'manage_project'
  | 'manage_vehicle'
  | 'view_vehicle'
  | 'view_vehicle_libre'
  | 'view_trip_request'
  | 'manage_trip_request'
  | 'request_trip'
  | 'view_fuel_request'
  | 'manage_fuel_request'
  | 'request_fuel'
  | 'view_maintenance_request'
  | 'manage_maintenance_request'
  | 'request_maintenance'
  | 'view_fuel'
  | 'manage_fuel'
  | 'issue_fuel'
  | 'view_item'
  | 'manage_item'
  | 'view_insurance'
  | 'manage_insurance'
  | 'view_incident'
  | 'manage_incident'
  | 'report_incident'
  | 'view_maintenance'
  | 'manage_maintenance'
  | 'view_trip'
  | 'manage_trip';

// Update ROLE_PERMISSIONS to match backend mapping
export const ROLE_PERMISSIONS: Record<number, Permission[]> = {
  1: [
    'view_user','manage_user','manage_position','manage_project','manage_vehicle','view_vehicle','view_vehicle_libre',
    'view_trip_request','manage_trip_request','view_fuel_request','manage_fuel_request',
    'view_maintenance_request','manage_maintenance_request','view_fuel','manage_fuel','view_item','manage_item',
    'view_insurance','manage_insurance','view_incident','manage_incident','report_incident',
    'view_maintenance','manage_maintenance','view_trip','manage_trip', 'issue_fuel', 'request_trip', 'request_fuel'
  ], // Transport Director
  2: [
    'view_user','view_vehicle','view_trip_request','manage_trip_request','view_trip','manage_trip'
  ], // Deployment Manager
  3: [
    'view_user','view_vehicle','view_fuel_request','manage_fuel_request','view_fuel','manage_fuel','issue_fuel'
  ], // Fuel Manager
  4: [
    'view_user','view_vehicle','view_vehicle_libre','view_insurance','manage_insurance','view_incident','manage_incident','report_incident','view_maintenance'
  ], // Insurance Manager
  5: [
    'view_user','view_vehicle','view_maintenance_request','manage_maintenance_request','view_fuel','view_item','view_insurance','view_incident','view_maintenance','manage_maintenance'
  ], // Maintenance Manager
  6: [
    'view_user','view_item','manage_item'
  ], // Store Manager
  7: [
    'view_user','view_vehicle','request_trip','request_fuel','view_fuel', 'view_trip', 'view_trip_request', 'manage_trip'
  ], // Operational Director
  8: [
    'view_user','view_vehicle','view_fuel','issue_fuel'
  ], // Fuel Attendant
  9: [
    'view_user','view_vehicle','request_fuel','request_maintenance','report_incident'
  ], // Staff
  // Add Driver, Mechanic, etc, if needed
};

export const ROLE_DETAILS: Record<number, { name: string, description: string }> = {
  1: { name: 'Transport Director', description: 'Manages the transport department' },
  2: { name: 'Deployment Manager', description: 'Responsible for deploying the vehicle for trip' },
  3: { name: 'Fuel Manager', description: 'Responsible for managing the fuel' },
  4: { name: 'Insurance Manager', description: 'Responsible for managing the insurance and legal issues' },
  5: { name: 'Maintenance Manager', description: 'Manages the maintenance department' },
  6: { name: 'Store Manager', description: 'Responsible for managing the store and inventory' },
  7: { name: 'Operational Director', description: 'Reside in each campus and manage the transport department in the campus' },
  8: { name: 'Fuel Attendant', description: 'Responsible for issuing fuel' },
  9: { name: 'Staff', description: 'General staff of the university' },
  10: { name: 'Driver', description: 'Responsible for driving the vehicle' },
  11: { name: 'Mechanic', description: 'Responsible for maintaining the vehicle' },
};
