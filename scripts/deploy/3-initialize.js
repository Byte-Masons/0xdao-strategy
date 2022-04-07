async function main() {
  const vaultAddress = '0x221Db83049f045E8dF428F5d412C700F28C40d0d';
  const strategyAddress = '0x61fF41Abb5221BF7ECDb7B3190cBdF668E8E0749';

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
