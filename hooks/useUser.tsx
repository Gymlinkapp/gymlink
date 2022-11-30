import { useQuery } from 'react-query';
import api from '../utils/axiosStore';
import { User } from '../utils/users';

const fetchUser = async (token: string) => {
  const { data } = await api.get(`/users/${token}`);
  return data;
};

const useUser = (token: string) => {
  return useQuery<User, Error>('user', () => fetchUser(token));
};

export { fetchUser, useUser };
