export interface IUser {
  _id?: mongoose.Types.ObjectId;
  username: string;
  fullName: string;
  email: string;
  image: string;  
  password: string;
  role: "user" | "admin";
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}