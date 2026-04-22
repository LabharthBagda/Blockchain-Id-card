const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "student-id-secret-key-2024";

// Middleware to verify JWT token
module.exports = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({ error: "No token provided" });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid token" });
    }
};