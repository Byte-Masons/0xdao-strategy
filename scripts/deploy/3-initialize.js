async function main() {
  const vaultAddress = '0x63687927964D439A84bCb28C86DB0D23abc5F074';
  const strategyAddress = '0x3DdCDAE6b1Bd75af97c799E05A8262CFf1B3087f';

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
