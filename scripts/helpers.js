/* eslint-disable prettier/prettier */
/* eslint-disable node/no-unsupported-features/es-syntax */

// Possible improvement: have the deployment scripts write 
// the vault and strategy addresses in a file, and use those here
module.exports.getTools = async () => {
    const vaultAddress = '0x6b4eC9B831f271702233d83beAeDB1568E277e3F';
    const strategyAddress = '0xEac0d51b9294BA9e8f39FdED754325F052615fCE';
    const wantAddress = '0x62E2819Dd417F3b430B6fa5Fd34a49A377A02ac8';
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
  