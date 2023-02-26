// First phase of filtering

import { PRICE_ABOVE_ALERT_TYPE, PRICE_BELOW_ALERT_TYPE } from "./constants";

// Filter alerts by event
export const filterAlertsByEvent = (
  alerts,
  contractName,
  contractAddress,
  nftID,
  price,
  currency
) => {
  return alerts
    ? alerts.filter((alert) => {
        if (alert.contractName === contractName && alert.contractAddress === contractAddress) {
          if (alert.alertType === NEW_LISTING_ALERT_TYPE) {
            return alert.nftID !== undefined ? nftID === alert.nftID : true;
          } else if (alert.alertType === PRICE_BELOW_ALERT_TYPE) {
            return (
              (alert.nftID === undefined || nftID === alert.nftID) &&
              parseFloat(price) <= parseFloat(alert.price) &&
              currency === alert.currency
            );
          } else if (alert.alertType === PRICE_ABOVE_ALERT_TYPE) {
            return (
              (alert.nftID === undefined || nftID === alert.nftID) &&
              parseFloat(price) > parseFloat(alert.price) &&
              currency === alert.currency
            );
          }
        }
      })
    : [];
};

// Second phase of filtering
// Filter alert by NFT metadata
export const filterAlertByNFTMetadata = (alert, nftMetadata) => {
  return (
    (alert.name === undefined ||
      nftMetadata.name.toLowerCase().includes(alert.name.toLowerCase())) &&
    (alert.serialNumber === undefined ||
      parseInt(nftMetadata.serialNumber) === alert.serialNumber ||
      (nftMetadata.editions?.length > 0 &&
        parseInt(listingMetadata.nft.editions[0].number) === alert.serialNumber))
  );
};

// listingMetadata.nft.editions.length > 0
//         ? parseInt(listingMetadata.nft.editions[0].number)
