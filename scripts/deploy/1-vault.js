async function main() {
  const Vault = await ethers.getContractFactory('ReaperVaultv1_3');

  const wantAddress = '0xa3bf7336FDbCe054c4B5Bad4FF8d79539dB2a2b3';

  const tokenName = 'SOLID-OXSOLID 0xDao Crypt';
  const tokenSymbol = 'rfvAMM-SOLID-OXSOLID';
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
