async function main() {
  const Vault = await ethers.getContractFactory('ReaperVaultv1_3');

  const wantAddress = '';

  const tokenName = '0xDao HND-WFTM Crypt';
  const tokenSymbol = 'rf-oxd-vAMM-HND-WFTM';
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
