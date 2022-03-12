async function main() {
  const vaultAddress = '0x1D916F17Da4146eD1C4Dced89D15f87a32FFeAB7';
  const want = '0xa66901D1965F5410dEeB4d0Bb43f7c1B628Cb20b';

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
