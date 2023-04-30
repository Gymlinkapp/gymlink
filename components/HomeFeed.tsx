import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import {
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { transformTag } from '../utils/transformTags';
import { DisplayGymName } from '../utils/displayGymName';
import { MapPin } from 'phosphor-react-native';
import { useEffect, useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { useAuth } from '../utils/context';
import Loading from './Loading';
import getMostRecentPrompt from '../utils/getMostRecentPrompt';
import FeedLoading from './FeedLoading';
import UserPrompt from './UserPrompt';

export default function HomeFeed({ navigation }: { navigation: any }) {
  const LIMIT = 9;
  const { token, user, feed, setFeed } = useAuth();

  const [offset, setOffset] = useState(0);

  const { data, isLoading, isFetching } = useUsers(token, offset, LIMIT);

  useEffect(() => {
    if (!isLoading && data && data.users) {
      setFeed((prevFeed) => {
        const newUsers = data.users.filter(
          (newUser) => !prevFeed.some((prevUser) => prevUser.id === newUser.id)
        );
        return [...prevFeed, ...newUsers];
      });
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
  );
}
