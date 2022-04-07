async function main() {
  const vaultAddress = '0x6D094dC465f5380B5F0F9a2289B94233b9CF843B';
  const strategyAddress = '0x1036dA4E38Af11cda40042822285578563D2c936';

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
