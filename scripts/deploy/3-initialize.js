async function main() {
  const vaultAddress = '0x31a932FB366f4D4601b3764492F4E0657131e5B0';
  const strategyAddress = '0xDF306AD8fE89d6f0C4F7235EF7B5EbaB39fd2022';

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
