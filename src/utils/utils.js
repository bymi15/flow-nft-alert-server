import moment from "moment";
import {
  IPFS_GATEWAY,
  SALE_PAYMENT_VAULT_TYPE_DUC,
  SALE_PAYMENT_VAULT_TYPE_FLOW,
  SALE_PAYMENT_VAULT_TYPE_FUSD,
  SALE_PAYMENT_VAULT_TYPE_FUT,
} from "./constants";

export const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const shouldProcessStorefrontEvent = (contractName) =>
  ["FlowversePass", "FlowverseTreasures", "FlowverseSocks", "Wearables", "SturdyItems"].includes(
    contractName
  );

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
