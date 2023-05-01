import { Text, View, Linking, Platform } from 'react-native';
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

  const openSettings = async () => {
    const settingsURL =
      Platform.OS === 'ios' ? 'app-settings:' : 'app-settings:';
    const canOpen = await Linking.canOpenURL(settingsURL);

    if (canOpen) {
      Linking.openURL(settingsURL);
    } else {
      console.error('Failed to open app settings');
    }
  };
  return (
    <AuthLayout
      title='Allow your location'
      description='We will use your location to make your experience better and provide a tailored experience and allow Gymlink to display nearby gyms and potential like-minded gym goers on your feed.'
    >
      <View className='justify-end h-full'>
        {permissionStatus === 'granted' && (
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
        )}
        {permissionStatus === 'denied' && (
          <View>
            <Text className='text-secondaryWhite font-MontserratRegular text-xs mb-10'>
              You have denied location permission. Gymlink may have unexpected
              behaviour and bugs. If you change your mind, you can allow
              location permission in your settings.
            </Text>
            <Button
              variant='ghost'
              className='mb-10 my-5'
              onPress={() => {
                promptForPermission();
              }}
            >
              Retry
            </Button>
          </View>
        )}
        <Button variant='ghost' className='mb-10 my-5' onPress={openSettings}>
          Go to Settings
        </Button>
      </View>
    </AuthLayout>
  );
}
