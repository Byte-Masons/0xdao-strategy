async function main() {
  const Vault = await ethers.getContractFactory('ReaperVaultv1_3');

  const wantAddress = '0x62E2819Dd417F3b430B6fa5Fd34a49A377A02ac8';

  const tokenName = '0xDao SOLID-SOLIDsex Crypt';
  const tokenSymbol = 'rfsAMM-SOLID-SOLIDsex';
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
