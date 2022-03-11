async function main() {
  const vaultAddress = '0xDdbA29E07daD248d315c14E0e354b988598D6634';
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
