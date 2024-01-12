import { MongoClient } from "mongodb";

if (!process.env.DB_URL) {
  throw new Error('Invalid/Missing environment variable: "DB_URL"');
}

const uri = process.env.DB_URL;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
