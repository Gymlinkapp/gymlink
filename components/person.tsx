import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Barbell, MapPin, X } from 'phosphor-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Text,
  View,
  Image as RNImage,
  Animated,
  Easing,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { COLORS } from '../utils/colors';
import { NAVBAR_HEIGHT, SPACING } from '../utils/sizes';
import { calculateCardHeight, truncate } from '../utils/ui';
import { User } from '../utils/users';
import Button from './button';
import { useGym } from '../hooks/useGym';
import { Gym } from '../utils/types/gym';
import { useLocation } from '../hooks/useLocation';
import { useGetLocationById } from '../hooks/useGetLocationById';
import useToken from '../hooks/useToken';
import { useUser } from '../hooks/useUser';
import { useMutation } from 'react-query';
import api from '../utils/axiosStore';
import { useNavigation } from '@react-navigation/native';

// reusable component to wrap the user's info with animations
function Info({
  swipe,
  children,
  row,
}: {
  swipe: Animated.Value;
  children: React.ReactNode;
  row?: boolean;
}) {
  return (
    <Animated.View
      style={{
        flex: 1,
        flexDirection: row ? 'row' : 'column',
        // alignItems: 'center',
        // the info will slide down, then animate back up
        opacity: swipe.interpolate({
          inputRange: [0, 100],
          outputRange: [1, 0],
        }),
        transform: [
          {
            translateY: swipe.interpolate({
              inputRange: [0, 100],
              outputRange: [0, 100],
            }),
          },
        ],
      }}
    >
      {children}
    </Animated.View>
  );
}

function UserInfo({
  user,
  slide,
  swipe,
  gym,
  navigation,
}: {
  user: Partial<User>;
  slide: number;
  swipe: Animated.Value;
  gym?: Gym;
  navigation?: any;
}) {
  switch (slide) {
    case 0:
      return (
        <Info swipe={swipe}>
          <Text className='text-secondaryWhite text-sm leading-4'>
            {user.bio?.length > 100 ? truncate(user.bio, 100) : user.bio}
          </Text>
          {user?.bio.length > 100 && (
            <Text
              className='text-white text-md mt-2 font-MontserratBold leading-4'
              onPress={() => {
                navigation.navigate('Profile', {
                  user: user,
                });
              }}
            >
              Show More
            </Text>
          )}
        </Info>
      );
    case 1:
      return (
        <Info row swipe={swipe}>
          <MapPin color='#fff' weight='fill' size={18} />
          <Text className='text-white font-MontserratMedium text-lg'>
            {gym?.name}
          </Text>
        </Info>
      );
    case 2:
      return (
        <Info row swipe={swipe}>
          <FlatList
            data={user.tags}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
            renderItem={({ index }) => (
              <View className='flex-row items-center justify-center bg-primaryDark rounded-full px-4 py-1 m-1'>
                <Text className='text-primaryWhite font-MontserratMedium text-sm leading-4'>
                  {user.tags[index]}
                </Text>
              </View>
            )}
          />
        </Info>
      );
    default:
      return (
        <Info swipe={swipe}>
          <Text className='text-secondaryWhite text-sm leading-4'>
            {user.bio?.length > 100 ? truncate(user.bio, 100) : user.bio}
          </Text>
        </Info>
      );
  }
}

export default function Person({
  user,
  navigation,
  route,
}: {
  user: Partial<User>;
  navigation?: any;
  route?: any;
}) {
  const token = useToken();
  const { data: currUser } = useUser(token);
  const { width, height } = Dimensions.get('window');
  const [sentFriendRequest, setSentFriendRequest] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const fade = useRef(new Animated.Value(0)).current;
  const swipe = useRef(new Animated.Value(0)).current;

  const { data: gym, isLoading: gymLoading } = useGym(user.gymId);

  useEffect(() => {
    if (sentFriendRequest) {
      Animated.spring(fade, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(fade, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }

    if (route.params?.userId === user.id) {
      setSentFriendRequest(true);
    }
  }, [sentFriendRequest, route.params?.userId]);

  const CARD_WIDTH = width;

  const CARD_HEIGHT = calculateCardHeight(height);

  const transparentWhite = 'rgba(255, 255, 255, 0.05)';
  const gold = 'rgb(255, 215, 0)';
  const transparentGold = 'rgba(255, 215, 0, 0.25)';

  const SWIPE_ANIMATION_DURATION = 150;
  const SWIPE_ANIMIATION_EASING = Easing.bezier(0.25, 0.1, 0.25, 1);
  const SWIPE_ANIMATION_VALUE = 100;

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

  return (
    <Animated.View
      className='overflow-hidden rounded-2xl relative'
      style={{
        width: '100%',
        height: CARD_HEIGHT,
        marginVertical: SPACING,
        position: 'relative',
      }}
    >
      <Animated.View
        style={{
          zIndex: 10,
          opacity: fade.interpolate({
            // opposite of the fade animation
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.5)', transparentWhite]}
          className='w-full h-full absolute top-0 left-0 z-30'
          start={[0, 1]}
          end={[0, 0]}
        />
      </Animated.View>

      <View className={`absolute top-0 left-0 w-full h-full flex-row z-40`}>
        {/* back photo side */}
        <TouchableOpacity
          className='flex-1'
          onPress={() => {
            setCurrentImageIndex((prev) => {
              if (prev === 0) {
                return user.images.length - 1;
              }
              return prev - 1;
            });

            // when pressed, the users info will slide down then animate back up
            Animated.timing(swipe, {
              toValue: SWIPE_ANIMATION_VALUE,
              duration: SWIPE_ANIMATION_DURATION,
              easing: SWIPE_ANIMIATION_EASING,
              useNativeDriver: true,
            }).start(() => {
              Animated.timing(swipe, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
              }).start();
            });
          }}
        ></TouchableOpacity>
        {/* forward photo side */}
        <TouchableOpacity
          className='flex-1 h-full'
          onPress={() => {
            setCurrentImageIndex((prev) => {
              if (prev === user.images.length - 1) {
                return 0;
              }
              return prev + 1;
            });
            Animated.timing(swipe, {
              toValue: SWIPE_ANIMATION_VALUE,
              duration: SWIPE_ANIMATION_DURATION,
              easing: SWIPE_ANIMIATION_EASING,
              useNativeDriver: true,
            }).start(() => {
              Animated.timing(swipe, {
                toValue: 0,
                duration: SWIPE_ANIMATION_DURATION,
                useNativeDriver: true,
              }).start();
            });
          }}
        ></TouchableOpacity>
      </View>
      <Animated.View
        style={{
          borderWidth: 15,
          // transform: [{ scale: fade }],
          // use the scale transform but make it bigger than 1
          // so that the border is outside the image
          transform: [
            {
              scale: fade.interpolate({
                inputRange: [0, 1],
                outputRange: [1.1, 1],
              }),
            },
          ],
          borderColor: gold,
          zIndex: 10,
          opacity: fade,
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <LinearGradient
          colors={[gold, transparentGold]}
          className='w-full h-full absolute top-0 left-0'
          start={[0, 0]}
          end={[0, 1]}
        />
      </Animated.View>

      <RNImage
        source={{ uri: user.images[currentImageIndex] }}
        className='w-full h-full'
      />
      <View className={`absolute bottom-0 left-0 w-full z-50 p-2`}>
        <Animated.View
          style={{
            transform: [
              {
                translateY: fade.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                }),
              },
            ],
          }}
          className='rounded-2xl overflow-hidden w-full'
        >
          <BlurView className='w-full p-4' intensity={20}>
            {/* user's name */}
            <Text className='text-white pb-2 text-2xl font-bold'>
              {user.firstName} {user.lastName}
            </Text>
            {/* user's information: */}
            <UserInfo
              gym={gym}
              swipe={swipe}
              user={user}
              slide={currentImageIndex}
              navigation={navigation}
            />
          </BlurView>
        </Animated.View>
        <View className='flex-row z-50'>
          <Animated.View
            style={{
              transform: [
                {
                  scale: fade.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },
                {
                  translateY: fade.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20],
                  }),
                },
              ],
              width: sentFriendRequest ? '0%' : '100%',
              flex: sentFriendRequest ? 0 : 1,
              opacity: fade.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            }}
          >
            <Button
              variant='secondary'
              icon={<X weight='fill' color={COLORS.mainWhite} size={24} />}
            >
              Go Next
            </Button>
          </Animated.View>
          <Animated.View
            style={{
              transform: [
                {
                  scale: fade.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.9, 1],
                  }),
                },

                {
                  translateY: fade.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -20],
                  }),
                },
              ],
              flex: 1,
            }}
          >
            <Button
              onPress={() => {
                setSentFriendRequest(true);

                if (!sentFriendRequest) {
                  useSendFriendRequest.mutate({
                    toUserId: user.id,
                    fromUserId: currUser.id,
                  });
                }
              }}
              variant='primary'
              icon={<Barbell weight='fill' />}
            >
              Go Gym
            </Button>
          </Animated.View>
        </View>
      </View>
      {/* image indicator of the amount of images and the current index of the image */}
      {user.images.length > 1 && !sentFriendRequest && (
        <View className='absolute bottom-[2.5] left-0 w-full flex-row justify-center items-center z-10'>
          <View className='flex-row px-4'>
            {user.images.map((image, index) => (
              <Animated.View
                key={image}
                style={{
                  // using the swipe animation touch the scale of the indicator
                  transform: [
                    {
                      scaleX: swipe.interpolate({
                        inputRange: [
                          -SWIPE_ANIMATION_VALUE,
                          0,
                          SWIPE_ANIMATION_VALUE,
                        ],
                        outputRange: [0.95, 1, 0.95],
                      }),
                    },
                    {
                      scaleY: index === currentImageIndex ? 1.5 : 1,
                    },
                  ],
                }}
                className={`flex-1 h-1 rounded-full ${
                  index === currentImageIndex
                    ? 'bg-primaryWhite'
                    : 'bg-white/40'
                } mx-1`}
              />
            ))}
          </View>
        </View>
      )}
    </Animated.View>
  );
}
