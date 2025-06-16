import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PRICE_FEED_ADDRESS = '0x694AA1769357215DE4FAC081bf1f309aDC325306';

const FundMeModule = buildModule("FundMeModule", (m) => {
  const fundMe = m.contract("FundMe", [PRICE_FEED_ADDRESS]);

  return { fundMe };
});

export default FundMeModule;
