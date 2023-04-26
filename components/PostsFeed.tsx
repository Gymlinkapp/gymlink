import { Image, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ChatText, Eye, Heart, Plus } from 'phosphor-react-native';
import { COLORS } from '../utils/colors';
import { usePosts } from '../hooks/usePosts';
import { useEffect, useState } from 'react';
import { useAuth } from '../utils/context';
import FeedLoading from './FeedLoading';
import Loading from './Loading';
import { Comment, Like, Post, View as TView } from '../utils/types/posts';
import { Gym } from '../utils/types/gym';

export const PostStat = ({
  icon,
  stat,
}: {
  icon: React.ReactNode;
  stat: string | number;
}) => {
  return (
    <View className='flex-row items-center'>
      {icon}
      <Text className='text-secondaryWhite text-xs ml-2 font-ProstoOne'>
        {stat}
      </Text>
    </View>
  );
};
export default function PostsFeed({ navigation }: { navigation: any }) {
  const LIMIT = 10;
  const { token, user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [offset, setOffset] = useState(0);

  const { data, isLoading, isFetching } = usePosts(token, offset, LIMIT);

  useEffect(() => {
    if (!isLoading && data && data.posts) {
      setPosts((prevFeed) => [...prevFeed, ...data.posts]);
    }
  }, [isLoading, data, user]);

  if (isLoading) {
    return <FeedLoading />;
  }

  const fetchMore = () => {
    if (isLoading || isFetching) return;
    if (data.posts.length < LIMIT) return;
    setOffset((prevOffset) => prevOffset + LIMIT);
  };

  if (!posts.length) {
    <Text>No Posts</Text>;
  }
  return (
    <View className='z-50 px-6 py-12 relative'>
      <TouchableOpacity className='bg-accent w-16 h-16 rounded-full justify-center items-center absolute top-[65%] right-5 z-50'>
        <Plus color='#fff' size={21} weight='fill' />
      </TouchableOpacity>
      <Text className='text-white text-2xl font-ProstoOne mb-4'>Explore</Text>
      <FlatList
        contentContainerStyle={{ paddingTop: 50, paddingBottom: 200 }}
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
        data={posts}
        renderItem={({ item: post }: { item: Post }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Post', { postId: post.id });
              }}
              className='bg-secondaryDark rounded-3xl p-4 mb-4'
              activeOpacity={1}
            >
              <View className='flex-row  items-center mb-2'>
                <View className='flex-row items-center'>
                  <View className='w-8 h-8 rounded-full overflow-hidden mr-2'>
                    <Image
                      source={{
                        uri: post.user.images[0],
                      }}
                      className='object-cover w-full h-full'
                    />
                  </View>
                  <Text className='text-white text-base font-ProstoOne'>
                    {post.user.firstName}
                  </Text>
                </View>
                <Text className='text-tertiaryDark text-xs font-MontserratRegular ml-auto'>
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
              <View>
                <Text className='text-secondaryWhite font-MontserratRegular leading-5'>
                  {post.content}
                </Text>
              </View>
              <View className='w-full flex-row justify-evenly mt-6'>
                <TouchableOpacity>
                  <PostStat
                    icon={
                      <Heart
                        size={18}
                        weight='fill'
                        color={COLORS.tertiaryDark}
                      />
                    }
                    stat={post.likes?.length}
                  />
                </TouchableOpacity>
                <PostStat
                  icon={
                    <Eye size={18} weight='fill' color={COLORS.tertiaryDark} />
                  }
                  stat={post.views?.length}
                />
                <PostStat
                  icon={
                    <ChatText
                      size={18}
                      weight='fill'
                      color={COLORS.tertiaryDark}
                    />
                  }
                  stat={post.comments?.length}
                />
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}
