const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

global.inMemoryDb = {
    students: [],
    cards: [],
    transactionLogs: []
};

const authRoutes = require("./routes/auth");
const studentRoutes = require("./routes/students");
const cardRoutes = require("./routes/cards");

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/cards", cardRoutes);

// Transaction logs endpoint
app.get("/api/blockchain/logs", (req, res) => {
    res.json({ success: true, logs: global.inMemoryDb.transactionLogs });
});

// Clear logs
app.post("/api/blockchain/logs/clear", (req, res) => {
    global.inMemoryDb.transactionLogs = [];
    res.json({ success: true, message: "Logs cleared" });
});

app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "Student ID Card System API is running" });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Running in DEMO mode (no MongoDB)");
});

module.exports = app;