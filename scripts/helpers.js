/* eslint-disable prettier/prettier */
/* eslint-disable node/no-unsupported-features/es-syntax */

// Possible improvement: have the deployment scripts write 
// the vault and strategy addresses in a file, and use those here
module.exports.getTools = async () => {
    const vaultAddress = '0xe66d06Cdb3b0cA80BCe87B92f2ED350C32f3A6dE';
    const strategyAddress = '0xf4bdf459cC33e2302C9c7DDA19a08A9daE432Fe3';
    const wantAddress = '0x4303eDB91d23FC648bFEEb65349596bcf4DF0742';
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
  