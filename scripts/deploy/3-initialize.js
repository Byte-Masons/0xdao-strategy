async function main() {
  const vaultAddress = '0x5B2031e9a48F186CE33d1356a240dcDE434b74f3';
  const strategyAddress = '0x5656EdE5d24b6A15cCa8d8A1B063537BF5d5A744';

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
