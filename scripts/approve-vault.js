async function main() {
  const vaultAddress = '0x048bEf9bF92aB9EEDe6D97b84aA088d2792585aA';
  const want = '0x6aAE93f2915b899e87b49a9254434D36ac9570d8';

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
