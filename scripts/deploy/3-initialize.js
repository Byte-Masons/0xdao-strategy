async function main() {
  const vaultAddress = '0x9bA40F4200cA736895778B00d72f26CcEF74461a';
  const strategyAddress = '0xE9E8df08C4904F7DCF7B3606c432A6f59cC41Ed5';

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
