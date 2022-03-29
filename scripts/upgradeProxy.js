async function main() {
  //const fUSDTProxy = '0x512A00B3BbC54BAeefcf2FbD82E082E04bc5dffd';
  const stratProxy = '0x34885918d804F46d53ea201BD5b9fdC44e0CD67B';
  const stratFactory = await ethers.getContractFactory('ReaperAutoCompoundOxDao');
  const stratContract = await hre.upgrades.upgradeProxy(stratProxy, stratFactory);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
