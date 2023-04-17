import axios from 'axios';
import { useQuery } from 'react-query';
import api from '../utils/axiosStore';
import { User } from '../utils/users';

const fetchUsers = async (token: string) => {
  // const { data } = await api.get(`/users/getNearByUsers?token=${token}`);
  const { data } = await api.post(`/users/findNearUsers`, {
    token,
    offset: 0,
    limit: 5,
  });
  return data.users;
};

const useUsers = (token: string) => {
  return useQuery<User[], Error>(['users', token], () => fetchUsers(token));
};

export { fetchUsers, useUsers };
