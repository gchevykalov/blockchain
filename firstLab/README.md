## Files:
+ opensea_nft.sol - smart-contract in Solidity;
+ nft_dashboard - web-interface which allows to see amount of tokens, mint and transfer them;
+ storage - files which store NFTs in correct format for OpenSea;

## Tools:
+ remix.ethereum.org as Solidity IDE
+ rinkeby test network
+ MetaMask as online wallet
+ moralis.io service for everything else

##Note:
There is an ambiguous thing in the code - a forced delay to avoid errors related to moralis restrictions, in this regard, loading index.html it takes a long time.