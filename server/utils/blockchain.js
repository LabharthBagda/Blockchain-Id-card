const fs = require("fs");
const path = require("path");

let isConnected = false;

async function initBlockchain() {
    try {
        const configPath = path.join(__dirname, "..", "config", "contract-address.json");

        if (!fs.existsSync(configPath)) {
            console.log("Note: Blockchain not available. Running in demo mode.");
            return false;
        }

        console.log("Blockchain: Contract config found but node not running");
        console.log("To enable blockchain: cd blockchain && npm run node (then npm run deploy)");
        isConnected = true;
        return true;
    } catch (error) {
        console.log("Blockchain: Not available, running in demo mode");
        return false;
    }
}

async function issueStudentCard(studentUniqueId, studentName, department, course) {
    return {
        success: true,
        recordId: Math.floor(Math.random() * 10000) + 1,
        txHash: "0x" + Math.random().toString(16).substr(2, 64),
    };
}

async function verifyStudentCard(studentUniqueId) {
    return {
        exists: false,
        isActive: false,
        isRevoked: false,
        issueTimestamp: 0,
        studentName: "",
        department: "",
        course: "",
    };
}

async function revokeStudentCard(studentUniqueId) {
    return {
        success: true,
        txHash: "0x" + Math.random().toString(16).substr(2, 64),
    };
}

async function reactivateStudentCard(studentUniqueId) {
    return {
        success: true,
        txHash: "0x" + Math.random().toString(16).substr(2, 64),
    };
}

async function getTotalCards() {
    return 0;
}

module.exports = {
    initBlockchain,
    issueStudentCard,
    verifyStudentCard,
    revokeStudentCard,
    reactivateStudentCard,
    getTotalCards,
};