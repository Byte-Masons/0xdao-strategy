/* eslint-disable prettier/prettier */
/* eslint-disable node/no-unsupported-features/es-syntax */

// Possible improvement: have the deployment scripts write 
// the vault and strategy addresses in a file, and use those here
module.exports.getTools = async () => {
    const vaultAddress = '0x221Db83049f045E8dF428F5d412C700F28C40d0d';
    const strategyAddress = '0x61fF41Abb5221BF7ECDb7B3190cBdF668E8E0749';
    const wantAddress = '0x5804F6C40f44cF7593F73cf3aa16F7037213A623';
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
  