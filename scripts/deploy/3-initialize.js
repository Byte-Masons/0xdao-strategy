async function main() {
  const vaultAddress = '0x545386B07C68700D7F3A305B784Ae54CB967CA9F';
  const strategyAddress = '0xAC136a70358a55e3CC97e844aF37d3aAEED683b8';

  const Vault = await ethers.getContractFactory('ReaperVaultv1_3');
  const vault = Vault.attach(vaultAddress);

  await vault.initialize(strategyAddress);
  console.log('Vault initialized');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
