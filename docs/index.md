# Solidity API

## FundMe__NotOwner

```solidity
error FundMe__NotOwner()
```

## FundMe

This contract is for creating a sample funding contract

_This implements price feeds as our library_

### MINIMUM_USD

```solidity
uint256 MINIMUM_USD
```

### onlyOwner

```solidity
modifier onlyOwner()
```

### constructor

```solidity
constructor(address priceFeedAddress) public
```

### fund

```solidity
function fund() public payable
```

Funds our contract based on the ETH/USD price

### withdraw

```solidity
function withdraw() public
```

### cheaperWithdraw

```solidity
function cheaperWithdraw() public
```

### getAddressToAmountFunded

```solidity
function getAddressToAmountFunded(address fundingAddress) public view returns (uint256)
```

Gets the amount that an address has funded
 @param fundingAddress the address of the funder
 @return the amount funded

### getVersion

```solidity
function getVersion() public view returns (uint256)
```

### getFunder

```solidity
function getFunder(uint256 index) public view returns (address)
```

### getOwner

```solidity
function getOwner() public view returns (address)
```

### getPriceFeed

```solidity
function getPriceFeed() public view returns (contract AggregatorV3Interface)
```

## PriceConverter

### getPrice

```solidity
function getPrice(contract AggregatorV3Interface priceFeed) internal view returns (uint256)
```

### getConversionRate

```solidity
function getConversionRate(uint256 ethAmount, contract AggregatorV3Interface priceFeed) internal view returns (uint256)
```

