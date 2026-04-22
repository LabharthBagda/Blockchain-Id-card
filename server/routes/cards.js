const express = require("express");
const router = express.Router();
const cardController = require("../controllers/cardController");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");

// Get all cards (protected)
router.get("/", authMiddleware, cardController.getAllCards);

// Get card by student ID (protected)
router.get("/student/:studentId", authMiddleware, cardController.getCardByStudentId);

// Verify card (public)
router.get("/verify/:studentId", cardController.verifyCard);

// Issue card (protected)
router.post(
    "/issue",
    authMiddleware,
    [body("studentId").notEmpty().withMessage("Student ID is required")],
    cardController.issueCard
);

// Revoke card (protected)
router.post(
    "/revoke",
    authMiddleware,
    [body("studentId").notEmpty().withMessage("Student ID is required")],
    cardController.revokeCard
);

module.exports = router;