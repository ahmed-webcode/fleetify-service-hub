
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
    }
  ];
};
