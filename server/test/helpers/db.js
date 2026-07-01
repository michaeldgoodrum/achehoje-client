import mongoose from "mongoose";

// Test DB lifecycle. No database mocking — tests run against a real MongoDB.
// By default that's an ephemeral in-memory instance (mongodb-memory-server);
// set MONGO_TEST_URI to run against an existing MongoDB instead (useful in
// environments that can't download the in-memory binary).
let mem;

export const connect = async () => {
  const uri = process.env.MONGO_TEST_URI;
  if (uri) {
    await mongoose.connect(uri);
    return;
  }
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  mem = await MongoMemoryServer.create();
  await mongoose.connect(mem.getUri());
};

export const disconnect = async () => {
  await mongoose.disconnect();
  if (mem) await mem.stop();
};

export const clear = async () => {
  const { collections } = mongoose.connection;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
};
