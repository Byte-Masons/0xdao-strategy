async function main() {
  const Vault = await ethers.getContractFactory('ReaperVaultv1_3');

  const wantAddress = '0x817CafF2dAC62BDCcE1EBE332cA128215Dbd9e9a';

  const tokenName = 'SOLIDsex-g3CRV 0xDao Crypt';
  const tokenSymbol = 'rf-oxd-vAMM-SOLIDsex-g3CRV';
  const depositFee = 0;
  const tvlCap = ethers.utils.parseEther('5000');
  const options = { gasPrice: 300000000000, gasLimit: 9000000 };

  const vault = await Vault.deploy(wantAddress, tokenName, tokenSymbol, depositFee, tvlCap, options);

  await vault.deployed();
  console.log('Vault deployed to:', vault.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
