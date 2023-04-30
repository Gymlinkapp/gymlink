import {
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { ChatText, Eye, Heart, Plus } from 'phosphor-react-native';
import { COLORS } from '../utils/colors';
import { usePosts } from '../hooks/usePosts';
import { useEffect, useState } from 'react';
import { useAuth } from '../utils/context';
import FeedLoading from './FeedLoading';
import Loading from './Loading';
import { Comment, Like, Post, View as TView } from '../utils/types/posts';
import api from '../utils/axiosStore';
import { useMutation, useQueryClient } from 'react-query';
import * as Haptics from 'expo-haptics';
import Button from './button';

const hexToRGBA = (hex: string, alpha: number) => {
  const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

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
  const [modalVisible, setModalVisible] = useState(false);
  const [postContent, setPostContent] = useState('');
  const queryClient = useQueryClient();

  const { data, isLoading, isFetching } = usePosts(token, offset, LIMIT);

  useEffect(() => {
    queryClient.invalidateQueries('posts');
    if (!isLoading && data && data.posts) {
      setPosts((prevFeed) => {
        const newUsers = data.posts.filter(
          (newPost) => !prevFeed.some((prevPost) => prevPost.id === newPost.id)
        );
        return [...prevFeed, ...newUsers];
      });
    }
  }, [isLoading, data, user]);

  const likePost = useMutation(
    async (postId: string) => {
      const { data } = await api.post(`/posts/likePost`, {
        userId: user.id,
        postId,
      });
      return data;
    },
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('posts');
      },
    }
  );

  const createPost = useMutation(
    async () => {
      const { data } = await api.post(`/posts/create`, {
        content: postContent,
        userId: user.id,
      });
      return data;
    },
    {
      onSuccess: (data) => {
        setModalVisible(false);
        queryClient.invalidateQueries('posts');
      },
    }
  );

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
    <View className='z-40 px-6 py-12 relative'>
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        className='bg-accent w-16 h-16 rounded-full justify-center items-center absolute top-[75%] right-5 z-50'
      >
        <Plus color='#fff' size={21} weight='fill' />
      </TouchableOpacity>
      <Text className='text-white text-2xl font-ProstoOne my-4'>Explore</Text>
      <Modal animationType='slide' transparent={true} visible={modalVisible}>
        <View className='flex-1 justify-end items-end w-full'>
          <View className='bg-primaryDark  w-full h-3/4 p-12 rounded-3xl border-[0.5px] border-secondaryDark'>
            <Text className='text-white text-2xl font-ProstoOne mb-4'>
              Create Post
            </Text>
            <View className='mb-4'>
              <TextInput
                onChangeText={(text) => {
                  setPostContent(text);
                }}
                value={postContent}
                placeholder='What is on your mind?'
                placeholderTextColor={COLORS.tertiaryDark}
                multiline
                numberOfLines={4}
                textAlignVertical='top' // This will align the text to the top of the TextInput
                style={{
                  maxHeight: 120,
                  color: COLORS.mainWhite,
                  backgroundColor: COLORS.secondaryDark,
                  borderRadius: 10,
                  paddingHorizontal: 20,
                  paddingVertical: 50,
                  paddingTop: 15,
                  fontFamily: 'MontserratRegular',
                }}
              />

              <Button
                isLoading={createPost.isLoading}
                variant='primary'
                className='my-4'
                onPress={() => {
                  createPost.mutate();
                }}
              >
                Create
              </Button>
              <Button
                variant='secondary'
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
      <FlatList
        contentContainerStyle={{ paddingBottom: 200 }}
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
          const transformPostTag = (post: Post) => {
            const tag = post.tags as unknown as keyof typeof post.tags;
            return tag.charAt(0) + tag.slice(1).toLowerCase();
          };
          const tagColor = (post: Post) => {
            const tag = post.tags as unknown as keyof typeof post.tags;
            switch (tag) {
              case 'ADVICE':
                return '#724CF9';
              case 'QUESTION':
                return '#F9D34C';
              case 'GENERAL':
                return '#4CF9CF';
              default:
                return '#724CF9';
            }
          };
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('Post', { postId: post.id });
              }}
              className='bg-secondaryDark rounded-3xl p-4 mb-4'
              activeOpacity={1}
            >
              <View className='flex-row  items-center mb-2'>
                <View>
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
                  <View
                    style={{
                      backgroundColor: hexToRGBA(tagColor(post), 0.25),
                    }}
                    className='rounded-full px-2 w-fit py-1 my-2 items-center justify-center'
                  >
                    <Text
                      style={{
                        color: tagColor(post),
                      }}
                      className='font-MontserratRegular text-xs'
                    >
                      {transformPostTag(post)}
                    </Text>
                  </View>
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
                <TouchableOpacity
                  onPress={() => {
                    likePost.mutate(post.id);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <PostStat
                    icon={
                      <Heart
                        size={18}
                        weight='fill'
                        color={
                          post.likes?.find(
                            (like: Like) => like.userId === user.id
                          )
                            ? COLORS.accent
                            : COLORS.tertiaryDark
                        }
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
