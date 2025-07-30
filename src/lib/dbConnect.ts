import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error("Please define a Mongodb uri");
}

let cached = global.mongoose

if (!cached) {
    cached = global.mongoose = {conn: null, promise: null};
}

export default async function dbConnect() {
    if (cached.conn) {
        return cached.conn
    }

    if (!cached.promise) {
        const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
    }

    try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    cached.promise = null;
    throw new Error(e);
  }

  return cached.conn;
}