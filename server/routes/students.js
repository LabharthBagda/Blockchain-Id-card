const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const { body } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");

// Get all students (protected)
router.get("/", authMiddleware, studentController.getAllStudents);

// Get dashboard stats (protected)
router.get("/stats", authMiddleware, studentController.getDashboardStats);

// Get student by ID (protected)
router.get("/:id", authMiddleware, studentController.getStudentById);

// Create student (protected)
router.post(
    "/",
    authMiddleware,
    [
        body("studentId").notEmpty().withMessage("Student ID is required"),
        body("fullName").notEmpty().withMessage("Full name is required"),
        body("department").notEmpty().withMessage("Department is required"),
        body("course").notEmpty().withMessage("Course is required"),
        body("year").notEmpty().withMessage("Year is required"),
    ],
    studentController.createStudent
);

// Update student (protected)
router.put(
    "/:id",
    authMiddleware,
    [
        body("fullName").notEmpty().withMessage("Full name is required"),
        body("department").notEmpty().withMessage("Department is required"),
        body("course").notEmpty().withMessage("Course is required"),
        body("year").notEmpty().withMessage("Year is required"),
    ],
    studentController.updateStudent
);

// Deactivate student (protected)
router.delete("/:id", authMiddleware, studentController.deactivateStudent);

module.exports = router;