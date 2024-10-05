import { MongoClient, ServerApiVersion } from 'mongodb';
// const uri = process.env.MONGODB_URI;
const uri = "";

export const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});