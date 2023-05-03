import { useInfiniteQuery, useQuery } from 'react-query';
import api from '../utils/axiosStore';
import { Post } from '../utils/types/posts';

type Response = {
  posts: Post[];
  totalPosts: number;
};


const fetchPosts = async (userId: string, cursor: number = 0, limit: number = 9) => {
  const { data } = await api.post('/posts/getPosts', {
    userId,
    cursor,
    limit,
  });
  return data;
};


const usePosts = (userId: string, limit: number = 9) => {
  return useInfiniteQuery(
    'posts',
    ({ pageParam }) => fetchPosts(userId, pageParam, limit),
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        const lastPostIndex = allPages.flatMap(page => page).length - 1;
        return lastPostIndex;
      },
    }
  );
};


export { fetchPosts, usePosts };
