async function main() {
  const vaultAddress = '0x67EB413087040D1B129E04FCeB7Ae8d5289e0Bcd';
  const want = '0x5821573d8F04947952e76d94f3ABC6d7b43bF8d0';

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
