import { useQuery } from 'react-query';
import api from '../utils/axiosStore';
import { Post } from '../utils/types/posts';

type Response = {
  post: Post;
};

const fetchPost = async (postId: string) => {
  const { data } = await api.post(`/posts/getPost`, {
    postId,
  });
  return data;
};

const usePost = (postId: string) => {
  return useQuery<Response, Error>(['post', postId], () => fetchPost(postId));
};

export { fetchPost, usePost };
