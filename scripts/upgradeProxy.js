async function main() {
  //const fUSDTProxy = '0x512A00B3BbC54BAeefcf2FbD82E082E04bc5dffd';
  const stratProxy = '0xbF609F3cff33C1B65AbA9B851CA9E2223da39370';
  const stratFactory = await ethers.getContractFactory('ReaperAutoCompoundOxDao');
  const stratContract = await hre.upgrades.upgradeProxy(stratProxy, stratFactory);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
