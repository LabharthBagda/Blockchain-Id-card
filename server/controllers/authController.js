const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const JWT_SECRET = process.env.JWT_SECRET || "student-id-secret-key-2024";

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (username === "admin" && password === "admin123") {
            const token = jwt.sign(
                { id: "1", username: "admin" },
                JWT_SECRET,
                { expiresIn: "24h" }
            );

            return res.json({
                success: true,
                token,
                username: "admin",
            });
        }

        res.status(401).json({ error: "Invalid credentials" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyToken = async (req, res) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ success: true, user: decoded });
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};