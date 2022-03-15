async function main() {
  const vaultAddress = '0xD268887B2171c4b7595DeeBD0CB589c560682629';
  const strategyAddress = '0xD46aD6777f848D5E3C9e09f9b0b012E21a78f9d7';

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
