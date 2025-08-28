import { Document } from "mongoose";

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  postId?: mongoose.Types.ObjectId;
  commentId?: mongoose.Types.ObjectId;
  type: 'like_post' | 'comment_post' | 'reply_comment' | 'like_comment';
  read: boolean;
  createdAt: Date;
}