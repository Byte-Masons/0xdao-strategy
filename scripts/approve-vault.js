async function main() {
  const vaultAddress = '0x9bA40F4200cA736895778B00d72f26CcEF74461a';
  const want = '0x74b61f876FB49C7e73dBDd3B2185390BFDC11fF5';

  const ERC20 = await ethers.getContractFactory('contracts/ERC20.sol:ERC20');
  const erc20 = await ERC20.attach(want);
  const [deployer] = await ethers.getSigners();
  console.log(deployer.address, ' ', await erc20.allowance(deployer.address, vaultAddress));
  await erc20.approve(vaultAddress, ethers.utils.parseEther('100000'));
  console.log('erc20 approved');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
