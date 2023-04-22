import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
} from 'react-native';
import Layout from '../layouts/layout';
import React, { useEffect, useRef, useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import Loading from '../components/Loading';
import { useAuth } from '../utils/context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Filters from '../components/Filters';
import { defaultFilters } from '../utils/types/filter';
import FeedLoading from '../components/FeedLoading';
import * as Haptics from 'expo-haptics';

export default function HomeScreen({ navigation, route }) {
  const INITIAL_COL_OFFSETS = [50, 150, 100];
  const LIMIT = 9;
  const { token, user, setUser, filters, setFilters, feed, setFeed } =
    useAuth();
  const [offset, setOffset] = useState(0);
  const { data, isLoading, isFetching } = useUsers(token, offset, LIMIT);

  useEffect(() => {
    if (user) {
      setFilters(defaultFilters);
    }
    if (!isLoading && data && data.users) {
      setFeed(data.users);
    }
  }, [isLoading, data, user]);

  if (isLoading) {
    return <FeedLoading />;
  }

  return (
    <Layout navigation={navigation}>
      <LinearGradient
        pointerEvents='none'
        colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
        className='absolute -top-[100px] z-50 w-full h-80'
        start={[0, 0]}
        end={[0, 1]}
      />

      {/* <Filters /> */}
      <FlatList
        contentContainerStyle={{ paddingVertical: 100 }}
        data={feed}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        // onEndReached={() => {
        //   setOffset(offset + LIMIT);
        // }}
        onEndReachedThreshold={0.1}
        renderItem={({ item: user }) => (
          <View className='my-4'>
            <TouchableOpacity className='h-60 w-full relative overflow-hidden rounded-[50px]'>
              <Image
                source={{ uri: user.images[0] }}
                className='object-cover w-full h-full'
              />
            </TouchableOpacity>
            <TouchableOpacity className='flex-row items-center my-2'>
              <View className='rounded-full bg-secondaryDark px-3 py-2 mr-2'>
                <Text className='font-prostoOne text-white text-2xl'>
                  {user.age}
                </Text>
              </View>
              <Text className='font-ProstoOne text-white text-2xl'>
                {user.firstName}
              </Text>
            </TouchableOpacity>
            <View className='border-[1px] border-dashed border-tertiaryDark rounded-[15px] p-6'>
              <Text className='font-ProstoOne text-secondaryWhite text-xl'>
                Why you here?
              </Text>
              <Text className='font-ProstoOne text-white text-xl'>
                I'm bored of always lifting alone!
              </Text>
            </View>
          </View>
        )}
      />
    </Layout>
  );
}
