







// src/lib/dbConnect.ts
import mongoose, { Connection, ConnectOptions } from 'mongoose';

function getMongoUri(): string {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('❌ Please define the MONGODB_URI environment variable in your .env file');
  }
  return uri;
}

// ✅ Fix: use optional chaining and type augmentation to avoid TS conflict
declare global {
  // @ts-ignore
  var mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
}

const globalWithMongoose = global as typeof globalThis & {
  mongoose: {
    conn: Connection | null;
    promise: Promise<Connection> | null;
  };
};

// Use cached if exists
let cached = globalWithMongoose.mongoose || { conn: null, promise: null };

// Initialize global mongoose if not set
if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = cached;
}

export async function connectToDatabase(): Promise<Connection> {
  if (cached.conn) return cached.conn;

  const uri = getMongoUri();

  if (!cached.promise) {
    const options: ConnectOptions = {
      bufferCommands: false,
    };
    cached.promise = mongoose.connect(uri, options).then((m) => {
      console.log('✅ Connected to MongoDB Atlas');
      return m.connection;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
