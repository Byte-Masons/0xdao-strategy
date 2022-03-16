async function main() {
  const vaultAddress = '0xfcC1cC03521c7F7722eC3A31e97980f86390D880';
  const strategyAddress = '0xF37cdED599f52f4f3FF2E86444cc8AE5A9E8D46A';

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
