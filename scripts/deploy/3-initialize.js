async function main() {
  const vaultAddress = '0x835d6C7D6ea120Eb1f483686fFD88039e9176D90';
  const strategyAddress = '0x427C5DAfA7bF6318fEc405aC8b2690007e950E66';

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
