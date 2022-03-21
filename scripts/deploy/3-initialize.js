async function main() {
  const vaultAddress = '0x37974DD864D96Db929984F1DfF69BFe1F7f4ecc1';
  const strategyAddress = '0x37beDb5A7eB9B40f4656c5027470Ab964484fE6E';

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
