
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Vehicle location data type
export interface VehicleLocation {
  id: string;
  name: string;
  licensePlate: string;
  latitude: number;
  longitude: number;
  status: 'active' | 'maintenance' | 'unavailable' | 'parked';
  speed: string;
  lastUpdated: string;
  driver: string;
}

interface MapViewProps {
  selectedVehicle: string | null;
  vehicles: VehicleLocation[];
}

const MapView = ({ selectedVehicle, vehicles }: MapViewProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<{ [key: string]: mapboxgl.Marker }>({});
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('mapbox_token') || '';
  });
  const [isConfigOpen, setIsConfigOpen] = useState<boolean>(false);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  // Save API key to localStorage
  const saveApiKey = () => {
    if (apiKey) {
      localStorage.setItem('mapbox_token', apiKey);
      setIsConfigOpen(false);
      initializeMap();
    }
  };

  // Initialize map when API key is available
  const initializeMap = () => {
    if (!mapContainer.current || !apiKey) return;

    try {
      mapboxgl.accessToken = apiKey;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [38.7578, 9.0222], // Default to Addis Ababa
        zoom: 12,
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl(),
        'top-right'
      );

      map.current.on('load', () => {
        setIsMapReady(true);
      });

      // Cleanup function for markers on map change
      return () => {
        Object.values(markers.current).forEach(marker => marker.remove());
        markers.current = {};
      };
    } catch (error) {
      console.error('Error initializing Mapbox:', error);
      setApiKey('');
      localStorage.removeItem('mapbox_token');
    }
  };

  // Initialize map on component mount
  useEffect(() => {
    if (apiKey) {
      initializeMap();
    }

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  // Update markers when vehicles or selected vehicle changes
  useEffect(() => {
    if (!map.current || !isMapReady) return;

    // Remove existing markers
    Object.values(markers.current).forEach(marker => marker.remove());
    markers.current = {};

    // Add markers for each vehicle
    vehicles.forEach(vehicle => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'vehicle-marker';
      el.innerHTML = `
        <div class="${
          vehicle.status === 'active' ? 'bg-green-500' : 
          vehicle.status === 'parked' ? 'bg-blue-500' : 
          vehicle.status === 'maintenance' ? 'bg-amber-500' : 'bg-red-500'
        } w-4 h-4 rounded-full border-2 border-white shadow-md"></div>
      `;
      
      if (selectedVehicle === vehicle.id) {
        el.classList.add('selected');
        el.innerHTML += `<div class="ping-effect"></div>`;
      }

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div class="p-2">
          <h3 class="font-medium">${vehicle.name}</h3>
          <p class="text-xs text-gray-600">${vehicle.licensePlate}</p>
          <div class="mt-2 text-xs">
            <p><strong>Driver:</strong> ${vehicle.driver}</p>
            <p><strong>Speed:</strong> ${vehicle.speed}</p>
            <p><strong>Last Updated:</strong> ${vehicle.lastUpdated}</p>
          </div>
        </div>
      `);

      // Create and store marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([vehicle.longitude, vehicle.latitude])
        .setPopup(popup)
        .addTo(map.current!);
      
      markers.current[vehicle.id] = marker;
      
      // Open popup for selected vehicle
      if (selectedVehicle === vehicle.id) {
        marker.togglePopup();
        
        // Fly to selected vehicle
        map.current.flyTo({
          center: [vehicle.longitude, vehicle.latitude],
          zoom: 14,
          essential: true
        });
      }
    });
  }, [vehicles, selectedVehicle, isMapReady]);

  if (!apiKey) {
    return (
      <div className="bg-card rounded-xl border border-border flex items-center justify-center h-[600px] relative">
        <div className="bg-card p-8 rounded-lg flex flex-col items-center justify-center max-w-md text-center space-y-4">
          <MapPin className="h-12 w-12 text-muted-foreground" />
          <h3 className="text-xl font-medium">Mapbox API Key Required</h3>
          <p className="text-muted-foreground">
            Please enter your Mapbox API key to enable real-time GPS tracking.
          </p>
          <div className="w-full space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key">Mapbox API Key</Label>
              <Input 
                id="api-key" 
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                placeholder="Enter your Mapbox public token"
              />
              <p className="text-xs text-muted-foreground">
                You can get your API key from the <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="underline">Mapbox website</a>
              </p>
            </div>
            <Button onClick={saveApiKey} className="w-full">Save and Initialize Map</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-xl overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      
      <div className="absolute top-4 right-4 z-10">
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="bg-background/80 backdrop-blur-sm">
              <Settings className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Map Configuration</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mapbox-key">Mapbox API Key</Label>
                <Input 
                  id="mapbox-key" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                />
              </div>
              <Button onClick={saveApiKey}>Save Changes</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <style jsx global>{`
        .vehicle-marker {
          position: relative;
          cursor: pointer;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .vehicle-marker.selected {
          z-index: 10;
        }
        
        .ping-effect {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: rgba(59, 130, 246, 0.5);
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default MapView;
