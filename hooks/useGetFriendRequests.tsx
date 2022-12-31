import axios from 'axios';
import { useQuery } from 'react-query';
import api from '../utils/axiosStore';
import { User } from '../utils/users';
import { FriendRequest } from '../utils/types/friendRequest';

const fetchFriendRequests = async (token: string) => {
  const { data } = await api.get(`/social/getFriendRequests/${token}`);
  return data;
};

const useGetFriendRequests = (token: string) => {
  return useQuery<FriendRequest[], Error>(['friendRequests', token], () =>
    fetchFriendRequests(token)
  );
};

export { fetchFriendRequests, useGetFriendRequests };
