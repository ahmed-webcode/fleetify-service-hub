
import { VehicleLocation } from '@/components/maps/MapView';

// Function to generate mock vehicle locations for Ethiopia
export const getVehicleLocations = (): VehicleLocation[] => {
  return [
    {
      id: 'vehicle1',
      name: 'Toyota Land Cruiser',
      licensePlate: 'AAU-3201',
      latitude: 9.0222,
      longitude: 38.7578, // Addis Ababa
      status: 'active',
      speed: '56 km/h',
      lastUpdated: '2 minutes ago',
      driver: 'Mohammed Ahmed'
    },
    {
      id: 'vehicle2',
      name: 'Nissan Patrol',
      licensePlate: 'AAU-1450',
      latitude: 9.0257,
      longitude: 38.7468, // Science Faculty
      status: 'parked',
      speed: '0 km/h',
      lastUpdated: '5 minutes ago',
      driver: 'Daniel Bekele'
    },
    {
      id: 'vehicle3',
      name: 'Toyota Hilux',
      licensePlate: 'AAU-8742',
      latitude: 9.0360,
      longitude: 38.7637, // Sidist Kilo
      status: 'active',
      speed: '32 km/h',
      lastUpdated: '1 minute ago',
      driver: 'Abebe Tadesse'
    },
    {
      id: 'vehicle4',
      name: 'Toyota Corolla',
      licensePlate: 'AAU-5214',
      latitude: 9.0307,
      longitude: 38.7600, // 6 Kilo
      status: 'unavailable',
      speed: '0 km/h',
      lastUpdated: '45 minutes ago',
      driver: 'Sara Haile'
    },
    {
      id: 'vehicle5',
      name: 'Hyundai H-1',
      licensePlate: 'AAU-6390',
      latitude: 9.0180,
      longitude: 38.7630, // Administration
      status: 'active',
      speed: '27 km/h',
      lastUpdated: '8 minutes ago',
      driver: 'Yonas Gebru'
    },
    {
      id: 'vehicle6',
      name: 'Isuzu Cargo Truck',
      licensePlate: 'AAU-7812',
      latitude: 9.0410,
      longitude: 38.7690, // North of Addis
      status: 'active',
      speed: '48 km/h',
      lastUpdated: '3 minutes ago',
      driver: 'Kidist Alemu'
    },
    {
      id: 'vehicle7',
      name: 'Mitsubishi Pickup',
      licensePlate: 'AAU-4521',
      latitude: 9.0150,
      longitude: 38.7510, // South of Addis
      status: 'maintenance',
      speed: '0 km/h',
      lastUpdated: '2 hours ago',
      driver: 'Henok Girma'
    },
    {
      id: 'vehicle8',
      name: 'Ford Ranger',
      licensePlate: 'AAU-9631',
      latitude: 9.0290,
      longitude: 38.7720, // East of Addis
      status: 'parked',
      speed: '0 km/h',
      lastUpdated: '30 minutes ago',
      driver: 'Tigist Hailu'
    }
  ];
};

// Function to simulate vehicle movement
export const simulateVehicleMovement = (vehicles: VehicleLocation[]): VehicleLocation[] => {
  return vehicles.map(vehicle => {
    if (vehicle.status === 'active') {
      // Generate small random movements for active vehicles
      const latChange = (Math.random() - 0.5) * 0.005;
      const lngChange = (Math.random() - 0.5) * 0.005;
      
      return {
        ...vehicle,
        latitude: vehicle.latitude + latChange,
        longitude: vehicle.longitude + lngChange,
        speed: `${Math.floor(30 + Math.random() * 40)} km/h`,
        lastUpdated: 'just now'
      };
    }
    return vehicle;
  });
};
