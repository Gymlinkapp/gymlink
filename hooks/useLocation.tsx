import { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import { getItemAsync, setItemAsync } from 'expo-secure-store';

export const useLocation = () => {
  const [location, setLocation] = useState<Location.LocationObject>(null);
  const [error, setError] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError(true);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, [Location]);

  if (error) {
    console.log('error: ', error);
    return null;
  } else if (location) {
    setItemAsync('long', location.coords.longitude.toString());
    setItemAsync('lat', location.coords.latitude.toString());
    setLocation(location);

    return location;
  }

  return null;
};
