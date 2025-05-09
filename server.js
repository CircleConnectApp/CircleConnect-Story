const express = require("express");
const dotenv = require("dotenv");
const { connectDB } = require("./config/db");
const cors = require("cors");
const authenticate = require("./middleware/auth"); // ✅

dotenv.config();
const app = express();

connectDB();
app.use(cors());
app.use(express.json());

app.use("/stories", require("./routes/storyRoutes"));

// ✅ Add this
app.get("/protected-route", authenticate, (req, res) => {
  res.json({
    message: "Access granted to protected route",
    user: req.user
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
  console.log(`Story service running on port ${PORT}`);
});
