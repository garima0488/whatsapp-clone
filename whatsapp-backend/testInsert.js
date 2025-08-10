require('dotenv').config();
const { MongoClient } = require('mongodb');

async function run() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB");

    const db = client.db(); // 'whatsapp' from URI
    const result = await db.collection('processed_messages').insertOne({
      text: "Hello MongoDB!",
      timestamp: new Date()
    });

    console.log("Inserted document with ID:", result.insertedId);
  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
  }
}

run();
