import { useQuery } from 'react-query';
import api from '../utils/axiosStore';
import { Post } from '../utils/types/posts';

type Response = {
  posts: Post[];
  totalPosts: number;
};

const fetchPosts = async (token: string, offset: number = 0, limit: number) => {
  const { data } = await api.post(`/posts/getPosts`, {
    token,
    offset: offset,
    limit: 9,
  });
  return data;
};

const usePosts = (token: string, offset: number = 0, limit: number) => {
  return useQuery<Response, Error>(
    ['posts', offset],
    () => fetchPosts(token, offset, limit),
    {
      staleTime: 1000 * 60 * 5,
      cacheTime: 1000 * 60 * 5,
      keepPreviousData: true,
    }
  );
};

export { fetchPosts, usePosts };
