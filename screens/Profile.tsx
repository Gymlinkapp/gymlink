import { useEffect, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  PanResponder,
  Keyboard,
  Pressable,
  Platform,
} from 'react-native';
import { useAuth } from '../utils/context';
import {
  CaretDown,
  CaretLeft,
  MapPin,
  PaperPlaneRight,
} from 'phosphor-react-native';
import { useMutation, useQueryClient } from 'react-query';
import api from '../utils/axiosStore';
import { WeekSplit } from '../utils/split';
import { useGym } from '../hooks/useGym';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { keyboardVerticalOffset } from '../utils/ui';
import * as Haptics from 'expo-haptics';
import { User } from '../utils/users';
import * as Progress from 'react-native-progress';
import { COLORS } from '../utils/colors';
import { DisplayGymName } from '../utils/displayGymName';
import Spinner from '../components/Spinner';

export function ProfileHeader({
  user,
  currentImageIndex,
  navigation,
}: {
  user: User;
  currentImageIndex: number;
  navigation;
}) {
  return (
    <View className='absolute ml-6 py-2 flex-row mt-10 w-[56%] items-center justify-between z-50'>
      <BlurView
        className='flex-row items-center justify-center rounded-full py-2 w-12 h-12 overflow-hidden bg-primaryDark/20'
        intensity={20}
      >
        <Pressable
          onPress={() => {
            navigation.goBack();
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
          style={({ pressed }) => ({
            // Add the style function for Pressable
            opacity: pressed ? 0.5 : 1, // Change opacity based on the pressed state
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
          })}
        >
          <View>
            <CaretLeft color='#fff' weight='regular' />
          </View>
        </Pressable>
      </BlurView>
      {/* indicator of images */}
      {user.images.length > 1 && (
        <BlurView
          className='flex-row justify-self-center items-center rounded-full overflow-hidden px-6 h-8 bg-primaryDark/20'
          intensity={20}
        >
          {user.images.map((_, index) => (
            <View
              key={index}
              className={`w-2 h-2 mx-1 rounded-full ${
                index === currentImageIndex ? 'bg-white' : 'bg-secondaryWhite'
              }`}
            ></View>
          ))}
        </BlurView>
      )}
    </View>
  );
}

// This is a user's profile screen displayed when 'Show More' is pressed.
export default function ProfileScreen({
  navigation,
  route,
}: {
  navigation?: any;
  route?: any;
}) {
  const { user } = route.params;
  const { user: currUser, socket, token } = useAuth();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userSplit, setUserSplit] = useState<WeekSplit[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [gestureState, setGestureState] = useState({ dx: 0, dy: 0 });
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();

  const { data: gym, isLoading: gymLoading } = useGym(user.gymId);

  const lowerKeyboard = () => {
    setIsTyping(false);
    Keyboard.dismiss();
  };

  const createLink = useMutation(
    async ({
      fromUserId,
      toUserId,
    }: {
      toUserId: string;
      fromUserId: string;
    }) => {
      const { data } = await api.post(`/social/link`, {
        toUserId,
        fromUserId,
        token,
      });
      return data;
    },
    {
      onSuccess: (data) => {
        navigation.navigate('Chat', {
          socket: socket,
          user: currUser,
          roomName: data.chat.name,
          toUser: data.chat.participants.toUser,
          userImage: data.chat.participants.toUser.images[0],
          uiName: data.chat.name,
          roomId: data.chat.id,
          message,
        });
        queryClient.invalidateQueries('user');
        queryClient.invalidateQueries('users');
      },
    }
  );

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => {
        return Math.abs(gesture.dx) > Math.abs(gesture.dy);
      },
      onPanResponderMove: (_, gesture) => {
        setGestureState(gesture);
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dx < -50) {
          navigation.navigate('ProfileInfo', {
            user,
            gymId: user.gymId,
          });
        }
        setGestureState({ dx: 0, dy: 0 });

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
    })
  ).current;

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
      <ProfileHeader
        user={user}
        currentImageIndex={currentImageIndex}
        navigation={navigation}
      />
      <View className='relative w-full h-full' {...panResponder.panHandlers}>
        <View
          className={`absolute top-28 left-0 w-full -translate-y-1/2 my-auto z-50 flex-row transform ${
            isTyping ? 'h-[15%]' : 'h-[75%]'
          }`}
        >
          <View className='z-40 flex-row w-full h-full'>
            <TouchableOpacity
              className='flex-1 z-40'
              onPress={() => {
                setCurrentImageIndex((prev) => {
                  if (prev === 0) {
                    return user.images.length - 1;
                  }
                  return prev - 1;
                });

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            ></TouchableOpacity>
            <TouchableOpacity
              className='flex-1 z-40'
              onPress={() => {
                setCurrentImageIndex((prev) => {
                  if (prev === user.images.length - 1) {
                    return 0;
                  }
                  return prev + 1;
                });

                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            ></TouchableOpacity>
          </View>
        </View>
        <View className='absolute top-0 left-0 w-full h-full pointer-events-none'>
          <LinearGradient
            pointerEvents='none'
            colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
            className='absolute bottom-0 left-0 z-40 w-full h-full'
            locations={isTyping ? [0.1, 1] : [0, 0.5]}
            start={[0, 1]}
            end={[1, 0]}
          />
          <Image
            source={{ uri: user.images[currentImageIndex] }}
            className='w-full h-full object-cover'
          />
        </View>

        {/* user info: */}
        <View className='px-6 justify-between z-40 absolute bottom-0 w-full pointer-events-none h-full'>
          <KeyboardAvoidingView
            className='flex-1'
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={keyboardVerticalOffset}
          >
            <SafeAreaView className='flex-1 h-full'>
              <KeyboardAvoidingView
                behavior='height'
                className='flex-1 justify-end'
              >
                <View className='flex-row items-end justify-between'>
                  <View>
                    <Text className='text-white font-ProstoOne text-2xl'>
                      {user.age}
                    </Text>
                    <View>
                      <Text className='text-white font-ProstoOne text-5xl'>
                        {user.firstName}
                      </Text>
                      <Text className='text-white font-ProstoOne text-5xl'>
                        {user.lastName}
                      </Text>
                    </View>
                    {gymLoading ? (
                      <Spinner />
                    ) : (
                      <View className='flex-row items-center mb-6'>
                        <MapPin color='#CCC9C9' weight='regular' size={16} />
                        <Text className='text-secondaryWhite font-ProstoOne text-md'>
                          {DisplayGymName(gym?.name)}
                        </Text>
                      </View>
                    )}
                  </View>
                  {isTyping && (
                    <TouchableOpacity onPress={() => lowerKeyboard()}>
                      <CaretDown color='#fff' style={{ paddingVertical: 24 }} />
                    </TouchableOpacity>
                  )}
                </View>
                <View
                  className='flex-row items-center'
                  style={{
                    marginBottom: Platform.OS === 'android' ? 32 : 0,
                  }}
                >
                  <View className='flex-1 overflow-hidden rounded-full mr-6'>
                    <BlurView intensity={15} className='bg-primaryWhite/10'>
                      <TextInput
                        value={message}
                        onChangeText={(text) => setMessage(text)}
                        className='p-2 px-4 rounded-full text-white z-50'
                        placeholder='Shoot a message and link up'
                        placeholderTextColor={
                          Platform.OS === 'android' && COLORS.secondaryWhite
                        }
                        onFocus={() => setIsTyping(true)}
                      />
                    </BlurView>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      createLink.mutate({
                        toUserId: user.id,
                        fromUserId: currUser.id,
                      });
                      // create haptic feedback
                      Haptics.notificationAsync(
                        Haptics.NotificationFeedbackType.Success
                      );
                    }}
                  >
                    <>
                      {createLink.isLoading ? (
                        <Spinner />
                      ) : (
                        <PaperPlaneRight
                          color='#CCC9C9'
                          weight='regular'
                          size={18}
                          style={{
                            flex: 0.25,
                          }}
                        />
                      )}
                    </>
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
}
