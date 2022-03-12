async function main() {
  const vaultAddress = '0x9eAF28491802cC41415399bf9D76AEFa17B0E655';
  const strategyAddress = '0x35F724fA3Caab6d6Cb9dd3338229d755355D52b4';

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
