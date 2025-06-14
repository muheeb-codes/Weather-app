import { useState, useEffect } from 'react';
import { Coordinates } from '../types/weather';

interface UseGeolocationReturn {
  coordinates: Coordinates | null;
  loading: boolean;
  error: string | null;
  getLocation: () => void;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoordinates({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLoading(false);
      },
      (error) => {
        setError(
          error.code === 1
            ? 'Permission denied. Please allow location access.'
            : 'Unable to retrieve your location'
        );
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  };

  return { coordinates, loading, error, getLocation };
};