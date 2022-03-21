async function main() {
  const vaultAddress = '0x67EB413087040D1B129E04FCeB7Ae8d5289e0Bcd';
  const strategyAddress = '0xf19f4FCdBCDd54001f2Ea140732Ca45f768a8F03';

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
