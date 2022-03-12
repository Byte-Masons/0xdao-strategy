async function main() {
  const vaultAddress = '0x1D916F17Da4146eD1C4Dced89D15f87a32FFeAB7';
  const strategyAddress = '0x280C1b8E81fc5eb7e74dB1485DDB067B2242B211';

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
