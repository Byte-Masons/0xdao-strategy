async function main() {
  const vaultAddress = '0xb3026cd43C2ff98Ac926A6A6FCA1dBc8e3586013';
  const strategyAddress = '0x5aa97b06769bbDB7E9425a74e8ead9DBc1238116';

  const Vault = await ethers.getContractFactory('ReaperVaultv1_3');
  const vault = Vault.attach(vaultAddress);
  const options = { gasPrice: 400000000000, gasLimit: 9000000 };

  await vault.initialize(strategyAddress, options);
  console.log('Vault initialized');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
