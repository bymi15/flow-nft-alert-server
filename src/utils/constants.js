import config from "../config";

export const NEW_LISTING_ALERT_TYPE = "NEW_LISTING";
export const FLOOR_PRICE_ALERT_TYPE = "FLOOR_PRICE";

export const STOREFRONT_V1_CONTRACT_NAME = "NFTStorefront";
export const STOREFRONT_V1_ADDRESS = "0x4eb8a10cb9f87357";
export const STOREFRONT_V2_CONTRACT_NAME = "NFTStorefrontV2";
export const STOREFRONT_V2_ADDRESS = "0x4eb8a10cb9f87357";
export const STOREFRONT_V2_FLOWTY_ADDRESS = "0x3cdbb3d569211ff3";
export const TOPSHOT_MARKETPLACE_CONTRACT_NAME = "TopShotMarketV3";
export const TOPSHOT_MARKETPLACE_ADDRESS = "0xc1e4f4f4c4257510";

export const FLOWSCAN_URL =
  config.FCL_ENVIRONMENT === "testnet" ? "https://testnet.flowscan.org" : "https://flowscan.org";

export const IPFS_GATEWAY = "https://ipfs.io/ipfs";

export const SALE_PAYMENT_VAULT_TYPE_FLOW =
  config.FCL_ENVIRONMENT === "mainnet"
    ? "A.1654653399040a61.FlowToken.Vault"
    : "A.7e60df042a9c0868.FlowToken.Vault";

export const SALE_PAYMENT_VAULT_TYPE_FUT =
  config.FCL_ENVIRONMENT === "mainnet"
    ? "A.ead892083b3e2c6c.FlowUtilityToken.Vault"
    : "A.82ec283f88a62e65.FlowUtilityToken.Vault";

export const SALE_PAYMENT_VAULT_TYPE_DUC =
  config.FCL_ENVIRONMENT === "mainnet"
    ? "A.ead892083b3e2c6c.DapperUtilityCoin.Vault"
    : "A.82ec283f88a62e65.DapperUtilityCoin.Vault";

export const SALE_PAYMENT_VAULT_TYPE_FUSD =
  config.FCL_ENVIRONMENT === "mainnet"
    ? "A.3c5959b568896393.FUSD.Vault"
    : "A.e223d8a629e49c68.FUSD.Vault";

export const SALE_PAYMENT_VAULT_TYPE_USDC =
  config.FCL_ENVIRONMENT === "mainnet"
    ? "A.b19436aae4d94622.FiatToken.Vault"
    : "A.a983fecbed621163.FiatToken.Vault";
