import { expect } from 'chai';
import hre, { ethers } from 'hardhat';
import { vars } from 'hardhat/config';
import {  loadFixture } from '@nomicfoundation/hardhat-toolbox/network-helpers';
import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';

import { FundMe, MockV3Aggregator } from '../../typechain-types';

const DECIMALS = 8;
const INITIAL_PRICE = 2000 * 10 ** DECIMALS;

describe('FundMe', () => {
  let fundMe: FundMe;
  let owner: HardhatEthersSigner;
  let acc1: HardhatEthersSigner;
  let acc2: HardhatEthersSigner;

  let mockV3Aggregator: MockV3Aggregator;

  const deployFundMeFixture = async (aggregatorAddress: string) => {
    [owner, acc1, acc2] = await hre.ethers.getSigners();
    const FundMe = await hre.ethers.getContractFactory('FundMe', owner);

    const fundMe = await FundMe.deploy(aggregatorAddress);

    return { fundMe, owner, acc1, acc2 };
  };

  const deployMockV3AggregatorFixture = async () => {
    const accounts = await hre.ethers.getSigners();
    const aggregatorOwner = accounts[3];

    const MockV3Aggregator = await hre.ethers.getContractFactory('MockV3Aggregator', aggregatorOwner);

    const mockV3Aggregator = await MockV3Aggregator.deploy(DECIMALS, INITIAL_PRICE);

    return { mockV3Aggregator };
  };

  const deployAll = async () => {
    const mockV3AggregatorFixture = await loadFixture(deployMockV3AggregatorFixture);
    mockV3Aggregator = mockV3AggregatorFixture.mockV3Aggregator;

    const deployedAggregatorAddress = await mockV3Aggregator.getAddress();

    // OR!
    // const PRICE_FEED_ADDRESS = vars.get('PRICE_FEED_ADDRESS');
    // if (!PRICE_FEED_ADDRESS) {
    //   throw new Error('Specify PRICE_FEED_ADDRESS as vars');
    // }

    const makeDeployFundMeFixture = async () => deployFundMeFixture(deployedAggregatorAddress);

    const fundMeFixture = await loadFixture(makeDeployFundMeFixture);
    fundMe = fundMeFixture.fundMe;
  };

  beforeEach(async () => {
    await deployAll();
  });

  describe('constructor', () => {
    it('should set correct price feed address', async () => {
      const priceFeedAddress = await fundMe.getPriceFeed();
      const addressFromFixture = await mockV3Aggregator.getAddress();

      expect(priceFeedAddress).equal(addressFromFixture);
    });
  });

  describe('fund', () => {
    it('should fail if does not send enough ether', async () => {
      await expect(fundMe.fund()).to.be.revertedWith('You need to spend more ETH!');
    });

    it('should update "amount funded" state variables', async () => {
      const fundValue = ethers.parseEther('1');

      await fundMe.fund({ value: fundValue });

      const response = await fundMe.getAddressToAmountFunded(owner);

      expect(response).equal(fundValue);
    });
  });

  describe('withdraw', () => {
    const initFundValues = [ethers.parseEther('0.7'), ethers.parseEther('0.65')];

    beforeEach(async () => {
      await fundMe.connect(acc1).fund({ value: initFundValues[0] });
      await fundMe.connect(acc2).fund({ value: initFundValues[1] });
    });

    it('should fail if called by attacker', async () => {
      const attacker = acc1;

      // cheaperWithdraw - is about twice cheaper
      await expect(fundMe.connect(attacker).withdraw()).to.be.revertedWithCustomError(fundMe, 'FundMe__NotOwner');
    });

    it('should withdraw by owner', async () => {
      const fundsBefore = await ethers.provider.getBalance(fundMe);
      expect(fundsBefore).to.exist;

      const ownerBalanceBefore = await ethers.provider.getBalance(owner);

      // cheaperWithdraw - is about twice cheaper
      const withdrawal = await fundMe.connect(owner).withdraw();

      const receipt = await withdrawal.wait();

      const fee = receipt?.fee;
      expect(fee).to.exist;

      const fundsAfter = await ethers.provider.getBalance(fundMe);
      const ownerBalanceAfter = await ethers.provider.getBalance(owner);

      expect(fundsAfter).equal(0n);
      expect(ownerBalanceAfter).equal(ownerBalanceBefore + fundsBefore - fee!); // funds are deposited to owner balance (exept for the 'withdrawal' fee)
    });
  });
});

// YT: https://youtu.be/gyMwXuJrbJQ?t=41440
