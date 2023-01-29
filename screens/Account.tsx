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
import Split from '../components/Split';
import { useUser } from '../hooks/useUser';
import { COLORS } from '../utils/colors';
import { useAuth } from '../utils/context';
import { WeekSplit } from '../utils/split';
import FriendsScreen from './Friends';

// This is the user's account screen.
export default function AccountScreen({ navigation, route }) {
  const { height } = Dimensions.get('window');
  const { token, user } = useAuth();
  const [userSplit, setUserSplit] = useState<WeekSplit[]>([]);
  const [activeTab, setActiveTab] = useState('Account');

  useEffect(() => {
    if (user.split) {
      const userSplit = Object.keys(user.split).map((day) => {
        // dont include 'id' as a day in the key
        if (day === 'id') return;
        return {
          day,
          exercises: user.split[day],
        };
      }) as WeekSplit[];
      setUserSplit(userSplit);
    }
  }, [user]);

  return (
    <>
      <View className='flex flex-row px-12 w-full justify-evenly py-6'>
        <TouchableOpacity
          onPress={() => setActiveTab('Account')}
          className={`${
            activeTab === 'Account' && 'border-b-2 border-secondaryWhite'
          }`}
        >
          <Text
            className={`${
              activeTab === 'Account'
                ? 'text-primaryWhite'
                : 'text-secondaryWhite'
            } font-MontserratRegular`}
          >
            Account
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`${
            activeTab === 'Friends' && 'border-b-2 border-secondaryWhite'
          }`}
          onPress={() => setActiveTab('Friends')}
        >
          <Text
            className={`text-white font-MontserratRegular ${
              activeTab === 'Friends'
                ? 'text-primaryWhite'
                : 'text-secondaryWhite'
            }`}
          >
            Friends
          </Text>
        </TouchableOpacity>
      </View>
      {activeTab === 'Account' ? (
        <ScrollView
          className='px-6 flex-1'
          scrollEnabled
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ height: height * 1.5, paddingBottom: 500 }}
        >
          <View className='w-full h-[300px] overflow-hidden mb-6' key={user.id}>
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
          </View>
          <View>
            <Split split={userSplit} navigation={navigation} />
          </View>
        </ScrollView>
      ) : (
        <FriendsScreen navigation={navigation} />
      )}
    </>
  );
}
