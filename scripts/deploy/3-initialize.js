async function main() {
  const vaultAddress = '0x05E35347aCE99806a2adA3c781034745e8178812';
  const strategyAddress = '0x1853da39cc20E88866d1Be5680B3f80BF018911b';

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
