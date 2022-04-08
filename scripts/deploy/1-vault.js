async function main() {
  const Vault = await ethers.getContractFactory('ReaperVaultv1_3');

  const wantAddress = '0x8aa410d8B0Cc3dE48AAC8eB5d928646A00e6ff04';

  const tokenName = '0xDao FTM-SYN Crypt';
  const tokenSymbol = 'rfvAMM-FTM-SYN';
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
