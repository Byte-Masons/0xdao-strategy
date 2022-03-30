async function main() {
  const Vault = await ethers.getContractFactory('ReaperVaultv1_3');

  const wantAddress = '0x6B987e02Ca5eAE26D8B2bCAc724D4e03b3B0c295';

  const tokenName = '0xDao OATH-FTM Crypt';
  const tokenSymbol = 'rfvAMM-OATH-FTM';
  const depositFee = 0;
  const tvlCap = ethers.utils.parseEther('5000');

  const vault = await Vault.deploy(wantAddress, tokenName, tokenSymbol, depositFee, tvlCap);

  await vault.deployed();
  console.log('Vault deployed to:', vault.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
