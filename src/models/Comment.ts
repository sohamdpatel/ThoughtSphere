import mongoose, { Schema } from "mongoose";

export interface Icomment {
  _id?: mongoose.Types.ObjectId;
  postId: string;
  authorId: string;
  comment: string;
  likes:[mongoose.Types.ObjectId],
  createdAt: Date;
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
  likes: [{
      type: Schema.Types.ObjectId,
      ref: "User",
  }],
  createdAt: { type: Date, default: Date.now },
});


const Comment = mongoose.models?.Comment || mongoose.model<Icomment>("User", commentSchema);

export default Comment;