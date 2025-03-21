const { ethers } = require("hardhat");

async function main() {
    // Get the contract factory
    const Storage = await ethers.getContractFactory("Storage");

    // Deploy the contract
    const storage = await Storage.deploy(); 

    // Wait for deployment to be completed
    await storage.waitForDeployment();  

    console.log(`Contract deployed at address: ${storage.target}`); 
}

// Run the deploy script with proper error handling
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
