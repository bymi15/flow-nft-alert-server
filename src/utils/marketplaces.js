const FLOWVERSE_NFT_SUPPORTED_CONTRACTS = [
  "FlowversePass",
  "FlowverseSocks",
  "Wearables",
  "SturdyItems",
  "FlowverseTreasures",
];

const mapFlowverseNFTContractNameToSlugName = (contractName) => {
  switch (contractName) {
    case "Wearables":
      return "Doodles2Wearables";
    case "SturdyItems":
      return "Hoodlums";
    default:
      return contractName;
  }
};

export const getAvailableMarketplaces = (
  storefrontContractName,
  storefrontContractAddress,
  contractName,
  contractAddress,
  ownerAddress,
  nftID
) => {
  const storefront = `${storefrontContractName}.${storefrontContractAddress}`;
  let marketplaces = [];
  switch (storefront) {
    // General NFTStorefrontV2
    case "NFTStorefrontV2.0x4eb8a10cb9f87357":
      if (FLOWVERSE_NFT_SUPPORTED_CONTRACTS.includes(contractName)) {
        marketplaces.push({
          name: "Flowverse NFT",
          url: `https://nft.flowverse.co/collections/${mapFlowverseNFTContractNameToSlugName(
            contractName
          )}/${ownerAddress}/${nftID}`,
        });
      }
      break;
    // FLowty's NFTStorefrontV2
    case "NFTStorefrontV2.0x3cdbb3d569211ff3":
      marketplaces.push({
        name: "Flowty",
        url: `https://www.flowty.io/asset/${contractAddress}/${contractName}/${nftID}`,
      });
    case "NFTStorefront.0x4eb8a10cb9f87357":
      marketplaces.push({
        name: "Matrix Market",
        url: `https://matrixmarket.xyz/collection/mainnet_flow-A.${ownerAddress.substring(
          2
        )}.${contractName}/${nftID}`,
      });
    case "TopShotMarketV3.0xc1e4f4f4c4257510":
      marketplaces.push({ name: "NBA Top Shot", url: "" });
      break;
  }
  return marketplaces;
};
