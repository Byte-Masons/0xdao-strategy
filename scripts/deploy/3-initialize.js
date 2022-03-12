async function main() {
  const vaultAddress = '0xdEf5c8fECfD16eb4A2C00D489c9B1ff4B0230091';
  const strategyAddress = '0x8DCFCD01022A41eEC24b9010444007fD617dAd9a';

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
