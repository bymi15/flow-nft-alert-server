export const getEventTypes = (storefrontContractName) => {
  switch (storefrontContractName) {
    case "TopShotMarketV3":
      return ["MomentListed"];
    default:
      return ["ListingAvailable"];
  }
};
