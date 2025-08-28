import { INotification } from "@/app/types/Notification";
import mongoose, { Schema } from "mongoose";



const notificationSchema = new Schema<INotification>({
  recipientId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true, 
  },
  senderId: {
    type: Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
  },
  type: {
    type: String,
    enum: ['like_post', 'comment_post', 'reply_comment', 'like_comment'],
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.models.Notification || mongoose.model<INotification>("Notification", notificationSchema);

export default Notification;
 