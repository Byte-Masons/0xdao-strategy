async function main() {
  const vaultAddress = '0xF7d47ca98A81b734b02C52f802450376bc4A806d';
  const strategyAddress = '0x0c61C9Df869b8dCEe9d76823A9aA9CC73E82A713';

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
