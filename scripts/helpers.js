/* eslint-disable prettier/prettier */
/* eslint-disable node/no-unsupported-features/es-syntax */

// Possible improvement: have the deployment scripts write 
// the vault and strategy addresses in a file, and use those here
module.exports.getTools = async () => {
    const vaultAddress = '0x7Cc37ae0b275dC9CEc71954fE999B7a8e6870e1D';
    const strategyAddress = '0xbF609F3cff33C1B65AbA9B851CA9E2223da39370';
    const wantAddress = '0xBad7D3DF8E1614d985C3D9ba9f6ecd32ae7Dc20a';
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
  