// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract StudentIDCard {
    // Struct to store student card data
    struct Card {
        string studentUniqueId;
        string studentName;
        string department;
        string course;
        uint256 issueTimestamp;
        bool isActive;
        bool isRevoked;
    }

    // Mapping from blockchain record ID to Card struct
    mapping(uint256 => Card) private cards;

    // Mapping from student unique ID to blockchain record ID
    mapping(string => uint256) private studentIdToRecordId;

    // Counter for generating unique blockchain record IDs
    uint256 private recordCounter;

    // Event to emit when a student card is issued
    event CardIssued(
        uint256 indexed recordId,
        string indexed studentUniqueId,
        string studentName,
        uint256 timestamp
    );

    // Event to emit when a student card is revoked
    event CardRevoked(
        uint256 indexed recordId,
        string indexed studentUniqueId,
        uint256 timestamp
    );

    // Event to emit when a student card is activated (reactivated)
    event CardActivated(
        uint256 indexed recordId,
        string indexed studentUniqueId,
        uint256 timestamp
    );

    constructor() {
        recordCounter = 0;
    }

    // Function to issue a new student ID card
    function issueStudentCard(
        string memory _studentUniqueId,
        string memory _studentName,
        string memory _department,
        string memory _course
    ) public returns (uint256) {
        // Check if student ID already exists
        require(
            studentIdToRecordId[_studentUniqueId] == 0,
            "Student ID already exists"
        );

        // Increment record counter
        recordCounter++;

        // Create the card
        cards[recordCounter] = Card({
            studentUniqueId: _studentUniqueId,
            studentName: _studentName,
            department: _department,
            course: _course,
            issueTimestamp: block.timestamp,
            isActive: true,
            isRevoked: false
        });

        // Map student ID to record ID
        studentIdToRecordId[_studentUniqueId] = recordCounter;

        // Emit event
        emit CardIssued(recordCounter, _studentUniqueId, _studentName, block.timestamp);

        return recordCounter;
    }

    // Function to verify a student card
    function verifyStudentCard(
        string memory _studentUniqueId
    )
        public
        view
        returns (
            bool exists,
            bool isActive,
            bool isRevoked,
            uint256 issueTimestamp,
            string memory studentName,
            string memory department,
            string memory course
        )
    {
        uint256 recordId = studentIdToRecordId[_studentUniqueId];

        if (recordId == 0) {
            return (false, false, false, 0, "", "", "");
        }

        Card memory card = cards[recordId];
        return (
            true,
            card.isActive,
            card.isRevoked,
            card.issueTimestamp,
            card.studentName,
            card.department,
            card.course
        );
    }

    // Function to revoke a student card
    function revokeStudentCard(string memory _studentUniqueId) public returns (bool) {
        uint256 recordId = studentIdToRecordId[_studentUniqueId];

        require(recordId > 0, "Student ID does not exist");
        require(!cards[recordId].isRevoked, "Card already revoked");

        cards[recordId].isRevoked = true;
        cards[recordId].isActive = false;

        emit CardRevoked(recordId, _studentUniqueId, block.timestamp);

        return true;
    }

    // Function to reactivate a student card
    function reactivateStudentCard(string memory _studentUniqueId) public returns (bool) {
        uint256 recordId = studentIdToRecordId[_studentUniqueId];

        require(recordId > 0, "Student ID does not exist");
        require(cards[recordId].isRevoked, "Card is not revoked");

        cards[recordId].isRevoked = false;
        cards[recordId].isActive = true;

        emit CardActivated(recordId, _studentUniqueId, block.timestamp);

        return true;
    }

    // Function to get card details by record ID
    function getCardByRecordId(
        uint256 _recordId
    )
        public
        view
        returns (
            string memory studentUniqueId,
            string memory studentName,
            string memory department,
            string memory course,
            uint256 issueTimestamp,
            bool isActive,
            bool isRevoked
        )
    {
        Card memory card = cards[_recordId];
        return (
            card.studentUniqueId,
            card.studentName,
            card.department,
            card.course,
            card.issueTimestamp,
            card.isActive,
            card.isRevoked
        );
    }

    // Function to get the total number of issued cards
    function getTotalCards() public view returns (uint256) {
        return recordCounter;
    }

    // Function to get the record ID by student unique ID
    function getRecordIdByStudentId(
        string memory _studentUniqueId
    ) public view returns (uint256) {
        return studentIdToRecordId[_studentUniqueId];
    }
}