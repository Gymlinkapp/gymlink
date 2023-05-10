import {
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../utils/axiosStore";
import { useEffect, useState } from "react";
import { useAuth } from "../utils/context";
import { useMutation, useQueryClient } from "react-query";
import {
  ChatText,
  DotsThree,
  Eye,
  Heart,
  PaperPlaneRight,
} from "phosphor-react-native";
import { COLORS } from "../utils/colors";
import {
  PostStat,
  hexToRGBA,
  tagColor,
  transformPostTag,
} from "../components/PostsFeed";
import { usePost } from "../hooks/usePost";
import Loading from "../components/Loading";
import * as Progress from "react-native-progress";
import * as Haptics from "expo-haptics";
import PostOptionsModal from "../components/PostOptionsModal";
import Spinner from "../components/Spinner";
import CommentOptionsModal from "../components/CommentOptionsModal";

export default function PostScreen({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) {
  const { postId }: { postId: string } = route.params;
  const { data, isLoading } = usePost(postId);
  const [postOptionsModalVisable, setPostOptionsModalVisable] = useState(false);
  const [commentOptions, setCommentOptions] = useState(false);
  const [commentId, setCommentId] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data && !isLoading) {
      api.post("/posts/viewPost", {
        userId: user.id,
        postId: postId,
      });
    }

    queryClient.invalidateQueries("post");
    queryClient.invalidateQueries("posts");
  }, []);

  const flagPost = useMutation(
    async (postId: string) => {
      const { data } = await api.post(`/posts/flagPost`, {
        userId: user.id,
        postId,
      });
      return data;
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries("posts");
        navigation.goBack();
      },
    }
  );

  const flagComment = useMutation(
    async (commentId: string) => {
      const { data } = await api.post(`/posts/flagPostComment`, {
        commentId: commentId
      });
      return data;
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries("post");
      },
    }
  );
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
        queryClient.invalidateQueries("posts");
      },
    }
  );

  const [comment, setComment] = useState("");

  const shareComment = useMutation(
    async () => {
      const { data } = await api.post(`/posts/postComment`, {
        userId: user.id,
        postId: postId,
        comment,
      });
      return data;
    },
    {
      onSuccess: (data) => {
        Keyboard.dismiss();
        setComment("");
        queryClient.invalidateQueries("post");
        queryClient.invalidateQueries("posts");
      },
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <PostOptionsModal
        setModalVisible={setPostOptionsModalVisable}
        modalVisible={postOptionsModalVisable}
        flagPost={flagPost}
        postId={postId}
      />
      <CommentOptionsModal
        setModalVisible={setCommentOptions}
        modalVisible={commentOptions}
        flagComment={flagComment}
        commentId={commentId}
      />
      <SafeAreaView className="mx-8 flex-1">
        <View className="flex-row items-center w-full justify-between">
          <View className="flex-col">
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Profile", {
                  user: data.post.user,
                });
              }}
              className="my-8"
            >
              <View className="w-12 h-12 rounded-full overflow-hidden mr-2">
                <Image
                  source={{
                    uri: data.post.user.images[0],
                  }}
                  className="object-cover w-full h-full"
                />
              </View>
              <Text className="text-white font-ProstoOne text-xl">
                {data.post.user.firstName} {data.post.user.lastName}
              </Text>
            </TouchableOpacity>
          </View>
          {flagPost.isLoading && <Spinner />}
          {!flagPost.isLoading && (
            <TouchableOpacity
              onPress={() =>
                setPostOptionsModalVisable(!postOptionsModalVisable)
              }
            >
              <DotsThree
                color={COLORS.secondaryWhite}
                weight="regular"
                size={32}
              />
            </TouchableOpacity>
          )}
        </View>
        <View
          style={{
            backgroundColor: hexToRGBA(tagColor(data.post), 0.25),
          }}
          className="rounded-full px-2 py-1 mb-2 items-center justify-center w-1/4"
        >
          <Text
            style={{
              color: tagColor(data.post),
            }}
            className="font-MontserratRegular text-xs"
          >
            {transformPostTag(data.post)}
          </Text>
        </View>

        <Text className="text-secondaryWhite font-MontserratRegular">
          {data.post.content}
        </Text>

        <View className="w-full flex-row justify-evenly mt-6 border-b-2 border-secondaryDark pb-6">
          <TouchableOpacity
            onPress={() => {
              likePost.mutate(postId);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <PostStat
              icon={
                <Heart
                  size={18}
                  weight="fill"
                  color={
                    data.post.likes?.find((like) => like.userId === user.id)
                      ? COLORS.accent
                      : COLORS.tertiaryDark
                  }
                />
              }
              stat={data.post.likes?.length}
            />
          </TouchableOpacity>
          <PostStat
            icon={<Eye size={18} weight="fill" color={COLORS.tertiaryDark} />}
            stat={data.post.views?.length}
          />
          <PostStat
            icon={
              <ChatText size={18} weight="fill" color={COLORS.tertiaryDark} />
            }
            stat={data.post.comments?.length}
          />
        </View>

        <View className="flex-1">
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {data.post.comments?.map((comment) => (

              <View
                className="w-full my-4 border-b-2 py-6 border-secondaryDark"
                key={comment.id}
              >
                <View className="flex-row items-center justify-between">

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate("Profile", {
                      user: comment.user,
                    });
                  }}
                  className="flex-row items-center"
                >
                  <View className="w-6 h-6 rounded-full overflow-hidden mr-2">
                    <Image
                      source={{
                        uri: comment.user?.images[0],
                      }}
                      className="object-cover w-full h-full"
                    />
                  </View>

                  <Text className="text-white font-ProstoOne text-sm">
                    {comment.user?.firstName} {comment.user?.lastName}
                  </Text>
                </TouchableOpacity>

          {flagComment.isLoading && <Spinner />}
          {!flagComment.isLoading && (
            <TouchableOpacity
              onPress={() => {
                        setCommentId(comment.id)
                setCommentOptions(!commentOptions)
                      }
              }
            >
              <DotsThree
                color={COLORS.secondaryWhite}
                weight="regular"
                size={24}
              />
            </TouchableOpacity>
          )}
                </View>
                <View className="flex-col">
                  <Text className="text-secondaryWhite font-MontserratRegular">
                    {comment.content}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        <View className="mb-4">
          <View className="flex-row items-center">
            <TextInput
              className="w-full flex-1 p-4 rounded-full bg-secondaryDark text-white font-MontserratRegular"
              placeholder="Post a comment"
              placeholderTextColor={COLORS.tertiaryDark}
              onChangeText={(text) => setComment(text)}
              value={comment}
            />
            <TouchableOpacity
              onPress={() => {
                shareComment.mutate();
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="flex-[0.05] ml-4"
            >
              {shareComment.isLoading ? (
                <Progress.Circle
                  size={18}
                  indeterminate={true}
                  color={COLORS.mainWhite}
                  shouldRasterizeIOS
                />
              ) : (
                <PaperPlaneRight
                  color="#CCC9C9"
                  weight="regular"
                  size={18}
                  style={{
                    flex: 0.25,
                  }}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
