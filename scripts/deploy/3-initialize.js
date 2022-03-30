async function main() {
  const vaultAddress = '0xda5836D1CD0C03bea1D1Ca3d30a09BbA88D867Af';
  const strategyAddress = '0x34885918d804F46d53ea201BD5b9fdC44e0CD67B';

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
