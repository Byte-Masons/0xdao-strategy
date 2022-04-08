async function main() {
  //const fUSDTProxy = '0x512A00B3BbC54BAeefcf2FbD82E082E04bc5dffd';
  const stratProxy = '0x61fF41Abb5221BF7ECDb7B3190cBdF668E8E0749';
  const stratFactory = await ethers.getContractFactory('ReaperAutoCompoundOxDao');
  const stratContract = await hre.upgrades.upgradeProxy(stratProxy, stratFactory);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
