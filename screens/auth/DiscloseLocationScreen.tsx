import { View } from 'react-native';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/button';
import { useEffect } from 'react';
import useLocation from '../../hooks/useLocation';
import * as Location from 'expo-location';
import { useAuth } from '../../utils/context';

export default function DiscloseLocationScreen({
  navigation,
}: {
  navigation: any;
}) {
  const { setLat, setLong, lat, long } = useAuth();
  const { promptForPermission, permissionStatus } = useLocation();
  useEffect(() => {
    if (permissionStatus === 'granted' && long && lat) {
      navigation.navigate('UserGymLocation');
    }
    if (permissionStatus === 'denied' || permissionStatus === 'undetermined') {
      promptForPermission();
    }

    if (permissionStatus === 'granted') {
      (async () => {
        const { coords } = await Location.getCurrentPositionAsync();

        const { latitude, longitude } = coords;
        setLat(latitude);
        setLong(longitude);
      })();
    }
  }, [permissionStatus, long, lat]);
  return (
    <AuthLayout
      title='Allow your location'
      description='We will use your location to make your experience better and provide a closer and richer connection with nearby users.'
    >
      <View className='justify-end h-full'>
        <Button
          variant='primary'
          onPress={() => {
            if (permissionStatus === 'granted' && long && lat) {
              navigation.navigate('UserGymLocation');
            }
          }}
        >
          Allow Location
        </Button>
        <Button variant='ghost' className='mb-10 my-5'>
          Go to Settings
        </Button>
      </View>
    </AuthLayout>
  );
}
