# CertChain - Blockchain Employee ID Card System

A complete web application for issuing and verifying digital employee ID credentials using blockchain technology.

## Features

- **Admin Authentication**: Secure JWT-based login system
- **Employee Management**: Add, edit, and manage employee records
- **Blockchain ID Cards**: Issue digital ID credentials stored on Ethereum-compatible blockchain
- **QR Code Verification**: Generate QR codes for easy verification
- **Public Verification**: Anyone can verify credential authenticity without login
- **Dashboard**: View statistics and manage the system
- **Blockchain Terminal**: Real-time transaction monitoring
- **Transaction History**: Visual blockchain activity display

## Tech Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (or in-memory demo mode)
- **Blockchain**: Hardhat + Solidity
- **Authentication**: JWT

## Project Structure

```
employee-id-blockchain/
├── blockchain/         # Smart contracts and Hardhat config
│   ├── contracts/      # Solidity smart contracts
│   ├── scripts/       # Deployment scripts
│   └── hardhat.config.js
├── server/            # Backend API
│   ├── config/       # Configuration files
│   ├── controllers/  # Route controllers
│   ├── middleware/  # Express middleware
│   ├── models/      # MongoDB models
│   ├── routes/      # API routes
│   └── utils/       # Utility functions
├── client/           # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utils/
│   └── public/
└── README.md
```

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (optional - runs in demo mode without it)
- MetaMask browser extension (optional for advanced usage)

---

# Quick Start Commands

## Step 1: Install All Dependencies

```bash
# Blockchain dependencies
cd blockchain
npm install

# Server dependencies
cd ../server
npm install

# Client dependencies
cd ../client
npm install
```

## Step 2: Configure Environment (Optional)

```bash
# Copy example env file
copy server\.env.example server\.env

# Edit with your settings (optional - works without)
```

## Step 3: Start Hardhat Blockchai

Open a new terminal and run:

```bash
cd blockchain
npm run node
```

Keep this terminal open! You should see:
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545
```

## Step 4: Deploy Smart Contract

Open another terminal and run:

```bash
cd blockchain
npm run deploy
```

You should see output like:
```
Deploying StudentIDCard smart contract...
StudentIDCard contract deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
Contract address saved to server/config/contract-address.json
```

## Step 5: Start Backend Server

Open another terminal and run:

```bash
cd server
npm start
```

You should see:
```
Server running on port 5000
Running in DEMO mode (no MongoDB)
```

## Step 6: Start Frontend

Open another terminal and run:

```bash
cd client
npm run dev
```

The application will open at `http://localhost:3000`

---

## How to Use

### 1. Login as Admin
1. Go to `http://localhost:3000/login`
2. Enter credentials: `admin` / `admin123`

### 2. Add a Student
1. Click "Add Student" in the sidebar
2. Fill in employee details (e.g., Employee ID: 123456, Name: John Doe, Department: Computer Science, Course: B.Tech, Year: 1st Year)
3. Click "Add Student"

### 3. Issue a Employee ID Card
1. Click "Issue Card" in the sidebar
2. Select a employee from the dropdown
3. Click "Issue Card"
4. The card is stored on blockchain

### 4. View Student Card
1. Go to "Students" in the sidebar
2. Click "View Card" on any employee
3. See the digital ID card with QR code

### 5. Verify a Card
1. Go to "Verify" in the sidebar (or visit `/verify`)
2. Enter the employee ID
3. Click "Verify" to see if it's valid

### 6. Monitor Blockchain
1. Click "Terminal" in the sidebar to see real-time transactions
2. Click "Transactions" to see full transaction history

---

## Running Without MongoDB

The system works in **demo mode** without MongoDB:
- Data is stored in memory (resets when server restarts)
- Blockchain uses simulated transactions

To run with full MongoDB:
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Update `server/.env` with your MongoDB URI

---

## Running Without Blockchain (Demo Only)

If you don't want to run Hardhat:
1. Skip Steps 3 and 4 above
2. Start server with `npm start` (runs in demo mode)
3. Start frontend with `npm run dev`

Transactions will be simulated with random hashes.

---

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify JWT token

### Students
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Deactivate employee
- `GET /api/employees/stats` - Get dashboard stats

### Cards
- `GET /api/cards` - Get all cards
- `GET /api/cards/employee/:employeeId` - Get card by employee ID
- `GET /api/cards/verify/:employeeId` - Verify a card (public)
- `POST /api/cards/issue` - Issue a new card
- `POST /api/cards/revoke` - Revoke a card

### Blockchain
- `GET /api/blockchain/logs` - Get transaction logs
- `POST /api/blockchain/logs/clear` - Clear transaction logs

---

## Troubleshooting

### "Cannot find module 'ethers'"
```bash
cd server
npm install ethers
```

### MongoDB Connection Error
- MongoDB is not required for demo mode
- The server runs without it using in-memory storage

### Blockchain Connection Error
- Ensure Hardhat node is running: `cd blockchain && npm run node`
- In another terminal: `cd blockchain && npm run deploy`

### Frontend shows ECONNREFUSED
- Make sure the backend server is running: `cd server && npm start`
- Server should be on port 5000

---

# Demonstration Section

## Full Demonstration Flow for Your Blockchain-Based Employee ID Card System

Use this as your **presentation/demo script** once everything is running.

---

## 1. What to Keep Open Before Starting the Demo

Keep these windows open:

### Window 1 — Hardhat Node Terminal

This shows the local blockchain network running.

Command:
```bash
cd blockchain
npm run node
```

This is important because when you perform a blockchain write operation, this terminal will show that a transaction was sent and mined.

---

### Window 2 — Deployment / Contract Info

You already deployed the contract successfully. Your contract address will be shown when you run deploy:

```text
0x5FbDB2315678afecb367f032d93F642f64180aa3
```

Your deployer account is:

```text
0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
```

---

### Window 3 — Hardhat Console (Optional)

Open this for direct blockchain inspection:

```bash
cd blockchain
npx hardhat console --network localhost
```

Inside it, load the contract:

```javascript
const contract = await ethers.getContractAt(
  "StudentIDCard",
  "CONTRACT_ADDRESS_HERE"
);
```

---

### Window 4 — Your Web App

Open the frontend in the browser at `http://localhost:3000`.

This is the user-facing part of the project where you will:
- show admin login
- show employee list
- issue a card
- verify a card

---

## 2. How to Introduce the Project

You can say:

> "This project is a blockchain-based employee ID card system. The admin can manage employee records and issue digital employee ID cards. The actual proof of issuance is written to a blockchain smart contract. For this demo, I am using a local Ethereum blockchain through Hardhat."

That gives context before showing the technical proof.

---

## 3. Demo Flow From Start to Finish

### Step A — Show the Student Management System

In the browser:
1. Login as admin (admin / admin123)
2. Go to the "Students" page
3. Show the existing employees

This proves the normal application layer is working.

**What to say:**
> "Here I can see the employee records managed by the application. These employee details are used when issuing a blockchain-backed employee ID card."

---

### Step B — Show That No Card Exists Before Issuance

In the Hardhat console, run:
```javascript
await contract.getTotalCards()
```

This should return `0n` or a lower number than after issuance.

**What to say:**
> "Before issuing a new employee ID card, I am checking the smart contract directly. This shows how many cards currently exist on-chain."

This is your **before state**.

---

### Step C — Issue a Employee ID Card

In the web app:
1. Go to "Issue Card"
2. Select a employee
3. Click "Issue Card"

Or in the Hardhat console:
```javascript
const tx = await contract.issueStudentCard(
  "STUDENT_ID",
  "Student Name",
  "Department",
  "Course"
);
await tx.wait();
console.log(tx.hash);
```

**What to say:**
> "Now I am issuing a employee ID card. This action writes data to the blockchain smart contract."

---

### Step D — Immediately Show the Hardhat Node Terminal

As soon as the transaction is sent, switch to the **Hardhat node terminal**.

There you should see blockchain activity like:
- `eth_sendTransaction`
- transaction hash
- block number
- gas used

**What to say:**
> "This terminal is my local Ethereum blockchain. The transaction is being mined here in real time. This proves that the card issuance is not just a normal database save; it is actually creating a blockchain transaction."

This is one of the strongest parts of the demo.

---

### Step E — Show the Transaction Receipt

In the Hardhat console, after `await tx.wait()`, show the receipt fields:
- `hash`
- `blockNumber`
- `status`
- `gasUsed`

**What to say:**
> "This is the blockchain transaction receipt. The transaction hash is the unique ID of the blockchain operation, the block number shows where it was recorded, and status 1 means it executed successfully."

---

### Step F — Show the Blockchain State Changed

Now run again:
```javascript
await contract.getTotalCards()
```

If it was `0n` before, now it should be `1n`.

**What to say:**
> "Now I am checking the smart contract again. The total number of cards has increased, which proves that the blockchain state changed after the transaction."

This is your **after state**.

---

### Step G — Verify the Student Card On-Chain

Now run:
```javascript
await contract.verifyStudentCard("STUDENT_ID")
```

This should return the stored blockchain data for that employee card.

**What to say:**
> "This function reads the employee card directly from the blockchain smart contract. So the system can both write and verify the card on-chain."

This proves the card is not only issued, but also verifiable.

---

### Step H — Show the Application Card View

In the browser:
1. Go to "Students"
2. Click "View Card" on any employee
3. Show the card UI with QR code and blockchain info

**What to say:**
> "This is the digital employee ID card shown in the application. The important point is that its authenticity is backed by the blockchain record we just created."

---

### Step I — Demonstrate Verification Use Case

Go to the public verification page at `http://localhost:3000/verify`.

Enter the employee ID and verify it.

**What to say:**
> "Anyone with the employee ID or QR-based verification link can check if the card is valid. The system checks the blockchain-backed record to confirm authenticity."

This connects the technical blockchain part to the practical use case.

---

## 4. Best Sequence for a Clean Teacher Demo

Use this exact order:

1. Show employee list in the app
2. Show `getTotalCards()` before issuance in Hardhat console
3. Issue card from app
4. Show Hardhat node terminal transaction output
5. Show transaction hash and receipt
6. Show `getTotalCards()` after issuance
7. Show `verifyStudentCard("STUDENT_ID")`
8. Show card page in UI
9. Show verification page in UI

This is the most complete flow.

---

## 5. What Each Part Proves

### App UI
- Proves: the system is usable, admin/employee features work

### Hardhat Node Terminal
- Proves: a real blockchain transaction occurred

### Transaction Receipt
- Proves: the transaction was mined successfully

### `getTotalCards()`
- Proves: contract state changed

### `verifyStudentCard()`
- Proves: the data is actually stored and retrievable from blockchain

### Verification Page
- Proves: the blockchain record is useful in the real application

---

## 6. What to Say If the Teacher Asks "Is This Real Blockchain?"

> "Yes, this is a real blockchain transaction, but on a local Ethereum development network using Hardhat instead of a public blockchain like Ethereum mainnet. The transaction, block creation, gas usage, and contract state changes are all real within this local environment."

---

## 7. What to Say If the Teacher Asks "Why Use Local Blockchain?"

> "For a college project, local blockchain is practical because it allows fast testing, no real gas fees, and complete control of the environment. The same smart contract logic can later be deployed to a public or test blockchain."

---

## 8. What to Say If the Teacher Asks "What Is the Benefit of Blockchain Here?"

> "The benefit is tamper resistance and verifiable authenticity. Once the employee card record is written to the blockchain, it becomes much harder to alter secretly. Anyone can verify whether a employee ID card is genuine."

---

## 9. A Polished Full Speaking Script

You can read this during the demo:

> "This is my Blockchain-Based Employee ID Card System. The application allows an admin to manage employee records and issue digital ID cards.
>
> First, I will show the employee list in the application.
>
> Now I will check the smart contract directly to see the current number of issued cards on-chain.
>
> Next, I issue a card for a employee.
>
> As soon as I do that, the Hardhat blockchain terminal shows a new transaction being mined.
>
> This means the card issuance is recorded as a blockchain transaction.
>
> Now I show the transaction receipt, including transaction hash, block number, gas used, and success status.
>
> Then I query the smart contract again, and the number of issued cards has increased.
>
> Finally, I verify the employee card using the blockchain record, which proves the card can be authenticated through the smart contract."

---

## 10. Final Checklist Before Presenting

Make sure these are ready:

- [ ] Hardhat node is running (`npm run node`)
- [ ] Contract is deployed (`npm run deploy`)
- [ ] Frontend is open (`http://localhost:3000`)
- [ ] Backend is running
- [ ] Hardhat console is open (optional)
- [ ] At least one employee record exists
- [ ] You know the exact commands:
  - `await contract.verifyStudentCard("STUDENT_ID")`
  - `await contract.getTotalCards()`

---

## 11. Most Important Proof to Remember

If you forget everything else, show these 3 things:

```javascript
const tx = await contract.issueStudentCard("STUDENT_ID", "Name", "Department", "Course");
await tx.wait();
console.log(tx.hash);
await contract.getTotalCards();
```

Then point to the Hardhat node terminal.

That alone is enough to show that blockchain transactions are happening.

---

## License

MIT License