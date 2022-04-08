async function main() {
  const vaultAddress = '0x6b4eC9B831f271702233d83beAeDB1568E277e3F';
  const strategyAddress = '0xEac0d51b9294BA9e8f39FdED754325F052615fCE';

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
