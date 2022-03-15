async function main() {
  const vaultAddress = '0xEBB0d20D20f843C0f36e214ce379BE15493092e5';
  const want = '0xEa5f4ECf6900833f9B7038e5D8d67142ABb09Dcc';

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
