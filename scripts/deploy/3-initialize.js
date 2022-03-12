async function main() {
  const vaultAddress = '0xb14230bff4a2C81515582442b5bcDd2C20C24880';
  const strategyAddress = '0x238736b159912b01666490B4a5Bc3cBf1872D25D';

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
