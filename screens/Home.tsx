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
import { useMutation, useQueryClient } from 'react-query';
import api from '../utils/axiosStore';
import getMostRecentPrompt from '../utils/getMostRecentPrompt';
import { MapPin, NavigationArrow } from 'phosphor-react-native';
import { transformTag } from '../utils/transformTags';
import { DisplayGymName } from '../utils/displayGymName';
import PromptCountdown from '../components/PromptCountdown';

export default function HomeScreen({ navigation, route }) {
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
    setCanAnswerPrompt,
  } = useAuth();
  const queryClient = useQueryClient();
  const [offset, setOffset] = useState(0);
  const [userPromptAnswer, setUserPromptAnswer] = useState('');
  const { data, isLoading, isFetching } = useUsers(token, offset, LIMIT);

  const answerPromptMutation = useMutation(
    (answer: string) =>
      api.post('/social/answerPrompt', {
        answer,
        userId: user.id,
        promptId: prompt.id,
      }),
    {
      onSuccess: (data) => {
        setCanAnswerPrompt(false);
        queryClient.invalidateQueries('user');
        queryClient.invalidateQueries('users');
      },
    }
  );

  useEffect(() => {
    if (user) {
      setFilters(defaultFilters);
    }
    if (!isLoading && data && data.users) {
      setFeed((prevFeed) => [...prevFeed, ...data.users]);
    }
  }, [isLoading, data, user]);

  if (isLoading) {
    return <FeedLoading />;
  }

  const fetchMore = () => {
    if (isLoading || isFetching) return;
    if (data.users.length < LIMIT) return;
    setOffset((prevOffset) => prevOffset + LIMIT);
  };

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
        className='absolute bottom-0 z-50r w-full h-80'
        start={[0, 0]}
        end={[0, 1]}
      />

      {/* <Filters /> */}
      {prompt && canAnswerPrompt && (
        <View className='z-50 bg-transparent'>
          <View className='w-full flex-row justify-end mb-2'>
            <PromptCountdown />
          </View>
          <View className='border-[1px] border-dashed border-tertiaryDark rounded-3xl'>
            <View className='px-6 pt-4'>
              <Text className='font-ProstoOne text-tertiaryDark'>
                Let people know your Vibe
              </Text>
              <Text className='font-ProstoOne text-white'>{prompt.prompt}</Text>

              <TextInput
                className='w-full p-4 bg-secondaryDark rounded-md mt-4 font-MontserratMedium text-white'
                onChangeText={(text) => setUserPromptAnswer(text)}
              />
            </View>

            <TouchableOpacity
              className='w-full border-t-[1px] border-secondaryDark items-center mt-4 py-4'
              onPress={() => {
                answerPromptMutation.mutate(userPromptAnswer);
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success
                );
              }}
            >
              <Text className='font-ProstoOne text-white'>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <FlatList
        contentContainerStyle={{ paddingTop: 50, paddingBottom: 200 }}
        data={feed}
        windowSize={5}
        maxToRenderPerBatch={5}
        removeClippedSubviews
        keyExtractor={(item, idx) => `${item.id}_${idx}`}
        showsVerticalScrollIndicator={false}
        onEndReached={fetchMore}
        ListFooterComponent={() =>
          isLoading || isFetching ? <Loading /> : <Text>No more Users</Text>
        }
        onEndReachedThreshold={0.1}
        renderItem={({ item: user }) => {
          const mostRecentPrompt = getMostRecentPrompt(user);
          return (
            <View className='my-4'>
              <TouchableOpacity
                activeOpacity={1}
                className='h-80 w-full relative overflow-hidden rounded-[50px]'
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
                          {transformTag(tag) || 'Boring'}
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
              <View className='px-4'>
                <View className='flex-row items-center mt-2'>
                  <MapPin weight='fill' color='#fff' size={16} />
                  <Text className='text-white text-sm font-ProstoOne ml-2'>
                    {DisplayGymName(user.gym.name)}
                  </Text>
                </View>
                <TouchableOpacity className='flex-row items-center my-2'>
                  <View className='rounded-full bg-secondaryDark px-2 py-2 mr-2'>
                    <Text className='font-ProstoOne text-white text-md'>
                      {user.age}
                    </Text>
                  </View>
                  <Text className='font-ProstoOne text-white text-3xl'>
                    {user.firstName}
                  </Text>
                </TouchableOpacity>
                {mostRecentPrompt?.hasAnswered && (
                  <UserPrompt
                    answer={mostRecentPrompt.answer}
                    prompt={mostRecentPrompt.prompt.prompt}
                  />
                )}
              </View>
            </View>
          );
        }}
      />
    </Layout>
  );
}
