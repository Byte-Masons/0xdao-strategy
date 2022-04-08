/* eslint-disable prettier/prettier */
/* eslint-disable node/no-unsupported-features/es-syntax */

// Possible improvement: have the deployment scripts write 
// the vault and strategy addresses in a file, and use those here
module.exports.getTools = async () => {
    const vaultAddress = '0x183713e625Bc32B8FfFCD3bC1C51552b3e1Cc69F';
    const strategyAddress = '0xb9BF14bE1A6Ed7cD9822f28DCfcE1F5deF110569';
    const wantAddress = '0x8aa410d8B0Cc3dE48AAC8eB5d928646A00e6ff04';
    const Strategy = await ethers.getContractFactory('ReaperAutoCompoundOxDao');
  
    const [deployer] = await ethers.getSigners();
    const Vault = await ethers.getContractFactory('ReaperVaultv1_3');
    const Erc20 = await ethers.getContractFactory('@openzeppelin/contracts/token/ERC20/ERC20.sol:ERC20');
    const vault = Vault.attach(vaultAddress);
    const strategy = Strategy.attach(strategyAddress);
    const want = await Erc20.attach(wantAddress);
  
    return {
      deployer: deployer,
      vault: vault,
      strategy: strategy,
      want: want
    };
  };
  