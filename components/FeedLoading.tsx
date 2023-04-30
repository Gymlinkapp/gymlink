import React, { useRef, useEffect } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

const SkeletonUserCard = ({ animationValue }) => {
  const animatedStyle = {
    opacity: animationValue.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.5, 0.25, 0.5],
    }),
  };

  return (
    <Animated.View style={[card.cardContainer, animatedStyle]}>
      <Animated.View style={[card.roundedLarge, animatedStyle]} />
      <Animated.View style={card.row}>
        <Animated.View
          style={[card.roundedSmall, card.marginRight, animatedStyle]}
        />
        <Animated.View style={[card.halfWidth, card.pill, animatedStyle]} />
      </Animated.View>
    </Animated.View>
  );
};

const card = StyleSheet.create({
  cardContainer: {
    width: '100%',
    height: 450,
    paddingHorizontal: 5,
  },
  roundedLarge: {
    height: '75%',
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },

  row: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  roundedSmall: {
    height: 50,
    width: 50,
    marginRight: 10,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  pill: {
    height: 50,
    width: 200,
    borderRadius: 9999,
    backgroundColor: 'rgba(255,255,255,0.35)',
  },
  marginRight: {
    marginRight: 2,
  },
  halfWidth: {
    width: '50%',
  },
});

export default function FeedLoading() {
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
    <View style={feedcard.fullScreen}>
      <SkeletonUserCard animationValue={animationValue} />
      <SkeletonUserCard animationValue={animationValue} />
      <SkeletonUserCard animationValue={animationValue} />
    </View>
  );
}

const feedcard = StyleSheet.create({
  fullScreen: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
});
