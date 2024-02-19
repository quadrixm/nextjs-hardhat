import { ethers } from "hardhat";
import * as fs from 'fs';

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = ethers.parseEther("0.001");

  const lock = await ethers.deployContract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  await lock.waitForDeployment();

  console.log(
    `Lock with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  );

  const blog = await ethers.deployContract("Blog", ['Mohammad']);

  await blog.waitForDeployment();

  console.log(
    `Blog deployed to ${blog.target}`
  );

  const [owner] = await ethers.getSigners();

  fs.writeFileSync('./address.ts', `
  export const contractAddress = "${blog.target}"
  export const ownerAddress = "${owner.address}"
  `)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
