import mongoose, { Schema } from "mongoose";
import slugify from "slugify";
import { IPost } from "@/app/types/post";


const postSchema = new Schema<IPost>(
  {
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: [true, "slug is required"],
      unique: true,
      trim: true,
    },
    tags: [String],
    fileLink: {
      type: String,
    },
    likesCount: {
      type: Number,
      default: 0,
    },
    commentsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

postSchema.pre("validate", function (next) {
  if (this.isNew) {
    console.log("this is when title modified and validate")
    
    this.slug = `${slugify(this.title,{lower: true,})}_by_${this.authorId}`;
    console.log("this is slug", this.slug);
    
  }
  next();
});

const Post =
  mongoose.models?.Post || mongoose.model<IPost>("Post", postSchema);

export default Post;
