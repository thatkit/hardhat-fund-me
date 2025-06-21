import { vars } from 'hardhat/config';
import { buildModule } from '@nomicfoundation/hardhat-ignition/modules';

const FundMeModule = buildModule('FundMeModule', (m) => {
  const fundMe = m.contract("FundMe", [vars.get('PRICE_FEED_ADDRESS')]);

  return { fundMe };
});

export default FundMeModule;
