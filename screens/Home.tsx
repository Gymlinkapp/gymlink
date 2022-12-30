import { Dimensions, FlatList } from 'react-native';
import Person from '../components/person';
import Layout from '../layouts/layout';
import { User } from '../utils/users';
import React, { useState } from 'react';
import { calculateCardHeight, calculateSnapInterval } from '../utils/ui';
import { useUsers } from '../hooks/useUsers';
import useToken from '../hooks/useToken';

export default function HomeScreen({ navigation, route }) {
  const token = useToken();
  const { height } = Dimensions.get('window');

  const snapToInterval = calculateSnapInterval(calculateCardHeight(height));

  const { data: users, isLoading, error } = useUsers(token);
  console.log(users);

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
        renderItem={(item) => <Person user={item.item} key={item.index} />}
      />
    </Layout>
  );
}
