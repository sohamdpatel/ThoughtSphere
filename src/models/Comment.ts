import mongoose,{Schema} from "mongoose";

export interface Icomment{
    _id?: mongoose.Types.ObjectId;
    post_id: string;
    user_id: string;
    comment: string;
    createdAt: Date;
}