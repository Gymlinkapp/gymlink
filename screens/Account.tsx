import { getItemAsync } from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
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
    <ScrollView className='px-6 flex-1'>
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
        <View>
          <Text className='text-lg font-MontserratBold text-white pt-12 pb-4'>
            Favorite Movements
          </Text>
          <View className='flex-row flex-wrap'>
            {user.tags &&
              user.tags.map((tag) => (
                <View className='mr-2 my-1 bg-secondaryDark px-6 py-2 rounded-full'>
                  <Text className='text-white text-md font-MontserratMedium'>
                    {tag}
                  </Text>
                </View>
              ))}
          </View>
        </View>
        <Text className='text-white'>{user.bio}</Text>
      </View>
    </ScrollView>
  );
}
