async function main() {
  const vaultAddress = '0x7Cc37ae0b275dC9CEc71954fE999B7a8e6870e1D';
  const strategyAddress = '0xbF609F3cff33C1B65AbA9B851CA9E2223da39370';

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
