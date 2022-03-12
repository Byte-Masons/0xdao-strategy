async function main() {
  const vaultAddress = '0x9382B5f94561cA1C12F4af2925A7d50a788AcB7f';
  const strategyAddress = '0x0766AED42E9B48aa8F3E6bCAE925c6CF82B517eF';

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
