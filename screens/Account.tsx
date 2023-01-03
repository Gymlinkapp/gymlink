import { getItemAsync } from 'expo-secure-store';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Loading from '../components/Loading';
import { useUser } from '../hooks/useUser';
import { COLORS } from '../utils/colors';
import { useAuth } from '../utils/context';

export default function AccountScreen({ navigation }) {
  const { height } = Dimensions.get('window');
  const { token, user } = useAuth();

  return (
    <ScrollView
      className='px-6 flex-1'
      scrollEnabled
      contentContainerStyle={{ height: height, paddingBottom: 500 }}
    >
      <View className='w-full h-2/3 overflow-hidden mb-6' key={token}>
        {user?.images && (
          <Image
            source={{ uri: user?.images[0] }}
            className='w-full h-full rounded-2xl'
          />
        )}
      </View>
      <Text className='text-white text-2xl font-MontserratBold'>
        {user.firstName} {user.lastName}
      </Text>
      <View>
        <Text className='text-white text-xl font-MontserratMedium'>
          {user.age}
        </Text>
        <Text className='text-white text-xl font-MontserratMedium'>
          {user.bio}
        </Text>
        <View>
          <Text className='text-lg font-MontserratBold text-white pt-12 pb-4'>
            Favorite Movements
          </Text>
          <View className='flex-row flex-wrap'>
            {user.tags &&
              user.tags.map((tag, idx) => (
                <View
                  key={idx}
                  className='mr-2 my-1 bg-secondaryDark px-6 py-2 rounded-full'
                >
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
