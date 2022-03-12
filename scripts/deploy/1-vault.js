async function main() {
  const Vault = await ethers.getContractFactory('ReaperVaultv1_3');

  const wantAddress = '0xa66901D1965F5410dEeB4d0Bb43f7c1B628Cb20b';

  const tokenName = '0xDao WFTM-SOLIDsex Crypt';
  const tokenSymbol = 'rf-oxd-vAMM-WFTM-SOLIDsex';
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
