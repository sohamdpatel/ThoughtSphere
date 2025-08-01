import mongoose, { Schema } from "mongoose";

export interface ILike {
  _id?: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const likeSchema = new Schema<ILike>({
  authorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

likeSchema.index({ postId: 1 });
likeSchema.index({ userId: 1, postId: 1 }, { unique: true });

const Like = mongoose.models?.Like || mongoose.model<ILike>("Like", likeSchema);

export default Like;
