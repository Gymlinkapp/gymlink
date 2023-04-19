import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

const SkeletonUserCard = ({
  translate,
  animationValue,
}: {
  translate: number;
  animationValue: Animated.Value;
}) => {
  const animatedStyle = {
    opacity: animationValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [1, 0.5, 1],
    }),
    transform: [
      {
        translateY: animationValue.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, translate, 0],
        }),
      },
    ],
  };

  return (
    <Animated.View
      style={[
        {
          flex: 1,
          marginHorizontal: 0.5,
          borderRadius: 32,
          height: 250,
          backgroundColor: 'rgba(255,255,255,0.1)',
        },
        animatedStyle,
      ]}
    />
  );
};

export default function FeedLoading() {
  const translateOne = 60;
  const translateTwo = 20;
  const animationValue = useRef(new Animated.Value(0)).current;

  const startPulsingAnimation = () => {
    animationValue.setValue(0);

    Animated.timing(animationValue, {
      toValue: 1,
      duration: 1000,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: true,
    }).start(() => startPulsingAnimation());
  };

  useEffect(() => {
    startPulsingAnimation();
  }, []);

  return (
    <View className='flex-1 h-full w-full justify-center items-center bg-primaryDark'>
      <View className='w-full flex-row'>
        <SkeletonUserCard
          translate={translateOne}
          animationValue={animationValue}
        />
        <SkeletonUserCard
          translate={translateTwo}
          animationValue={animationValue}
        />
        <SkeletonUserCard
          translate={translateOne}
          animationValue={animationValue}
        />
      </View>
      <View className='w-full flex-row'>
        <SkeletonUserCard
          translate={translateOne}
          animationValue={animationValue}
        />
        <SkeletonUserCard
          translate={translateTwo}
          animationValue={animationValue}
        />
        <SkeletonUserCard
          translate={translateOne}
          animationValue={animationValue}
        />
      </View>
      <View className='w-full flex-row'>
        <SkeletonUserCard
          translate={translateOne}
          animationValue={animationValue}
        />
        <SkeletonUserCard
          translate={translateTwo}
          animationValue={animationValue}
        />
        <SkeletonUserCard
          translate={translateOne}
          animationValue={animationValue}
        />
      </View>
    </View>
  );
}
