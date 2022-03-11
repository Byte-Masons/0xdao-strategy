async function main() {
  const vaultAddress = '0xDdbA29E07daD248d315c14E0e354b988598D6634';
  const strategyAddress = '0x161D6a8f78fFbDef8f34d894a773A497681d4E15';

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
