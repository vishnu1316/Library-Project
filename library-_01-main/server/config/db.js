import dns from 'dns';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../../.env') });

// Some environments have DNS resolver issues resolving MongoDB Atlas SRV records.
// Force Node to use public DNS servers for Atlas lookup.
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

const uri = process.env.MONGODB_URI;

// Try direct connection string as fallback if SRV fails
const directUri = 'mongodb://vishnu_db_user:9676303473@ac-dioyah7-shard-00-00.dlofohl.mongodb.net:27017,ac-dioyah7-shard-00-01.dlofohl.mongodb.net:27017,ac-dioyah7-shard-00-02.dlofohl.mongodb.net:27017/libra_nova_db?ssl=true&replicaSet=atlas-zwdnbd-shard-0&authSource=admin&retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  tls: true,
  tlsAllowInvalidCertificates: true, // Allow invalid certificates as fallback
  tlsAllowInvalidHostnames: true,    // Allow invalid hostnames as fallback
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
});

const connectDB = async () => {
  try {
    // First try SRV connection
    console.log('🔄 Attempting MongoDB Atlas connection (SRV)...');
    await client.connect();

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });

    console.log("✅ MongoDB Connected Successfully!");
    return client.db();
  } catch (srvError) {
    console.log('⚠️ SRV connection failed, trying direct connection...');

    try {
      // Fallback to direct connection
      const directClient = new MongoClient(directUri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
        tls: true,
        tlsAllowInvalidCertificates: true,
        tlsAllowInvalidHostnames: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
      });

      await directClient.connect();
      await directClient.db("admin").command({ ping: 1 });

      console.log("✅ MongoDB Connected Successfully (Direct)!");

      // Replace the client with the working one
      // Note: This is a simple approach - in production you'd want better client management
      return directClient.db();
    } catch (directError) {
      console.error("❌ MongoDB connection error (both SRV and Direct failed):", srvError.message);
      console.log('⚠️ Continuing without MongoDB, using fallback storage instead.');
      return null;
    }
  }
};

export default connectDB;