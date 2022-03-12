async function main() {
  const vaultAddress = '0x9eAF28491802cC41415399bf9D76AEFa17B0E655';
  const want = '0xFCEC86aF8774d69e2e4412B8De3f4aBf1f671ecC';

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
