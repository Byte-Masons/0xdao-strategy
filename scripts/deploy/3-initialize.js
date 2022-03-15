async function main() {
  const vaultAddress = '0xEBB0d20D20f843C0f36e214ce379BE15493092e5';
  const strategyAddress = '0xE21E25C0c0De8d698759C78A77647e4a9bF96E7c';

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
