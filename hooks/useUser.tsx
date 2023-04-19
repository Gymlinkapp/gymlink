import axios from 'axios';
import { useQuery } from 'react-query';
import api from '../utils/axiosStore';
import { User } from '../utils/users';

const fetchUser = async (token: string) => {
  const { data } = await api.post('/users/getByToken', { token });
  return data.user;
};

const useUser = (token: string) => {
  return useQuery<User, Error>(['user', token], () => fetchUser(token), {
    enabled: !!token,

    // could be okay, but not sure on long term/with more data

    // was the solution to help chats and messages update
    // staleTime: 1000,
    // refetchInterval: 1000,
  });
};

export { fetchUser, useUser };
