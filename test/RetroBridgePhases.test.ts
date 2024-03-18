import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

const baseURI = "ipfs://QmQcJ5d8h4qkiLW5yt12zjDCa4BSjZ8Yikr5Q9gxWhc8q2/"

async function deployRetrobridgeFixture() {
  const [owner, user1, user2] = await ethers.getSigners();

  const RetroBridgePhases = await ethers.getContractFactory("RetroBridgePhases");
  
  const retroBridgePhases = await RetroBridgePhases.deploy(baseURI)
  await retroBridgePhases.waitForDeployment()
  
  let tx1 = await retroBridgePhases.setWhitelist(0, owner.address, true)
  await tx1.wait()

  return {retroBridgePhases, owner, user1, user2 };
}
  
describe("RetroBridgePhases", function () {

  it("check ownership", async() => {
    const { retroBridgePhases, owner, user1, user2 } = await loadFixture(deployRetrobridgeFixture);

    const ownerAddress = await retroBridgePhases.owner()

    expect(ownerAddress).to.be.eq(owner.address)

  })

  it("check NFT ids", async () => {
    const { retroBridgePhases, owner, user1, user2 } = await loadFixture(deployRetrobridgeFixture);

    const SUNRISE_NFT_ID = await retroBridgePhases.SUNRISE_NFT_ID()
    const MIDDAY_NFT_ID = await retroBridgePhases.MIDDAY_NFT_ID()
    const SUNSET_NFT_ID = await retroBridgePhases.SUNSET_NFT_ID()
    const MIDNIGHT_NFT_ID = await retroBridgePhases.MIDNIGHT_NFT_ID()

    expect(SUNRISE_NFT_ID).to.be.eq(0)
    expect(MIDDAY_NFT_ID).to.be.eq(1)
    expect(SUNSET_NFT_ID).to.be.eq(2)
    expect(MIDNIGHT_NFT_ID).to.be.eq(3)
  })

  it("set default URI", async () => {
    const { retroBridgePhases, owner, user1, user2 } = await loadFixture(deployRetrobridgeFixture);
    
    const defaulURI = "ipfs://QmQcJ5d8h4qkiLW5yt12zjDCa4BSjZ8Yikr5Q9gxWhc8q2/0.json"

    const tx = await retroBridgePhases.setDefaultURI(defaulURI)
    await tx.wait()
    
    const newUri = await retroBridgePhases.uri(0)
    expect(newUri).to.be.eq(defaulURI)
  })

  it('get URI', async () => {
    const { retroBridgePhases, owner, user1, user2 } = await loadFixture(deployRetrobridgeFixture);
    const uri0 = await retroBridgePhases.uri(0)
    const uri1 = await retroBridgePhases.uri(1)
    const uri2 = await retroBridgePhases.uri(2)
    const uri3 = await retroBridgePhases.uri(3)

    expect(uri0).to.be.eq(baseURI+"0.json")
    expect(uri1).to.be.eq(baseURI+"1.json")
    expect(uri2).to.be.eq(baseURI+"2.json")
    expect(uri3).to.be.eq(baseURI+"3.json")

  })

  it("should revert safeTransferFrom", async () => {
    const { retroBridgePhases, owner, user1, user2 } = await loadFixture(deployRetrobridgeFixture);

    const from = owner.address
    const to = user1.address
    const nftId = 0
    const value = 1
    const data = "0x"
    await expect(retroBridgePhases.safeTransferFrom(from, to, nftId, value, data)).to.be.revertedWith("RetroBridgePhases: safeTransferFrom is forbidden")

  })

  it("should revert safeBatchTransferFrom", async () => {
    const { retroBridgePhases, owner, user1, user2 } = await loadFixture(deployRetrobridgeFixture);

    const from = owner.address
    const to = user1.address
    const nftId = [0]
    const value = [1]
    const data = "0x"
    await expect(retroBridgePhases.safeBatchTransferFrom(from, to, nftId, value, data)).to.be.revertedWith("RetroBridgePhases: safeBatchTransferFrom is forbidden")
  })

  it('mint sunrise NFT', async () => {
    const { retroBridgePhases, owner, user1, user2 } = await loadFixture(deployRetrobridgeFixture);

    const account = owner.address
    const nftId = 0
    const value = 1

    const tx1 = await retroBridgePhases.connect(owner).mint(account, nftId, value);
    await tx1.wait()

    const balanceOfSunriseNFTOnAccount = await retroBridgePhases.balanceOf(account, nftId)
    expect(balanceOfSunriseNFTOnAccount).to.be.eq(1)
  })

  it("set whitelist mint batch", async () => {
    const { retroBridgePhases, owner, user1, user2 } = await loadFixture(deployRetrobridgeFixture);

    const account = owner.address
    const nftId = 1
    const value = 2

    const tx1 = await retroBridgePhases.connect(owner).setWhitelist(nftId, account, true);
    await tx1.wait()

    const tx2 = await retroBridgePhases.connect(owner).mintBatch(account, [0, 1], [1,2])
    await tx2.wait()

    const batchBalanceOfAccount = await retroBridgePhases.balanceOfBatch([account,account], [0, 1])
    const expectedBalances = ['1', '2']

    expect(batchBalanceOfAccount).to.deep.equal(expectedBalances);
  })

  it("mint sunriseNFT and check totalSupply and existance", async () => {
    const { retroBridgePhases, owner, user1, user2 } = await loadFixture(deployRetrobridgeFixture);

    const account = owner.address
    const nftId = 1
    const value = 2

    const tx1 = await retroBridgePhases.connect(owner).setWhitelist(nftId, account, true);
    await tx1.wait()

    const tx2 = await retroBridgePhases.connect(owner).mintBatch(account, [0, 1], [1,2])
    await tx2.wait()

    const totalSupply = await retroBridgePhases["totalSupply()"]()
    const totalSupplySunriseNFT = await retroBridgePhases["totalSupply(uint256)"](0)
    const totalSupplyMiddayNFT = await retroBridgePhases["totalSupply(uint256)"](1)
    const existMiddayNFT = await retroBridgePhases.exists(1)
    const existSunsetNFT = await retroBridgePhases.exists(2)

    expect(totalSupply).to.be.eq(3)
    expect(totalSupplySunriseNFT).to.be.eq(1)
    expect(totalSupplyMiddayNFT).to.be.eq(2)
    expect(existMiddayNFT).to.be.eq(true)
    expect(existSunsetNFT).to.be.eq(false)
  })

});
