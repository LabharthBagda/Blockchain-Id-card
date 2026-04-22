const hre = require("hardhat");

async function main() {
    console.log("Deploying StudentIDCard smart contract...");

    // Deploy the contract
    const StudentIDCard = await hre.ethers.getContractFactory("StudentIDCard");
    const studentIDCard = await StudentIDCard.deploy();

    await studentIDCard.waitForDeployment();
    const contractAddress = await studentIDCard.getAddress();

    console.log("StudentIDCard contract deployed to:", contractAddress);

    // Save the contract address to a file for the backend to use
    const fs = require("fs");
    const path = require("path");

    const configPath = path.join(__dirname, "..", "server", "config");
    if (!fs.existsSync(configPath)) {
        fs.mkdirSync(configPath, { recursive: true });
    }

    const contractInfo = {
        address: contractAddress,
        network: hre.network.name,
        chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    };

    fs.writeFileSync(
        path.join(configPath, "contract-address.json"),
        JSON.stringify(contractInfo, null, 2)
    );

    console.log("Contract address saved to server/config/contract-address.json");

    // If we're on a local network, show account info
    if (hre.network.name === "localhost" || hre.network.name === "hardhat") {
        const [deployer] = await hre.ethers.getSigners();
        console.log("Deployer account:", deployer.address);
        console.log("Deployer balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });