import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { useAuth } from '../utils/context';

export default function useLocation() {
  const [permissionStatus, setPermissionStatus] = useState(null);
  const { long, lat } = useAuth();

  const requestPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setPermissionStatus(status);
  };

  const promptForPermission = async () => {
    if (permissionStatus !== 'granted') {
      await requestPermission();
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      setPermissionStatus(status);
    })();
  }, []);

  return {
    permissionStatus,
    promptForPermission,
    long,
    lat,
  };
}
