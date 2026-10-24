import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as Location from 'expo-location';
import { Coordinates } from '../types';
import { DEFAULT_USER_COORDINATES, DEMO_LOCATIONS } from '../data/mockEvents';

interface LocationContextType {
  userCoordinates: Coordinates;
  locationName: string;
  permissionStatus: 'granted' | 'denied' | 'fallback' | 'checking';
  isUsingFallback: boolean;
  setDemoLocation: (locationId: string) => void;
  refreshLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userCoordinates, setUserCoordinates] = useState<Coordinates>(DEFAULT_USER_COORDINATES);
  const [locationName, setLocationName] = useState<string>('Downtown Tech & Arts District');
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'fallback' | 'checking'>('checking');
  const [isUsingFallback, setIsUsingFallback] = useState<boolean>(true);

  const requestAndFetchLocation = useCallback(async () => {
    setPermissionStatus('checking');
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setPermissionStatus('denied');
        setIsUsingFallback(true);
        setUserCoordinates(DEFAULT_USER_COORDINATES);
        setLocationName('Indiranagar Tech District (Demo)');
        return;
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setUserCoordinates(coords);
      setPermissionStatus('granted');
      setIsUsingFallback(false);

      // Try reverse geocoding to get neighborhood / city
      try {
        const reverse = await Location.reverseGeocodeAsync(coords);
        if (reverse && reverse.length > 0) {
          const place = reverse[0];
          const name =
            place.district ||
            place.subregion ||
            place.city ||
            place.street ||
            'Local Neighborhood';
          setLocationName(name);
        }
      } catch {
        setLocationName('Current Location');
      }
    } catch {
      // Fallback on simulator / missing GPS
      setPermissionStatus('fallback');
      setIsUsingFallback(true);
      setUserCoordinates(DEFAULT_USER_COORDINATES);
      setLocationName('Indiranagar Tech District (Demo)');
    }
  }, []);

  useEffect(() => {
    requestAndFetchLocation();
  }, [requestAndFetchLocation]);

  const setDemoLocation = (locationId: string) => {
    const loc = DEMO_LOCATIONS.find((l) => l.id === locationId);
    if (loc) {
      setUserCoordinates(loc.coordinates);
      setLocationName(`${loc.name} (Demo)`);
      setIsUsingFallback(true);
      setPermissionStatus('fallback');
    }
  };

  return (
    <LocationContext.Provider
      value={{
        userCoordinates,
        locationName,
        permissionStatus,
        isUsingFallback,
        setDemoLocation,
        refreshLocation: requestAndFetchLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
