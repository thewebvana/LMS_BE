const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();
const jwt = require('jsonwebtoken')

const sequelize = require("./config/database")

const userRouter = require("./routes/user");


const app = express();
const PORT = process.env.PORT || 5000

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};


// Middleware
app.use(express.json())
app.use(cors(corsOptions))


// Postgre connection
sequelize
  .sync({ force: false }) // Set to `true` only for development (drops & recreates tables)
  .then(() => console.log("✅ Database & Tables Synced!"))
  .catch((err) => console.error("❌ Sync Error:", err));

// Routes
app.use(userRouter)


// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
