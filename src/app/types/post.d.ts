import { Document } from "mongoose";

export interface MutatePost {
    slug: string;
    title: string;
    content: string;
    tags: string[];
    fileLink: string;
}

export interface IPostAuthor {
  _id: mongoose.Types.ObjectId,
  username: string;
  image: string;
}

export interface IPost extends Document{
  authorId: mongoose.Types.ObjectId | IPostAuthor;
  title: string;
  content: string;
  slug: string;
  tags: string[];
  fileLink?: string;
  hasLiked?: boolean;
  likesCount?: number;
  commentsCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}