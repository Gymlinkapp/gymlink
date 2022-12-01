import { getItemAsync } from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../hooks/useUser';
import * as Progress from 'react-native-progress';
import { COLORS } from '../utils/colors';

export default function AccountScreen({ navigation }) {
  const [token, setToken] = useState(null);
  useEffect(() => {
    getItemAsync('token').then((t) => setToken(t));
  }, [token]);
  const { data: user, isLoading, error } = useUser(token);

  if (isLoading) {
    return (
      <View className='flex-1 h-full w-full justify-center items-center'>
        <Progress.Circle
          size={50}
          indeterminate={true}
          color={COLORS.accent}
          shouldRasterizeIOS
        />
      </View>
    );
  }

  return (
    <View className='px-6'>
      <View className='w-full h-2/3 overflow-hidden mb-6'>
        <Image
          source={{ uri: user.images[0] }}
          className='w-full h-full rounded-2xl'
        />
      </View>
      <Text className='text-white text-2xl font-MontserratBold'>
        {user.firstName} {user.lastName}
      </Text>
      <View>
        <Text className='text-white text-xl font-MontserratMedium'>
          {user.age}
        </Text>
      </View>
    </View>
  );
}
