import { Dimensions, FlatList, Text, View } from 'react-native';
import Person from '../components/person';
import Layout from '../layouts/layout';
import { User } from '../utils/users';
import React, { useRef, useState } from 'react';
import { calculateCardHeight, calculateSnapInterval } from '../utils/ui';
import { useUsers } from '../hooks/useUsers';
import useToken from '../hooks/useToken';
import Loading from '../components/Loading';
import Button from '../components/button';
import { ArrowBendDoubleUpLeft, ArrowBendLeftUp } from 'phosphor-react-native';

export default function HomeScreen({ navigation, route }) {
  const token = useToken();
  const { height } = Dimensions.get('window');
  const flatListRef = useRef(null);

  const snapToInterval = calculateSnapInterval(calculateCardHeight(height));

  const { data: users, isLoading, error } = useUsers(token);

  if (isLoading) return <Loading />;

  const returnToTop = () => {
    flatListRef.current.scrollToIndex({ index: 0, animated: true });
  };

  return (
    <Layout navigation={navigation}>
      <FlatList
        snapToInterval={snapToInterval}
        decelerationRate='fast'
        snapToAlignment='center'
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        className='bg-primaryDark relative'
        contentInsetAdjustmentBehavior='automatic'
        style={{ paddingHorizontal: 16 }}
        contentContainerStyle={{ justifyContent: 'space-between' }}
        data={users}
        ref={flatListRef}
        renderItem={({ item, index }) =>
          index !== users.length - 1 ? (
            <Person
              user={item}
              key={index}
              navigation={navigation}
              route={route}
            />
          ) : (
            <View className='py-12'>
              <Button
                icon={<ArrowBendLeftUp color='#000' weight='bold' size={32} />}
                variant='primary'
                onPress={returnToTop}
              >
                Return to Top
              </Button>
              <Text className='text-tertiaryDark text-center'>
                You've reached the end of nearby gym goers! Help grow Gymlink!
              </Text>
            </View>
          )
        }
      />
    </Layout>
  );
}
