import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Barbell, X } from 'phosphor-react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Text,
  View,
  Image as RNImage,
  Animated,
  Easing,
} from 'react-native';
import { COLORS } from '../utils/colors';
import { NAVBAR_HEIGHT, SPACING } from '../utils/sizes';
import { calculateCardHeight } from '../utils/ui';
import { User } from '../utils/users';
import Button from './button';

export default function Person({ user }: { user: Partial<User> }) {
  const { width, height } = Dimensions.get('window');
  const [sentFriendRequest, setSentFriendRequest] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;

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
  }, [sentFriendRequest]);

  const CARD_WIDTH = width;

  const CARD_HEIGHT = calculateCardHeight(height);

  const transparentWhite = 'rgba(255, 255, 255, 0.05)';
  const gold = 'rgb(255, 215, 0)';
  const transparentGold = 'rgba(255, 215, 0, 0.25)';

  const sendFriendRequest = (user: User) => {
    setSentFriendRequest(true);
  };

  const gradientStartPos = fade.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const gradientEndPos = fade.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
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
      <RNImage source={{ uri: user.images[0] }} className='w-full h-full' />
      <View className={`absolute bottom-0 left-0 w-full z-20 p-2`}>
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
            <Text className='text-white pb-2 text-xl font-bold'>
              {user.firstName} {user.lastName}
            </Text>
            <Text className='text-secondaryWhite text-sm leading-4'>
              {/* show the user's bio but if it is more than 30 characters truncate it */}
              {user.bio.length > 100
                ? user.bio.substring(0, 100) + '...'
                : user.bio}
            </Text>
          </BlurView>
        </Animated.View>
        <View className='flex-row'>
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
              width: sendFriendRequest ? '0%' : '100%',
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
              onPress={() => setSentFriendRequest(!sentFriendRequest)}
              variant='primary'
              icon={<Barbell weight='fill' />}
            >
              Go Gym
            </Button>
          </Animated.View>
        </View>
      </View>
    </Animated.View>
  );
}
