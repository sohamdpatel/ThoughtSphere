import mongoose, { Schema } from "mongoose";

export interface Icomment {
  _id?: mongoose.Types.ObjectId;
  postId: string;
  authorId: string;
  comment: string;
  likes?: number;
  replies?: [mongoose.Types.ObjectId];
  createdAt?: Date;
}

const commentSchema = new Schema({
  postId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: { type: String, required: true },
  likes : {
    type: Number,
    default: 0,
  },
  parentComment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    default: null,
  },
  replyCount: { type: Number, default: 0 }, 
  createdAt: { type: Date, default: Date.now },
});

commentSchema.index({ post: 1, parentComment: 1, createdAt: -1 });
commentSchema.index({ parentComment: 1 });

const Comment =
  mongoose.models?.Comment ||
  mongoose.model<Icomment>("Comment", commentSchema);

export default Comment;



