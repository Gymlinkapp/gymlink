import { Dimensions, FlatList } from 'react-native';
import Person from '../components/person';
import Layout from '../layouts/layout';
import { User } from '../utils/users';
import React, { useState } from 'react';
import { calculateCardHeight, calculateSnapInterval } from '../utils/ui';

export default function HomeScreen({ navigation }) {
  const [users, setUsers] = useState<Partial<User>[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      images: [
        'https://images.unsplash.com/photo-1568000211272-88ae1d40afc1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2570&q=80',
        'https://images.unsplash.com/photo-1645036811556-d4ce14657484?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      ],
      age: 25,
      gymId: 'Powerhouse Gym',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur quos nulla dolorem optio ex neque omnis asperiores repudiandae accusantium! Eaque ullam nobis numquam aperiam. Dolorem velit a quidem placeat nam!',
    },
    {
      id: '2awda',
      firstName: 'Bobby',
      lastName: 'Smith',
      images: [
        'https://images.unsplash.com/photo-1645036811556-d4ce14657484?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      ],
      age: 25,
      gymId: 'Powerhouse Gym',
      bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur quos nulla dolorem optio ex neque omnis asperiores repudiandae accusantium! Eaque ullam nobis numquam aperiam. Dolorem velit a quidem placeat nam!',
    },
    {
      id: '3awdad',
      firstName: 'Jane',
      lastName: 'Doe',
      images: [
        'https://images.unsplash.com/photo-1609233873389-8b9e1c20a616?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80',
      ],
      age: 25,
      bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur quos nulla dolorem optio ex neque omnis asperiores repudiandae accusantium! Eaque ullam nobis numquam aperiam. Dolorem velit a quidem placeat nam!',
    },
  ]);
  const { height } = Dimensions.get('window');

  const snapToInterval = calculateSnapInterval(calculateCardHeight(height));

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
