async function main() {
  const vaultAddress = '0x048bEf9bF92aB9EEDe6D97b84aA088d2792585aA';
  const strategyAddress = '0x3738Ab840FA65451CF450DeEA484C474c15747c8';

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
