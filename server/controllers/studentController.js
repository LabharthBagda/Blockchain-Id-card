const Student = require("../models/Student");
const Card = require("../models/Card");

exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find({ isActive: true });
        res.json({ success: true, count: students.length, students });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findOne({ studentId: req.params.id });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json({ success: true, student });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const { studentId, fullName, department, course, year, profilePhotoUrl, walletAddress } = req.body;

        const existingStudent = await Student.findOne({ studentId });
        if (existingStudent) {
            return res.status(400).json({ error: "Student ID already exists" });
        }

        const newStudent = {
            _id: Date.now().toString(),
            studentId,
            fullName,
            department,
            course,
            year,
            profilePhotoUrl: profilePhotoUrl || "",
            walletAddress: walletAddress || "",
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        global.inMemoryDb.students.push(newStudent);

        res.status(201).json({
            success: true,
            message: "Student created successfully",
            student: newStudent,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const { fullName, department, course, year, profilePhotoUrl, walletAddress } = req.body;

        const index = global.inMemoryDb.students.findIndex(s => s.studentId === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: "Student not found" });
        }

        global.inMemoryDb.students[index] = {
            ...global.inMemoryDb.students[index],
            fullName,
            department,
            course,
            year,
            profilePhotoUrl,
            walletAddress,
            updatedAt: new Date()
        };

        res.json({
            success: true,
            message: "Student updated successfully",
            student: global.inMemoryDb.students[index],
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deactivateStudent = async (req, res) => {
    try {
        const index = global.inMemoryDb.students.findIndex(s => s.studentId === req.params.id);
        if (index === -1) {
            return res.status(404).json({ error: "Student not found" });
        }

        global.inMemoryDb.students[index].isActive = false;

        res.json({
            success: true,
            message: "Student deactivated successfully",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getDashboardStats = async (req, res) => {
    try {
        const totalStudents = await Student.countDocuments({ isActive: true });
        const totalCards = await Card.countDocuments();
        const activeCards = await Card.countDocuments({ isActive: true, isRevoked: false });
        const revokedCards = await Card.countDocuments({ isRevoked: true });

        res.json({
            success: true,
            stats: {
                totalStudents,
                totalIssuedCards: totalCards,
                activeCards,
                revokedCards,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};