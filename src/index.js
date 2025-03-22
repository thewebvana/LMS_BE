require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const configRoutes = require("./routes/configRoutes");

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "https://lms-fe-chi.vercel.app"], 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "token", "toastId"],
    credentials: true, 
  })
);
app.use(express.json());

app.use("/lms/api/auth", authRoutes);
app.use("/lms/api/config", configRoutes);
app.use("/lms/api", userRoutes);

app.get("/", (req, res) => {
  res.send("LMS API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
