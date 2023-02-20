import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUser } from '../hooks/useUser';
import Layout from '../layouts/layout';
import { useGetFriendRequests } from '../hooks/useGetFriendRequests';
import Loading from '../components/Loading';
import { useEffect, useRef, useState } from 'react';
import { FriendRequest } from '../utils/types/friendRequest';
import { useUserById } from '../hooks/useUserById';
import {
  ArrowArcLeft,
  ArrowLeft,
  Bell,
  CaretLeft,
  Check,
  X,
} from 'phosphor-react-native';
import { truncate } from '../utils/ui';
import { useMutation, useQueryClient } from 'react-query';
import api from '../utils/axiosStore';
import EmptyScreen from '../components/EmptyScreen';
import {
  RectButton,
  TouchableOpacity as RNGHOpacity,
} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';

function Notification({
  friendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  navigation,
}: {
  friendRequest: FriendRequest;
  acceptFriendRequest: any;
  declineFriendRequest: any;
  navigation: any;
}) {
  const {
    data: fromUser,
    isError: isFromUserError,
    isLoading: isFromUserLoading,
  } = useUserById(friendRequest.fromUserId);

  const renderRightActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 50, 100, 101],
      outputRange: [0, 0, 0, 1],
    });

    return (
      <RectButton>
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              width: 100,
              height: '100%',
              transform: [{ translateX: trans }],
            },
          ]}
        >
          <RNGHOpacity
            className='bg-white p-4 rounded-full'
            onPress={() => {
              acceptFriendRequest.mutate({
                friendRequestId: friendRequest.id,
              });
            }}
          >
            <Check color='#000' weight='fill' />
          </RNGHOpacity>
          <RNGHOpacity
            className='bg-primarydark p-4 rounded-full'
            onPress={() => {
              declineFriendRequest.mutate({
                friendRequestId: friendRequest.id,
              });
            }}
          >
            <X color='#fff' weight='fill' />
          </RNGHOpacity>
        </Animated.View>
      </RectButton>
    );
  };

  if (isFromUserLoading) return <Loading />;
  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View className='w-full flex bg-secondaryDark p-4 rounded-2xl'>
        {/* Type of notification -- for now just friend requests */}
        <Text className='text-secondaryWhite pb-4 font-MontserratBold text-sm'>
          Friend Request
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Profile', { user: fromUser, isFriend: true })
          }
        >
          <View className='w-full flex flex-row items-center'>
            <Image
              source={{ uri: fromUser.images[0] }}
              className='h-16 w-16 rounded-full mr-4'
            />
            <View className='flex-col h-full'>
              <Text className='text-white text-2xl'>
                {fromUser?.firstName} {fromUser?.lastName}
              </Text>
              <Text className='text-secondaryWhite text-sm'>
                {truncate(fromUser.bio, 30)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </Swipeable>
  );
}

export default function NotificationScreen({ navigation, route }) {
  const queryClient = useQueryClient();

  const { height } = Dimensions.get('window');
  const { token } = route.params;

  const declineFriendRequest = useMutation(
    async ({ friendRequestId }: { friendRequestId: string }) => {
      const { data } = await api.post(`/social/declineFriendRequest`, {
        friendRequestId,
      });
      return data;
    },
    {
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries('friendRequests');
      },
    }
  );

  const acceptFriendRequest = useMutation(
    async ({ friendRequestId }: { friendRequestId: string }) => {
      const { data } = await api.post(`/social/acceptFriendRequest`, {
        friendRequestId,
      });
      return data;
    },
    {
      onSuccess: (data) => {
        console.log(data);
        queryClient.invalidateQueries('friendRequests');
        queryClient.invalidateQueries('users');
        queryClient.invalidateQueries('friends');
      },
    }
  );

  const {
    data: friendRequests,
    isLoading: isFriendRequestsLoading,
    error: friendRequestsError,
  } = useGetFriendRequests(token);

  if (isFriendRequestsLoading) return <Loading />;

  if (friendRequests?.length === 0) {
    return (
      <View className='mt-20 px-4'>
        <TouchableOpacity
          className='flex-row items-center bg-secondaryDark w-24 mb-4 justify-center rounded-full py-2'
          onPress={() => navigation.goBack()}
        >
          <CaretLeft color='#fff' weight='regular' />
          <Text className='text-white'>Back</Text>
        </TouchableOpacity>
        <EmptyScreen
          icon={<Bell color='rgb(204,201,201)' weight='fill' />}
          text='No notifications right now!'
        />
      </View>
    );
  }

  return (
    <SafeAreaView>
      <View className='p-4'>
        <View className='pt-4 pb-6'>
          <TouchableOpacity
            className='flex-row items-center bg-secondaryDark w-24 mb-4 justify-center rounded-full py-2'
            onPress={() => navigation.goBack()}
          >
            <CaretLeft color='#fff' weight='regular' />
            <Text className='text-white'>Back</Text>
          </TouchableOpacity>
          <Text className='text-2xl font-MontserratBold text-primaryWhite'>
            Notifications
          </Text>
          <Text className='text-base font-MontserratRegular text-secondaryWhite'>
            See your friend requests, messages, and more here!
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ height: height, paddingBottom: 500 }}
        >
          {friendRequests?.map((request) => (
            <Notification
              friendRequest={request}
              acceptFriendRequest={acceptFriendRequest}
              declineFriendRequest={declineFriendRequest}
              navigation={navigation}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
