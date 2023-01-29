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
import { Barbell, X } from 'phosphor-react-native';
import { useMutation } from 'react-query';
import api from '../utils/axiosStore';
import Split from '../components/Split';
import { WeekSplit } from '../utils/split';

// This is a user's profile screen displayed when 'Show More' is pressed.
export default function ProfileScreen({
  navigation,
  route,
}: {
  navigation?: any;
  route?: any;
}) {
  const { user, isFriend } = route.params;
  const { user: currUser } = useAuth();
  const { height } = Dimensions.get('window');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userSplit, setUserSplit] = useState<WeekSplit[]>([]);

  const useSendFriendRequest = useMutation(
    async ({
      fromUserId,
      toUserId,
    }: {
      toUserId: string;
      fromUserId: string;
    }) => {
      const { data } = await api.post(`/social/sendFriendRequest`, {
        toUserId,
        fromUserId,
      });
      return data;
    },
    {
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentImageIndex < user.images.length - 1) {
        setCurrentImageIndex(currentImageIndex + 1);
      } else {
        setCurrentImageIndex(0);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentImageIndex]);
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
    <View className='w-full h-full'>
      {!isFriend && (
        <View className='absolute bottom-12 w-full items-center z-50'>
          <View className='rounded-full bg-primaryDark w-4/5 h-full flex-row p-4 items-center justify-between'>
            <TouchableOpacity className='bg-secondaryDark  justify-center items-center w-16 h-16 rounded-full'>
              <X color='rgb(204, 201, 201)' />
            </TouchableOpacity>
            <TouchableOpacity
              className='bg-white justify-center items-center w-16 h-16 rounded-full'
              onPress={() => {
                useSendFriendRequest.mutate({
                  fromUserId: currUser.id,
                  toUserId: user.id,
                });
                // user can send a friend request through the profile page.
                // the user id is being stored and passed to the parent home screen where in the <Person/> component, can determine the UI state of the animation, etc.
                navigation.navigate('Home', { userId: user.id });
              }}
            >
              <Barbell weight='fill' />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <ScrollView
        className='px-6 flex-1 relative'
        scrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          height: height,
          paddingBottom: 500,
          paddingTop: 25,
        }}
      >
        <View className='w-full h-2/3 overflow-hidden mb-6' key={user.id}>
          {user?.images && (
            <Image
              source={{ uri: user?.images[currentImageIndex] }}
              className='w-full h-full rounded-2xl'
            />
          )}
          <View className='absolute bottom-[2.5] left-0 w-full flex-row justify-center items-center z-10'>
            <View className='flex-row px-4'>
              {user.images.map((image, index) => (
                <View
                  key={image}
                  className={`flex-1 h-1 rounded-full ${
                    index === currentImageIndex
                      ? 'bg-primaryWhite'
                      : 'bg-white/40'
                  } mx-1`}
                />
              ))}
            </View>
          </View>
        </View>
        <View className='flex-row items-center gap-4'>
          <Text className='text-white text-3xl font-MontserratBold'>
            {user.firstName} {user.lastName}
          </Text>
          <Text className='text-white text-xl font-MontserratMedium'>
            {user.age}
          </Text>
        </View>
        <View>
          <Text className='text-secondaryWhite text-md font-MontserratMedium'>
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
                    className='mr-2 my-1 bg-primaryDark px-6 py-2 rounded-full'
                  >
                    <Text className='text-white text-md font-MontserratMedium'>
                      {tag}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        </View>
        <Split split={userSplit} />
      </ScrollView>
    </View>
  );
}
