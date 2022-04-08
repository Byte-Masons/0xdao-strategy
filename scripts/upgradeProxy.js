async function main() {
  //const fUSDTProxy = '0x512A00B3BbC54BAeefcf2FbD82E082E04bc5dffd';
  const stratProxy = '0xf4bdf459cC33e2302C9c7DDA19a08A9daE432Fe3';
  const stratFactory = await ethers.getContractFactory('ReaperAutoCompoundOxDao');
  const stratContract = await hre.upgrades.upgradeProxy(stratProxy, stratFactory);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
