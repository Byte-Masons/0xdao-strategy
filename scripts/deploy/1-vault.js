async function main() {
  const Vault = await ethers.getContractFactory('ReaperVaultv1_3');

  const wantAddress = '0x74b61f876FB49C7e73dBDd3B2185390BFDC11fF5';

  const tokenName = '0xDao SCREAM-XSCREAM Crypt';
  const tokenSymbol = 'rfvAMM-SCREAM-XSCREAM';
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
