import mongoose,{Schema} from "mongoose";
import slugify from "slugify";

export interface IPost{
    _id?: mongoose.Types.ObjectId;
    authorId: mongoose.Types.ObjectId;
    title: string;
    content: string;
    slug: string;
    tags: string[];
    fileLink: string;
    likes: number;
    latestComment: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

const postSchema = new Schema(
    {
        authorId:{
            type: Schema.Types.ObjectId,
            ref: "User",
            required:true
        },
        title: {
            type: String,
            required: [true, "title is required"],
            trim: true
        },
        content:{
            type:String,
            required:true
        },
        slug: {
            type: String,
            required: true,
            unique: true
        },
        tags:[String],
        fileLink:{
            type:String,
            required:true
        },
        likes:{
            type:Number,
            default:0
        },
        latestComment: {
            type: Schema.Types.ObjectId,
            ref: "Comment",
        }
    },{timestamps: true}
)

postSchema.pre("save", function(next) {
    this.slug = `${slugify(this.title)}_by_${this.authorId}`;
})

const PostModel = mongoose.models?.Post || mongoose.model<IPost>("Post",postSchema)

export default PostModel;

