async function main() {
  const vaultAddress = '0xdcF27617910467027afDb40570536069cB7A2b6e';
  const strategyAddress = '0xa15e86A4b596978410163c5A3f26D132BF03E333';

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
