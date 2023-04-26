import { Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ChatText, Eye, Heart, Plus } from 'phosphor-react-native';
import { COLORS } from '../utils/colors';
import { usePosts } from '../hooks/usePosts';
import { useEffect, useState } from 'react';
import { useAuth } from '../utils/context';
import FeedLoading from './FeedLoading';
import Loading from './Loading';
import { Post } from '../utils/types/posts';

const PostStat = ({
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
        renderItem={({ item: post }: { item: Post }) => (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Post', { id: post.id });
            }}
            className='bg-secondaryDark rounded-3xl p-4 mb-4'
            activeOpacity={1}
          >
            <View className='flex-row  items-center mb-2'>
              <View className='flex-row items-center'>
                <View className='w-6 h-6 bg-tertiaryDark rounded-full mr-2' />
                <Text className='text-white text-md font-ProstoOne'>Name</Text>
              </View>
              <Text className='text-tertiaryDark text-xs font-MontserratRegular ml-auto'>
                {new Date(post.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
            </View>
            <View>
              <Text className='text-white font-MontserratRegular'>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
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
                  stat={21}
                />
              </TouchableOpacity>
              <PostStat
                icon={
                  <Eye size={18} weight='fill' color={COLORS.tertiaryDark} />
                }
                stat={21}
              />
              <PostStat
                icon={
                  <ChatText
                    size={18}
                    weight='fill'
                    color={COLORS.tertiaryDark}
                  />
                }
                stat={21}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
