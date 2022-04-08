async function main() {
  //const fUSDTProxy = '0x512A00B3BbC54BAeefcf2FbD82E082E04bc5dffd';
  const stratProxy = '0xa15e86A4b596978410163c5A3f26D132BF03E333';
  const stratFactory = await ethers.getContractFactory('ReaperAutoCompoundOxDao');
  const stratContract = await hre.upgrades.upgradeProxy(stratProxy, stratFactory);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
