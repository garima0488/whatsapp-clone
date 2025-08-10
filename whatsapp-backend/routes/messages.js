
const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

// GET /api/chats - list distinct wa_id with last message and timestamp
router.get('/chats', async (req, res) => {
  try {
    const chats = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: {
          _id: "$wa_id",
          name: { $first: "$name" },
          lastMessage: { $first: "$text" },
          lastTimestamp: { $first: "$timestamp" },
          lastStatus: { $first: "$status" }
      }},
      { $sort: { lastTimestamp: -1 } }
    ]);
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/chats/:wa_id/messages - list messages for a chat
router.get('/chats/:wa_id/messages', async (req, res) => {
  try {
    const wa_id = req.params.wa_id;
    const messages = await Message.find({ wa_id }).sort({ timestamp: 1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST /api/chats/:wa_id/messages - create outgoing message (store only)
router.post('/chats/:wa_id/messages', async (req, res) => {
  try {
    const wa_id = req.params.wa_id;
    const { text, name } = req.body;
    const id = Date.now().toString();

    const message = new Message({
      _id: id,
      wa_id,
      name: name || wa_id,
      text,
      timestamp: new Date(),
      status: "sent",
    });
    await message.save();
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//PATCH /api/messages/:id/status - update status of a message
router.patch('/messages/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const msg = await Message.findByIdAndUpdate(id, { status }, { new: true });
    if (!msg) return res.status(404).json({ error: "Message not found" });
    res.json(msg);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
