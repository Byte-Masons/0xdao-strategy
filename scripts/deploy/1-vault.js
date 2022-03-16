async function main() {
  const Vault = await ethers.getContractFactory('ReaperVaultv1_3');

  const wantAddress = '0xa61DE98597f7da23f26C8D594Cce4884AFCe37EB';

  const tokenName = '0xDao SCARAB-GSCARAB Crypt';
  const tokenSymbol = 'rfvAMM-SCARAB-GSCARAB';
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
