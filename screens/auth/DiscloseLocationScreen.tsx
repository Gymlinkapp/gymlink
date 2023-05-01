import { Text, View, Linking, Platform } from 'react-native';
import AuthLayout from '../../layouts/AuthLayout';
import Button from '../../components/button';
import { useEffect } from 'react';
import useLocation from '../../hooks/useLocation';
import * as Location from 'expo-location';
import { useAuth } from '../../utils/context';
import { Barbell, CheckCircle, UsersFour } from 'phosphor-react-native';

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
    if (permissionStatus === 'denied') {
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
      description='We will use your location to make your experience better and provide a tailored experience.'
    >
      <View>
        <View className='flex-row items-center mb-5'>
          <Barbell size={50} color='#fff' weight='fill' />
          <Text className='text-secondaryWhite font-MontserratRegular text-lg ml-2'>
            Find nearby gyms
          </Text>
        </View>
        <View className='flex-row items-center mb-5'>
          <UsersFour size={50} color='#fff' weight='fill' />
          <Text className='text-secondaryWhite font-MontserratRegular text-lg ml-2'>
            Find nearby gym buddies
          </Text>
        </View>
      </View>
      <View className='justify-end h-full'>
        {permissionStatus === 'granted' ||
          (permissionStatus === 'undetermined' && (
            <View className='flex-[0.45]'>
              <Button
                variant='primary'
                onPress={() => {
                  if (permissionStatus === 'granted' && long && lat) {
                    navigation.navigate('UserGymLocation');
                  } else {
                    promptForPermission();
                  }
                }}
              >
                Allow Location
              </Button>
            </View>
          ))}
        {permissionStatus === 'denied' && (
          <View className='flex-[0.65]'>
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
            <Button
              variant='ghost'
              className='mb-10 my-5'
              onPress={openSettings}
            >
              Go to Settings
            </Button>
          </View>
        )}
      </View>
    </AuthLayout>
  );
}
