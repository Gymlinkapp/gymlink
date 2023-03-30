import { getItemAsync } from 'expo-secure-store';
import { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Loading from '../components/Loading';
import { useUser } from '../hooks/useUser';
import { COLORS } from '../utils/colors';
import { useAuth } from '../utils/context';
import {
  Barbell,
  CaretLeft,
  MapPin,
  PaperPlaneRight,
  X,
} from 'phosphor-react-native';
import { useMutation } from 'react-query';
import api from '../utils/axiosStore';
import Split from '../components/Split';
import { WeekSplit } from '../utils/split';
import Button from '../components/button';
import { useGym } from '../hooks/useGym';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { keyboardVerticalOffset } from '../utils/ui';

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
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userSplit, setUserSplit] = useState<WeekSplit[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const { data: gym, isLoading: gymLoading } = useGym(user.gymId);

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
      if (currentImageIndex < user?.images.length - 1) {
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
    <View className='relative w-full h-full'>
      <View className='absolute top-0 left-0 w-full h-full'>
        <LinearGradient
          pointerEvents='none'
          colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
          className='absolute bottom-0 left-0 z-50 w-full h-full'
          locations={isTyping ? [0.1, 1] : [0, 0.5]}
          start={[0, 1]}
          end={[1, 0]}
        />
        <Image
          source={{ uri: user.images[0] }}
          className='w-full h-full object-cover'
        />
      </View>
      <View className='px-6 h-full justify-between'>
        <View className='py-2'>
          <TouchableOpacity
            className='flex-row items-center bg-primaryDark/25 justify-center rounded-full w-12 h-12 py-2 mt-10'
            onPress={() => navigation.goBack()}
          >
            <CaretLeft color='#fff' weight='regular' />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          className='flex-1'
          behavior='padding'
          keyboardVerticalOffset={keyboardVerticalOffset}
        >
          <SafeAreaView className='flex-1 h-full'>
            <KeyboardAvoidingView
              behavior='height'
              className='flex-1 justify-end'
            >
              <View>
                <Text className='text-white font-MontserratRegular text-2xl mb-6'>
                  {user.age}
                </Text>
                <View>
                  <Text className='text-white font-MontserratBold text-5xl'>
                    {user.firstName}
                  </Text>
                  <Text className='text-white font-MontserratBold text-5xl'>
                    {user.lastName}
                  </Text>
                </View>
                <View className='flex-row items-center mb-6'>
                  <MapPin color='#CCC9C9' weight='regular' size={18} />
                  <Text className='text-secondaryWhite font-MontserratRegular text-lg'>
                    {gym?.name}
                  </Text>
                </View>
              </View>
              <View className='flex-row items-center'>
                <View className='flex-1 overflow-hidden rounded-full mr-6'>
                  <BlurView intensity={15} className='bg-primaryWhite/10'>
                    <TextInput
                      className='p-2 px-4 rounded-full text-white'
                      placeholder='Shoot a message and link up'
                      onFocus={() => setIsTyping(true)}
                    />
                  </BlurView>
                </View>
                <PaperPlaneRight
                  color='#CCC9C9'
                  weight='regular'
                  size={18}
                  style={{
                    flex: 0.25,
                  }}
                />
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}
