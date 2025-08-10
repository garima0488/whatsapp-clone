const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const messageRoutes = require('./routes/messages');


dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', require('./routes/messages'));

app.get("/", (req, res) => {
  res.send("✅ Backend server is running on Render");
});

const PORT = process.env.PORT|| 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
