# RetroBridgePhases

The Retrobridge NFT is focused on creating a series of unique, non-transferable ERC-1155 tokens representing different phases of the Retrobridge project. These tokens embody the stages: Sunrise, Midday, Sunset, and Midnight. Each token signifies a specific phase in the project lifecycle and is intended to be minted by a pre-defined smart contracts associated with each phase.

Token Types:
 - Sunrise NFT (ID: 0)
 - Midday NFT (ID: 1)
 - Sunset NFT (ID: 2)
 - Midnight NFT (ID: 3)

Supply per Token: Unlimited
Transferability: Non-transferable (like soulbound tokens)

Minting is restricted to whitelisted addresses. Whitelisted addresses can mint tokens by interacting with the contract's `mint` or `mintBatch` functions.

Whitelisting is managed by the contract owner. The owner can add or remove addresses from the whitelist for each NFT type using the setWhitelist function.

# SunriseMintVerifier

The SunriseMintVerifier contract is a part of the Retrobridge NFT project, specifically designed for the minting process of the Sunrise collection. This contract introduces an additional layer of security and validation by verifying signatures from master keys before minting tokens. It ensures that only users who have completed specific tasks or met certain criteria are eligible to mint the Sunrise NFTs.

## Minting Process
Users complete designated tasks or criteria set for the Sunrise phase.
Upon completion, a signature is generated using a master key, confirming the user's address eligibility.
The user interacts with the SunriseMintVerifier contract, providing the necessary signature.
The contract verifies the signature against the master address and user address.
If verified, the contract interacts with the Retrobridge NFT contract to mint the Sunrise NFT for the user.

## Signature Generation And Security
The signature is generated off-chain using a master private key on backend system.
Backend takes the user address, that completed the tasks, and sign user address by master private key. Each user has unique addresses and each signature will be unique using same master private key. User1, that has the signature of user2, will not be eligible for minting to user2, because user1 dont have private key of user2.

## Initialization

1. install packages
```
yarn
```

2. copy .env file
```
cp .env.example .env
```

3. fill .env

4. compile contracts
```
yarn hardhat compile
```

## Deployment

Deployment to sepolia:
```
yarn hardhat run scripts/deploy.ts --network sepolia
```