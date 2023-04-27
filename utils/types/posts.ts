import { User } from '../users';
import { Gym } from './gym';

export type Post = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  userId: string;
  user: User;
} & {
  user: {
    gym: Gym | null;
    id: string;
    firstName: string;
    lastName: string;
    images: string[];
  };
  likes: Like[];
  views: View[];
  comments: Comment[];
};

export type Like = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  postId: string;
};

export type View = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  postId: string;
};
export type Comment = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  content: string;
  userId: string;
  postId: string;
  user: User;
};
