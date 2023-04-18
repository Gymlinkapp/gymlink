import axios from 'axios';
import { useQuery } from 'react-query';
import api from '../utils/axiosStore';
import { User } from '../utils/users';

type Response = {
  users: User[];
  totalUsers: number;
};

const fetchUsers = async (token: string, offset: number = 0, limit: number) => {
  // const { data } = await api.get(`/users/getNearByUsers?token=${token}`);
  const { data } = await api.post(`/users/findNearUsers`, {
    token,
    offset: offset,
    limit: 9,
  });
  return data;
};

const useUsers = (token: string, offset: number = 0, limit: number) => {
  return useQuery<Response, Error>(
    ['users', offset],
    () => fetchUsers(token, offset, limit),
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
      keepPreviousData: true,
    }
  );
};

export { fetchUsers, useUsers };
