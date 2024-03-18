import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from 'dotenv';
dotenv.config();

const { 
  MNEMONIC,
  INFURA_API_KEY,
  ETHERSCAN_API_KEY,
  OPTIMISMSCAN_API_KEY,
  ARBITRUMSCAN_API_KEY,
  LINEASCAN_API_KEY,
  DEPLOYER_PRIVATE_KEY
} = process.env

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
      hardhat: {
        forking: {
          url: `https://optimism-mainnet.infura.io/v3/${INFURA_API_KEY}`,
        },
        allowUnlimitedContractSize: false,
        gas: 'auto',
        gasPrice: 'auto',
        accounts: {mnemonic: MNEMONIC}
      },
      sepolia: {
        url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
        gas: 'auto',
        gasPrice: 'auto',
        accounts: {mnemonic: MNEMONIC}
      },
      mainnet: {
        url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
        gas: 'auto',
        gasPrice: 'auto',
        accounts: [DEPLOYER_PRIVATE_KEY as string]
      },
      optimism: {
        url: `https://optimism-mainnet.infura.io/v3/${INFURA_API_KEY}`,
        gas: 'auto',
        gasPrice: 'auto',
        accounts: [DEPLOYER_PRIVATE_KEY as string]
      },
      optimismSepolia: {
        url: `https://optimism-sepolia.infura.io/v3/${INFURA_API_KEY}`,
        gas: 'auto',
        gasPrice: 'auto',
        accounts: [DEPLOYER_PRIVATE_KEY as string]
      },
      arbitrum: {
        url: `https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}`,
        gas: 'auto',
        gasPrice: 'auto',
        accounts: [DEPLOYER_PRIVATE_KEY as string]
      },
      arbitrumSepolia: {
        url: `https://arbitrum-sepolia.infura.io/v3/${INFURA_API_KEY}`,
        gas: 'auto',
        gasPrice: 'auto',
        accounts: [DEPLOYER_PRIVATE_KEY as string]
      },
      linea: {
        url: `https://linea-mainnet.infura.io/v3/${INFURA_API_KEY}`,
        gas: 'auto',
        gasPrice: 'auto',
        accounts: [DEPLOYER_PRIVATE_KEY as string]
      },
      lineaGoerli: {
        url: `https://linea-goerli.infura.io/v3/${INFURA_API_KEY}`,
        gas: 'auto',
        gasPrice: 'auto',
        accounts: [DEPLOYER_PRIVATE_KEY as string]
      },
  },
  etherscan: {
    apiKey: {
      mainnet: ETHERSCAN_API_KEY,
      optimismSepolia: OPTIMISMSCAN_API_KEY,
      optimisticEthereum: OPTIMISMSCAN_API_KEY,
      arbitrumOne: ARBITRUMSCAN_API_KEY,
      arbitrumSepolia: ARBITRUMSCAN_API_KEY,
      linea: LINEASCAN_API_KEY,
      lineaGoerli: LINEASCAN_API_KEY,
    },
    customChains: [
      {
        network: "optimismSepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://api-sepolia-optimistic.etherscan.io/api",
          browserURL: "https://sepolia-optimism.etherscan.io/"
        }
      },
      {
        network: "arbitrumSepolia",
        chainId: 421614,
        urls: {
            apiURL: "https://api-sepolia.arbiscan.io/api",
            browserURL: "https://sepolia.arbiscan.io/",
        },
      },
      {
        network: "lineaGoerli",
        chainId: 59140,
        urls: {
          apiURL: "https://api-testnet.lineascan.build/api",
          browserURL: "https://goerli.lineascan.build/address"
        }
      },
      {
        network: "linea",
        chainId: 59144,
        urls: {
          apiURL: "https://api.lineascan.build/api",
          browserURL: "https://lineascan.build/"
        }
      }
    ]
  }
};

export default config;
