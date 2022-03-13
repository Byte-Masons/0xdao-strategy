async function main() {
  const vaultAddress = '0xcE0e5AF10da3c6259207BaDA182EECEA3c08537b';
  const strategyAddress = '0xd7B29a03352C998DCe66571D19786c2E05dD8623';

  const Vault = await ethers.getContractFactory('ReaperVaultv1_3');
  const vault = Vault.attach(vaultAddress);
  const options = { gasPrice: 220000000000, gasLimit: 9000000 };

  await vault.initialize(strategyAddress, options);
  console.log('Vault initialized');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
