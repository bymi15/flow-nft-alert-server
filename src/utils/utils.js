import moment from "moment";
import {
  FLOOR_PRICE_ALERT_TYPE,
  IPFS_GATEWAY,
  NEW_LISTING_ALERT_TYPE,
  SALE_PAYMENT_VAULT_TYPE_DUC,
  SALE_PAYMENT_VAULT_TYPE_FLOW,
  SALE_PAYMENT_VAULT_TYPE_FUSD,
  SALE_PAYMENT_VAULT_TYPE_FUT,
} from "./constants";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
          } else if (alert.alertType === FLOOR_PRICE_ALERT_TYPE) {
            return (
              (alert.nftID === undefined || nftID === alert.nftID) &&
              parseFloat(price) <= parseFloat(alert.floorPrice) &&
              currency === alert.currency
            );
          }
        }
      })
    : [];
};

export const shouldProcessStorefrontEvent = (contractName) =>
  ["FlowversePass", "FlowverseTreasures", "FlowverseSocks", "Wearables", "SturdyItems"].includes(
    contractName
  );

export const shouldProcessStorefrontV1Event = (contractName) =>
  ["FlowverseSocks"].includes(contractName);

export const formatAsLongUTCDate = (dateTime) =>
  moment(dateTime).utc().format("ddd MMM D YYYY, HH:mm:ss") + " UTC/GMT";

export const parseCurrencyFromSalePaymentVaultType = (salePaymentVaultType) => {
  switch (salePaymentVaultType) {
    case SALE_PAYMENT_VAULT_TYPE_FLOW:
    case SALE_PAYMENT_VAULT_TYPE_FUT:
      return "FLOW";
    case SALE_PAYMENT_VAULT_TYPE_DUC:
      return "USD";
    case SALE_PAYMENT_VAULT_TYPE_FUSD:
      return "FUSD";
    default:
      return "FLOW";
  }
};

export const parseIPFSURL = (url) =>
  url?.startsWith("ipfs://")
    ? `${IPFS_GATEWAY}/${url.slice(7)}`
    : url?.includes("/ipfs/")
    ? `${IPFS_GATEWAY}/${url.split("/ipfs/").pop()}`
    : url;
