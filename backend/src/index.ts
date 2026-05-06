import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import meetingRoutes from "./routes/meeting.routes";
import adminRoutes from "./routes/admin.routes";
import roomRoutes from "./routes/room.routes";

console.log("🔥 FILE STARTED");
console.log("🚀 SERVER FILE STARTED");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/meetings", meetingRoutes);
app.use("/admin", adminRoutes);
app.use("/rooms", roomRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("✅ Backend is running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});