async function main() {
  const vaultAddress = '0x4d3FF9146CAFD464136F45eE56d1e28aD5A26086';
  const strategyAddress = '0xe000a57c2FDF54F930bC75dd046060FF1caB8B14';

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
