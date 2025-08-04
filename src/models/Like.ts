import mongoose, { Schema } from "mongoose";

export interface ILike {
  _id?: mongoose.Types.ObjectId;
  authorId: mongoose.Types.ObjectId;
  postId?: mongoose.Types.ObjectId;
  commentId?: mongoose.Types.ObjectId;
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
  },
  commentId: {
    type: Schema.Types.ObjectId,
    ref: "Comment", // CORRECTED: Changed ref from "Post" to "Comment"
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Use custom validation to ensure a document has either a postId OR a commentId, but not both.
likeSchema.pre("validate", function (next) {
  if (this.postId && this.commentId) {
    next(new Error("A like cannot be for both a post and a comment."));
  } else if (!this.postId && !this.commentId) {
    next(new Error("A like must be for either a post or a comment."));
  } else {
    next();
  }
});

// A unique compound index to prevent a user from liking the same post twice.
likeSchema.index(
  { authorId: 1, postId: 1 },
  { unique: true, partialFilterExpression: { postId: { $exists: true } } }
);

// A unique compound index to prevent a user from liking the same comment twice.
likeSchema.index(
  { authorId: 1, commentId: 1 },
  { unique: true, partialFilterExpression: { commentId: { $exists: true } } }
);

const Like = mongoose.models?.Like || mongoose.model<ILike>("Like", likeSchema);

export default Like;
