const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Your MongoDB URI
const uri = "mongodb+srv://garimasehgal2003:AE288q1aXkdcNE1N@cluster0.2rqlddv.mongodb.net/whatsapp?retryWrites=true&w=majority&appName=Cluster0";
const payloadsDir = path.join(__dirname, "payloads");

async function importPayloads() {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const files = fs.readdirSync(payloadsDir).filter(file => file.endsWith(".json"));

        let insertedCount = 0;
        let updatedCount = 0;

        const collection = client.db("whatsapp").collection("processed_messages");

        for (const file of files) {
            const filePath = path.join(payloadsDir, file);
            const fileData = fs.readFileSync(filePath, "utf8");
            const payload = JSON.parse(fileData);

            // Extract messages from payload
            if (
                payload.metaData &&
                Array.isArray(payload.metaData.entry)
            ) {
                for (const entry of payload.metaData.entry) {
                    if (
                        Array.isArray(entry.changes)
                    ) {
                        for (const change of entry.changes) {
                            if (
                                change.field === "messages" &&
                                change.value &&
                                Array.isArray(change.value.messages)
                            ) {
                                for (const msg of change.value.messages) {
                                    const messageDoc = {
                                        _id: msg.id,
                                        wa_id: msg.from,
                                        text: msg.text ? msg.text.body : "",
                                        timestamp: msg.timestamp ? new Date(Number(msg.timestamp) * 1000) : null,
                                        status: "sent",
                                        name: change.value.contacts && change.value.contacts[0] && change.value.contacts[0].profile ? change.value.contacts[0].profile.name : "",
                                    };
                                    const result = await collection.updateOne(
                                        { _id: messageDoc._id },
                                        { $set: messageDoc },
                                        { upsert: true }
                                    );
                                    if (result.upsertedCount > 0) insertedCount++;
                                    else if (result.modifiedCount > 0) updatedCount++;
                                }
                            }
                        }
                    }
                }
            }
        }

        console.log(`✅ ${insertedCount} messages inserted, ${updatedCount} updated successfully!`);
    } catch (err) {
        console.error("❌ Error importing payloads:", err);
    } finally {
        await client.close();
        console.log("🔌 MongoDB connection closed");
    }
}
importPayloads();