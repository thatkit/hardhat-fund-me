import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

const config: HardhatUserConfig = {
  solidity: '0.8.28',
  networks: {
    hardhat: {
      accounts: {
        count: 3,
      },
    },
  },
};

export default config;
