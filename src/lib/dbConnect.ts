import mongoose from "mongoose";

// MongoDB connection URI from environment variables
const MONGODB_URI = process.env.MONGODB_URI!;

// Ensure MONGODB_URI is defined
if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable.");
}

// Cached connection object for Mongoose
// This helps reuse connections in Next.js (development hot-reloading) and serverless environments.
let cached = global.mongoose;

// Initialize cache if it doesn't exist
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function dbConnect() {
  // If a connection already exists, return it
  if (cached.conn) {
    console.log("Using cached MongoDB connection.");
    return cached.conn;
  }

  // If no connection promise exists, create one
  if (!cached.promise) {
    console.log("Creating new MongoDB connection promise...");
    const opts = {
      bufferCommands: true, // Buffer commands while connecting
      maxPoolSize: 10,      // Max concurrent connections in the pool
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => {
      console.log("MongoDB connected successfully.");
      return mongoose.connection;
    });
  }

  // Await the connection promise and store the connection
  try {
    cached.conn = await cached.promise;
  } catch (e: any) {
    // Reset promise on failure to allow new attempts
    cached.promise = null;
    throw new Error(`MongoDB connection error: ${e.message || e}`);
  }

  // Return the established connection
  return cached.conn;
}