async function main() {
  const vaultAddress = '0x6cFd9C38535C9e56C64D4092cbf91F063237eb7F';
  const strategyAddress = '0x60f6477E7C43AB14862FD20BFECFDDa50084b16B';

  const Vault = await ethers.getContractFactory('ReaperVaultv1_3');
  const vault = Vault.attach(vaultAddress);
  const options = { gasPrice: 300000000000, gasLimit: 9000000 };

  await vault.initialize(strategyAddress, options);
  console.log('Vault initialized');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
