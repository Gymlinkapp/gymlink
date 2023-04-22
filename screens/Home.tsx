import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  Animated,
  ScrollView,
  TextInput,
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
import UserPrompt from '../components/UserPrompt';

export default function HomeScreen({ navigation, route }) {
  const INITIAL_COL_OFFSETS = [50, 150, 100];
  const LIMIT = 9;
  const {
    token,
    user,
    filters,
    setFilters,
    feed,
    setFeed,
    canAnswerPrompt,
    prompt,
  } = useAuth();
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
      <LinearGradient
        pointerEvents='none'
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
        className='absolute bottom-0 z-50 w-full h-80'
        start={[0, 0]}
        end={[0, 1]}
      />

      {/* <Filters /> */}
      {canAnswerPrompt && (
        <View className=' z-50 border-[1px] border-dashed border-tertiaryDark rounded-3xl'>
          <View className='px-6 pt-4'>
            <Text className='font-ProstoOne text-tertiaryDark'>
              Let people know your Vibe
            </Text>
            <Text className='font-ProstoOne text-white'>{prompt}</Text>

            <TextInput className='w-full p-4 bg-secondaryDark rounded-md mt-4 text-white' />
          </View>

          <TouchableOpacity className='w-full border-t-[1px] border-secondaryDark items-center mt-4 py-4'>
            <Text className='font-ProstoOne text-white'>Share</Text>
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        contentContainerStyle={{ paddingTop: 50, paddingBottom: 500 }}
        data={feed}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        // onEndReached={() => {
        //   setOffset(offset + LIMIT);
        // }}
        onEndReachedThreshold={0.1}
        renderItem={({ item: user }) => {
          const mostRecentPrompt =
            user.userPrompts && user.userPrompts[user.userPrompts.length - 1];
          return (
            <View className='my-4'>
              <TouchableOpacity
                activeOpacity={1}
                className='h-60 w-full relative overflow-hidden rounded-[50px]'
                onPress={() => {
                  navigation.navigate('Profile', { user });
                }}
              >
                <Image
                  source={{ uri: user.images[0] }}
                  className='object-cover w-full h-full'
                />
                <ScrollView
                  horizontal
                  className='absolute bottom-5 left-2 flex-row z-20'
                >
                  {user.tags.length > 0 &&
                    user.tags.map((tag, idx) => (
                      <BlurView
                        key={idx}
                        className='bg-primaryDark/20 px-4 py-2 mx-2 rounded-full overflow-hidden border-[0.5px] border-tertiaryDark'
                        intensity={25}
                      >
                        <Text className='font-ProstoOne text-white text-xs '>
                          {tag}
                        </Text>
                      </BlurView>
                    ))}
                </ScrollView>
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
                  className='absolute bottom-0 w-full h-60 z-10'
                  start={[0, 0]}
                  end={[0, 1]}
                />
              </TouchableOpacity>
              <TouchableOpacity className='flex-row items-center my-2'>
                <View className='rounded-full bg-secondaryDark px-2 py-2 mr-2'>
                  <Text className='font-prostoOne text-white text-md'>
                    {user.age}
                  </Text>
                </View>
                <Text className='font-ProstoOne text-white text-3xl'>
                  {user.firstName}
                </Text>
              </TouchableOpacity>
              {mostRecentPrompt && (
                <UserPrompt answer={mostRecentPrompt.answer} prompt={prompt} />
              )}
            </View>
          );
        }}
      />
    </Layout>
  );
}
