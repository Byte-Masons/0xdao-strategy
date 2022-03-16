async function main() {
  const vaultAddress = '0x237AdEE2e962C615C7987B400cafD5307D22A385';
  const strategyAddress = '0xe2CDEb812f641505B0673EC90e13E37A5aA742AE';

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
