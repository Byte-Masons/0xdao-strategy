async function main() {
  const vaultAddress = '0xeb94A406749Eb6dca39800C1ED8706cA4a806247';
  const strategyAddress = '0x02E3eFeD80972ea6B4c53c742e10488D1efC0Fe2';

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
