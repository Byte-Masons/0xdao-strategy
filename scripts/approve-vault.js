async function main() {
  const vaultAddress = '0xfd5d1b95AaCE7B92b8c8ed7B9c030b3E4D742dC5';
  const want = '0xcB6eAB779780c7FD6d014ab90d8b10e97A1227E2';

  const ERC20 = await ethers.getContractFactory('contracts/ERC20.sol:ERC20');
  const erc20 = await ERC20.attach(want);
  const [deployer] = await ethers.getSigners();
  console.log(deployer.address, ' ', await erc20.allowance(deployer.address, vaultAddress));
  // await erc20.approve(vaultAddress, ethers.utils.parseEther('100000'));
  // console.log('erc20 approved');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
