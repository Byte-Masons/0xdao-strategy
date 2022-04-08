async function main() {
  const vaultAddress = '0x183713e625Bc32B8FfFCD3bC1C51552b3e1Cc69F';
  const strategyAddress = '0xb9BF14bE1A6Ed7cD9822f28DCfcE1F5deF110569';

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
