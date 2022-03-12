async function main() {
  const vaultAddress = '0xeb94A406749Eb6dca39800C1ED8706cA4a806247';
  const want = '0x5ef8f0bd4F071B0199603a28ec9343F3651999c0';

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
