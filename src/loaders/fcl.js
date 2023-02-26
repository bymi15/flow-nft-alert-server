import * as fcl from "@onflow/fcl";

export default (env) => {
  switch (env) {
    case "testnet":
      fcl
        .config()
        .put("flow.network", env)
        .put("app.detail.title", "Flow NFT Alert Server")
        .put("accessNode.api", "https://rest-testnet.onflow.org")
        .put("discovery.authn.endpoint", "https://fcl-discovery.onflow.org/api/testnet/authn")
        .put("0xNFTMetadataUtility", "0x13757baecc82973b");
      break;
    case "mainnet":
      fcl
        .config()
        .put("flow.network", env)
        .put("app.detail.title", "Flow NFT Alert Server")
        .put("accessNode.api", "https://rest-mainnet.onflow.org")
        .put("discovery.authn.endpoint", "https://fcl-discovery.onflow.org/api/authn")
        .put("0xNFTMetadataUtility", "0x5425d4a12d3b88de");
      break;
  }
};
