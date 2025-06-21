import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import 'hardhat-gas-reporter';
import 'solidity-docgen';

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    hardhat: {
      accounts: {
        count: 3,
      },
    },
  },
  gasReporter: {
    enabled: true,
  },
  docgen: {
    // Optional: Customize the configuration
  },
};

export default config;
