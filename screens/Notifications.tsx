import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useUser } from '../hooks/useUser';
import Layout from '../layouts/layout';
import { useGetFriendRequests } from '../hooks/useGetFriendRequests';
import Loading from '../components/Loading';
import { useEffect, useState } from 'react';
import { FriendRequest } from '../utils/types/friendRequest';
import { useUserById } from '../hooks/useUserById';
import { Check, X } from 'phosphor-react-native';
import { truncate } from '../utils/ui';
import { useMutation, useQueryClient } from 'react-query';
import api from '../utils/axiosStore';

function Notification({ friendRequest }: { friendRequest: FriendRequest }) {
  const queryClient = useQueryClient();

  const {
    data: fromUser,
    isError: isFromUserError,
    isLoading: isFromUserLoading,
  } = useUserById(friendRequest.fromUserId);
  console.log(fromUser);
  if (isFromUserLoading) return <Loading />;

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
      },
    }
  );
  return (
    <View className='w-full bg-secondaryDark p-6 rounded-2xl'>
      <Image
        source={{ uri: fromUser.images[0] }}
        className='w-full h-1/2 rounded-lg'
      />
      <View className='flex-col h-full items-center w-full pt-6'>
        {/* Type of notification -- for now just friend requests */}
        <Text className='text-secondaryWhite font-MontserratBold text-sm'>
          Friend Request
        </Text>
        <Text className='text-white text-2xl'>
          {fromUser?.firstName} {fromUser?.lastName}
        </Text>
        <Text className='text-secondaryWhite text-sm text-center'>
          {truncate(fromUser.bio, 100)}
        </Text>
        <View className='flex-row pt-12'>
          <TouchableOpacity
            className='bg-tertiaryDark p-4 rounded-full mx-1'
            onPress={() => {
              acceptFriendRequest.mutate({
                friendRequestId: friendRequest.id,
              });
            }}
          >
            <Check color='#fff' weight='fill' />
          </TouchableOpacity>
          <TouchableOpacity
            className='bg-primaryDark p-4 rounded-full mx-1'
            onPress={() => {
              declineFriendRequest.mutate({
                friendRequestId: friendRequest.id,
              });
            }}
          >
            <X color='#fff' weight='fill' />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function NotificationScreen({ navigation, route }) {
  const screenHeight = Dimensions.get('window').height;

  const { token } = route.params;

  const {
    data: user,
    isLoading: isUserLoading,
    error: userError,
  } = useUser(token);

  if (isUserLoading) return <Loading />;
  const {
    data: friendRequests,
    isLoading: isFriendRequestsLoading,
    error: friendRequestsError,
  } = useGetFriendRequests(user.id);
  if (isFriendRequestsLoading) return <Loading />;

  return (
    // <ScrollView className='h-full'>
    //   {friendRequests.map((request) => (
    //     <Notification friendRequest={request} />
    //   ))}
    // </ScrollView>
    <FlatList
      className=' relative h-full'
      contentInsetAdjustmentBehavior='automatic'
      style={{ paddingHorizontal: 16 }}
      data={friendRequests}
      renderItem={({ item }) => <Notification friendRequest={item} />}
      keyExtractor={(item) => item.id}
    />
  );
}
