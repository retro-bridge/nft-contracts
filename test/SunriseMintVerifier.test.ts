import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect, use } from "chai";
import { ethers, network } from "hardhat";

async function deployContractsFixture() {
    const [owner, master, user1] = await ethers.getSigners();

    const SunriseMintVerifier = await ethers.getContractFactory("SunriseMintVerifier");
    const RetroBridgePhases = await ethers.getContractFactory("RetroBridgePhases");

    const retroBridgePhases = await RetroBridgePhases.deploy("ipfs://QmQcJ5d8h4qkiLW5yt12zjDCa4BSjZ8Yikr5Q9gxWhc8q2/")
    await retroBridgePhases.waitForDeployment();
    const sunriseMintSigner = await SunriseMintVerifier.deploy(retroBridgePhases.target);
    await sunriseMintSigner.waitForDeployment();

    const setWithelistTx = await retroBridgePhases.setWhitelist(0, sunriseMintSigner.target, true);
    await setWithelistTx.wait()
    
    const setMasterTx = await sunriseMintSigner.setMaster(master.address);
    await setMasterTx.wait()

    return { sunriseMintSigner, retroBridgePhases, owner, master, user1 };
}

describe("SunriseMintVerifier", async function () {

  it('EIP712 signature',async () => {
    const { sunriseMintSigner, retroBridgePhases, owner, master, user1, } = await loadFixture(deployContractsFixture);
    const chainid = await sunriseMintSigner.chainId()
  
    const domain: any = {
      name: "SunriseMintVerifier",
      version: "1",
      chainId: chainid,
      verifyingContract: sunriseMintSigner.target
    };

    const types = {
      SunriseMintData: [
        { name: 'account', type: 'address' },
      ]
    };

    const value = {
      account: user1.address
    }

    const signature = await master.signTypedData(domain, types, value)
    const verification = await sunriseMintSigner.verify(user1.address, signature)
    expect(verification).to.be.eq(true)
  })


  it("user1 mint sunriseNFT ", async () => {
    const { sunriseMintSigner, retroBridgePhases, owner, master, user1, } = await loadFixture(deployContractsFixture);

    const domain: any = {
      name: "SunriseMintVerifier",
      version: "1",
      chainId: network.config.chainId,
      verifyingContract: sunriseMintSigner.target
    };

    const types = {
      SunriseMintData: [
        { name: 'account', type: 'address' },
      ]
    };

    const value = {
      account: user1.address
    }

    const signature = await master.signTypedData(domain, types, value)

    await sunriseMintSigner.connect(user1).mint(signature)

    const balanceOfSunriseNFTUser1 = await retroBridgePhases.balanceOf(user1.address, 0)
    expect(balanceOfSunriseNFTUser1).to.be.eq(1)
  })

  it('should revert on owner mint of user1 sunrise NFT', async() => {
    const { sunriseMintSigner, retroBridgePhases, owner, master, user1, } = await loadFixture(deployContractsFixture);

    const messageHash = ethers.solidityPackedKeccak256(['address'], [user1.address])
    const signature = await master.signMessage(ethers.getBytes(messageHash))

    await expect(sunriseMintSigner.connect(owner).mint(signature)).to.be.revertedWith("SunriseMinter: invalid signature")
  })

});
  