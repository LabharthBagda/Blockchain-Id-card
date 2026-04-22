const Card = require("../models/Card");
const Student = require("../models/Student");
const blockchain = require("../utils/blockchain");

function logTransaction(type, data) {
    global.inMemoryDb.transactionLogs.unshift({
        id: Date.now(),
        type,
        data,
        timestamp: new Date().toISOString()
    });
    // Keep only last 50 logs
    if (global.inMemoryDb.transactionLogs.length > 50) {
        global.inMemoryDb.transactionLogs.pop();
    }
}

exports.issueCard = async (req, res) => {
    try {
        const { studentId } = req.body;

        const student = await Student.findOne({ studentId });
        if (!student) {
            return res.status(404).json({ error: "Student not found or inactive" });
        }

        const existingCard = global.inMemoryDb.cards.find(c => c.studentId === student._id);
        if (existingCard) {
            return res.status(400).json({ error: "Card already issued for this student" });
        }

        const blockchainResult = await blockchain.issueStudentCard(
            student.studentId,
            student.fullName,
            student.department,
            student.course
        );

        const newCard = {
            _id: Date.now().toString(),
            studentId: student._id,
            studentUniqueId: student.studentId,
            blockchainRecordId: blockchainResult.recordId || Math.floor(Math.random() * 1000) + 1,
            blockchainTxHash: blockchainResult.txHash || "0x" + Math.random().toString(16).substr(2, 64),
            issueTimestamp: Date.now(),
            isActive: true,
            isRevoked: false,
            createdAt: new Date()
        };

        global.inMemoryDb.cards.push(newCard);

        logTransaction("ISSUE", {
            studentId: student.studentId,
            studentName: student.fullName,
            department: student.department,
            recordId: newCard.blockchainRecordId,
            txHash: newCard.blockchainTxHash,
            timestamp: newCard.issueTimestamp
        });

        res.status(201).json({
            success: true,
            message: "Student ID card issued successfully",
            card: newCard,
            student: {
                fullName: student.fullName,
                studentId: student.studentId,
                department: student.department,
                course: student.course,
            },
            blockchain: {
                recordId: newCard.blockchainRecordId,
                txHash: newCard.blockchainTxHash,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.revokeCard = async (req, res) => {
    try {
        const { studentId } = req.body;

        const student = await Student.findOne({ studentId });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        const cardIndex = global.inMemoryDb.cards.findIndex(c => c.studentId === student._id);
        if (cardIndex === -1) {
            return res.status(404).json({ error: "No card found for this student" });
        }

        if (global.inMemoryDb.cards[cardIndex].isRevoked) {
            return res.status(400).json({ error: "Card already revoked" });
        }

        await blockchain.revokeStudentCard(student.studentId);

        global.inMemoryDb.cards[cardIndex].isRevoked = true;
        global.inMemoryDb.cards[cardIndex].isActive = false;
        global.inMemoryDb.cards[cardIndex].revokedAt = new Date();

        logTransaction("REVOKE", {
            studentId: student.studentId,
            studentName: student.fullName,
            recordId: global.inMemoryDb.cards[cardIndex].blockchainRecordId,
            txHash: "0x" + Math.random().toString(16).substr(2, 64),
            timestamp: Date.now()
        });

        res.json({
            success: true,
            message: "Student ID card revoked successfully",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.verifyCard = async (req, res) => {
    try {
        const { studentId } = req.params;

        const card = global.inMemoryDb.cards.find(c => c.studentUniqueId === studentId);
        const student = await Student.findOne({ studentId });

        if (!card && !student) {
            return res.json({
                success: true,
                verified: false,
                status: "NOT_FOUND",
                message: "No record found for this student ID",
            });
        }

        let status = "NOT_FOUND";
        if (card) {
            status = card.isRevoked ? "REVOKED" : "ACTIVE";
            
            logTransaction("VERIFY", {
                studentId: studentId,
                status: status,
                timestamp: Date.now()
            });
        }

        res.json({
            success: true,
            verified: !!card,
            status,
            studentId,
            studentName: student?.fullName || "",
            department: student?.department || "",
            course: student?.course || "",
            issueTimestamp: card ? Math.floor(card.issueTimestamp / 1000) : 0,
            isActive: card?.isActive || false,
            isRevoked: card?.isRevoked || false,
            blockchainVerified: false,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAllCards = async (req, res) => {
    try {
        const cards = global.inMemoryDb.cards;
        res.json({ success: true, count: cards.length, cards });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCardByStudentId = async (req, res) => {
    try {
        const student = await Student.findOne({ studentId: req.params.studentId });
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }

        const card = global.inMemoryDb.cards.find(c => c.studentId === student._id);
        if (!card) {
            return res.status(404).json({ error: "No card found for this student" });
        }

        res.json({
            success: true,
            card,
            student: {
                fullName: student.fullName,
                studentId: student.studentId,
                department: student.department,
                course: student.course,
                year: student.year,
                profilePhotoUrl: student.profilePhotoUrl,
            },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};