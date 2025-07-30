import mongoose, { Schema } from "mongoose";

export interface Icomment {
  _id?: mongoose.Types.ObjectId;
  post_id: string;
  user_id: string;
  comment: string;
  createdAt: Date;
}

const commentSchema = new Schema({
  post_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


const Comment = mongoose.models?.Comment || mongoose.model<Icomment>("User", commentSchema);

export default Comment;