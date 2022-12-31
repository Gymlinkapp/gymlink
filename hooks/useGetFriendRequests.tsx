import axios from 'axios';
import { useQuery } from 'react-query';
import api from '../utils/axiosStore';
import { User } from '../utils/users';
import { FriendRequest } from '../utils/types/friendRequest';

const fetchFriendRequests = async (userId: string) => {
  const { data } = await api.get(`/social/getFriendRequests/${userId}`);
  return data;
};

const useGetFriendRequests = (userId: string) => {
  return useQuery<FriendRequest[], Error>(['friendRequests', userId], () =>
    fetchFriendRequests(userId)
  );
};

export { fetchFriendRequests, useGetFriendRequests };
