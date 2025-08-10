const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  _id: String,
  wa_id: String,
  text: String,
  timestamp: Date,
  status: String,
  name: String,
});

module.exports = mongoose.model('Message', messageSchema, 'processed_messages');

