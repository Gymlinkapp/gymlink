import {
  BackdropBlur,
  Canvas,
  Fill,
  Group,
  useFont,
  useImage,
  Image,
  Skia,
  useRawData,
  vec,
} from '@shopify/react-native-skia';
import {
  Animated,
  Dimensions,
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Text as SkiaText } from '@shopify/react-native-skia';
import Person from '../components/person';
import Layout from '../layouts/layout';
import { User } from '../utils/users';
import { COLORS } from '../utils/colors';
import React from 'react';
import Button from '../components/button';
import { NAVBAR_HEIGHT } from '../utils/sizes';

const users: Partial<User>[] = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    images: [
      'https://images.unsplash.com/photo-1568000211272-88ae1d40afc1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2570&q=80',
    ],
    age: 25,
    gymId: 'Powerhouse Gym',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur quos nulla dolorem optio ex neque omnis asperiores repudiandae accusantium! Eaque ullam nobis numquam aperiam. Dolorem velit a quidem placeat nam!',
  },
  {
    id: '2',
    firstName: 'John',
    lastName: 'Doe',
    images: [
      'https://images.unsplash.com/photo-1568000211272-88ae1d40afc1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2570&q=80',
    ],
    age: 25,
    gymId: 'Powerhouse Gym',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Tenetur quos nulla dolorem optio ex neque omnis asperiores repudiandae accusantium! Eaque ullam nobis numquam aperiam. Dolorem velit a quidem placeat nam!',
  },
  {
    id: '3',
    firstName: 'John',
    lastName: 'Doe',
    images: [
      'https://images.unsplash.com/photo-1568000211272-88ae1d40afc1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2570&q=80',
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
];

export default function HomeScreen({ navigation }) {
  const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

  const y = new Animated.Value(0);
  const onScroll = Animated.event([{ nativeEvent: { contentOffset: { y } } }], {
    useNativeDriver: true,
  });

  const { width, height } = Dimensions.get('window');

  // card
  const CARD_HEIGHT = height * 0.7 + NAVBAR_HEIGHT;

  return (
    <Layout>
      <FlatList
        snapToInterval={CARD_HEIGHT}
        decelerationRate='fast'
        snapToAlignment='center'
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        className='bg-primaryDark'
        contentInsetAdjustmentBehavior='automatic'
        style={{ paddingHorizontal: 16 }}
        contentContainerStyle={{ justifyContent: 'space-evenly' }}
        data={users}
        renderItem={(item) => <Person user={item.item} key={item.index} />}
        // {...{ onScroll }}
      />
    </Layout>
  );
}
