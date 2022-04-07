async function main() {
  const vaultAddress = '0xe66d06Cdb3b0cA80BCe87B92f2ED350C32f3A6dE';
  const strategyAddress = '0xf4bdf459cC33e2302C9c7DDA19a08A9daE432Fe3';

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
