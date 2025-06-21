import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
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
  docgen: {
    // Optional: Customize the configuration
  },
};

export default config;
