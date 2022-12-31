import axios from 'axios';
import { useMutation, useQuery } from 'react-query';
import api from '../utils/axiosStore';
import { User } from '../utils/users';
import { Gym } from '../utils/types/gym';
import { FriendRequest } from '../utils/types/friendRequest';

// create a reusable mutation hook for sending friend requests
const useSendFriendRequest = useMutation(
  async ({
    fromUserId,
    toUserId,
  }: {
    toUserId: string;
    fromUserId: string;
  }) => {
    const { data } = await api.post(`/social/sendFriendRequest`, {
      toUserId,
      fromUserId,
    });
    return data;
  },
  {
    onSuccess: (data) => {
      console.log(data);
    },
  }
);

export { useSendFriendRequest };
