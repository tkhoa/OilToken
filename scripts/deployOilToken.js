async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
    const OilToken = await ethers.getContractFactory("OilToken");
    const oilToken = await OilToken.deploy();
    
    console.log("Giving fund: ", await oilToken.issueToken());
    console.log("After giving: ", )

    console.log("OilToken address:", oilToken.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });