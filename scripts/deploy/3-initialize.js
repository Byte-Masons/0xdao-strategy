async function main() {
  const vaultAddress = '0xfd5d1b95AaCE7B92b8c8ed7B9c030b3E4D742dC5';
  const strategyAddress = '0xf000209aECE04251486f5E64d800a0A38b84770b';

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
