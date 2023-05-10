import {
  Image,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ChatText, Eye, Flag, Heart, Plus } from "phosphor-react-native";
import { COLORS } from "../utils/colors";
import { usePosts } from "../hooks/usePosts";
import React, { useState } from "react";
import { useAuth } from "../utils/context";
import FeedLoading from "./FeedLoading";
import Loading from "./Loading";
import { Like, Post } from "../utils/types/posts";
import api from "../utils/axiosStore";
import { useMutation, useQueryClient } from "react-query";
import * as Haptics from "expo-haptics";
import Button from "./button";
import Spinner from "./Spinner";
import PostOptionsModal from "./PostOptionsModal";

export const transformPostTag = (post: Post) => {
  const tag = post.tags as unknown as keyof typeof post.tags;
  return tag.charAt(0) + tag.slice(1).toLowerCase();
};
export const tagColor = (post: Post) => {
  const tag = post.tags as unknown as keyof typeof post.tags;
  switch (tag) {
    case "ADVICE":
      return "#724CF9";
    case "QUESTION":
      return "#F9D34C";
    case "GENERAL":
      return "#4CF9CF";
    default:
      return "#724CF9";
  }
};

export const hexToRGBA = (hex: string, alpha: number) => {
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
    <View className="flex-row items-center">
      {icon}
      <Text className="text-secondaryWhite text-xs ml-2 font-ProstoOne">
        {stat}
      </Text>
    </View>
  );
};
export default function PostsFeed({ navigation }: { navigation: any }) {
  const { user } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [flaggedPostId, setFlaggedPostId] = useState("");
  const queryClient = useQueryClient();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = usePosts(user.id);

  const allPosts = React.useMemo(() => {
    if (!data) return [];
    return data.pages.flatMap((page) => page.posts);
  }, [data]);

  console.log("allPosts", allPosts);

  const likePost = useMutation(
    async (postId: string) => {
      const { data } = await api.post(`/posts/likePost`, {
        userId: user.id,
        postId,
      });
      return data;
    },
    {
      onSettled: (data) => {
        queryClient.invalidateQueries("posts");
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
      onSettled: (data) => {
        setModalVisible(false);
        queryClient.invalidateQueries("posts");
      },
    }
  );

  if (isLoading) {
    return <FeedLoading />;
  }

  if (!allPosts.length) {
    <Text>No Posts</Text>;
  }
  return (
    <View className="z-40 px-6 py-12 relative">
      <TouchableOpacity
        onPress={() => {
          setModalVisible(true);
        }}
        className="bg-accent w-16 h-16 rounded-full justify-center items-center absolute top-[75%] right-5 z-50"
      >
        <Plus color="#fff" size={21} weight="fill" />
      </TouchableOpacity>
      <Text className="text-white text-2xl font-ProstoOne my-4">Explore</Text>
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View className="flex-1 justify-end items-end w-full">
          <View className="bg-primaryDark  w-full h-3/4 p-12 rounded-3xl border-[0.5px] border-secondaryDark">
            <Text className="text-white text-2xl font-ProstoOne mb-4">
              Create Post
            </Text>
            <View className="mb-4">
              <TextInput
                onChangeText={(text) => {
                  setPostContent(text);
                }}
                value={postContent}
                placeholder="What is on your mind?"
                placeholderTextColor={COLORS.tertiaryDark}
                multiline
                numberOfLines={4}
                textAlignVertical="top" // This will align the text to the top of the TextInput
                style={{
                  maxHeight: 120,
                  color: COLORS.mainWhite,
                  backgroundColor: COLORS.secondaryDark,
                  borderRadius: 10,
                  paddingHorizontal: 20,
                  paddingVertical: 50,
                  paddingTop: 15,
                  fontFamily: "MontserratRegular",
                }}
              />

              <Button
                isLoading={createPost.isLoading}
                variant="primary"
                className="my-4"
                onPress={() => {
                  createPost.mutate();
                }}
              >
                Create
              </Button>
              <Button
                variant="secondary"
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
        onEndReached={() => {
          console.log("hasNextPage:", hasNextPage);
          console.log("isFetchingNextPage:", isFetchingNextPage);

          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
          console.log("reached end");
        }}
        ListFooterComponent={() => {
          return isFetchingNextPage ? <Loading /> : null;
        }}
        onEndReachedThreshold={0.5}
        data={allPosts}
        renderItem={({ item: post }: { item: Post }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Post", { postId: post.id });
              }}
              className="bg-secondaryDark rounded-3xl p-4 mb-4"
              activeOpacity={1}
            >
              <View className="flex-row justify-between items-center mb-2">
                <View className="flex-col w-full justify-between">
                  <View className="flex-row w-full justify-between items-center">
                    <View className="flex-row items-center">
                      <View className="w-8 h-8 rounded-full overflow-hidden mr-2">
                        <Image
                          source={{
                            uri: post.user?.images[0],
                          }}
                          className="object-cover w-full h-full"
                        />
                      </View>
                      <Text className="text-white text-base font-ProstoOne">
                        {post.user?.firstName}
                      </Text>
                    </View>

                    <View className="flex-row items-center">
                      <Text className="text-tertiaryDark text-xs font-MontserratRegular pr-4">
                        {new Date(post.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      backgroundColor: hexToRGBA(tagColor(post), 0.25),
                    }}
                    className="rounded-full px-2 py-1 my-2 w-1/4 items-center justify-center"
                  >
                    <Text
                      style={{
                        color: tagColor(post),
                      }}
                      className="font-MontserratRegular text-xs"
                    >
                      {post.tags && transformPostTag(post)}
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <Text className="text-secondaryWhite font-MontserratRegular leading-5">
                  {post.content}
                </Text>
              </View>
              <View className="w-full flex-row justify-evenly mt-6">
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
                        weight="fill"
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
                    <Eye size={18} weight="fill" color={COLORS.tertiaryDark} />
                  }
                  stat={post.views?.length}
                />
                <PostStat
                  icon={
                    <ChatText
                      size={18}
                      weight="fill"
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
