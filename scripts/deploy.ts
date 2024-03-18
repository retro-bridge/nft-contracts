import { ethers , network} from "hardhat";

const baseURI = 'ipfs://QmcNHbpvQtaUQxQobGZWDid31MMmi2ma1wJgEzuHdGxe3a/'

let retroBridgePhasesAddress: any = ''
let sunriseMintVerifierAddress: any = ''

async function main() {
    const [owner] = await ethers.getSigners();
    console.log("owner address: ", owner.address)

    const RetroBridgePhases = await ethers.getContractFactory("RetroBridgePhases");
    const SunriseMintVerifier = await ethers.getContractFactory("SunriseMintVerifier");
    let retroBridgePhases: any
    let sunriseMintVerifier: any

    retroBridgePhases = await RetroBridgePhases.connect(owner).deploy(baseURI)
    await retroBridgePhases.waitForDeployment().then((result: any) => {
        retroBridgePhasesAddress = result.target
        console.log('RetroBridgePhases:    ', retroBridgePhasesAddress)
    });
    retroBridgePhases = RetroBridgePhases.connect(owner).attach(retroBridgePhasesAddress)

    sunriseMintVerifier = await SunriseMintVerifier.connect(owner).deploy(retroBridgePhases.target);
    await sunriseMintVerifier.waitForDeployment().then((result: any) => {
        sunriseMintVerifierAddress = result.target
        console.log('SunriseMintVerifier: ', sunriseMintVerifierAddress)
    });
    sunriseMintVerifier = SunriseMintVerifier.connect(owner).attach(sunriseMintVerifierAddress)

    const setWithelistTx = await retroBridgePhases.setWhitelist(0, sunriseMintVerifier.target, true);
    await setWithelistTx.wait().then((result: any) => {
        console.log("\nSet whitelist:")
        console.log("   nftId:    ", 0)
        console.log("   account:  ", sunriseMintVerifier.target)
        console.log("   whitelist:", true)
        console.log("TX hash: ",result?.hash)
    })
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});