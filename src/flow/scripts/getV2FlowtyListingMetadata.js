import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

const cadence = `
import NFTMetadataUtility from 0xNFTMetadataUtility

pub fun main(owner: Address, listingResourceID: UInt64): NFTMetadataUtility.StorefrontItem {
    return NFTMetadataUtility.getStorefrontV2FlowtyListingMetadata(owner: owner, listingResourceID: listingResourceID)
}
`;

export const getV2FlowtyListingMetadata = async (contractName, userAddress, listingResourceID) => {
  try {
    const script = await fcl.send([
      fcl.script(cadence),
      fcl.args([fcl.arg(userAddress, t.Address), fcl.arg(listingResourceID.toString(), t.UInt64)]),
    ]);
    return await fcl.decode(script);
  } catch (err) {
    console.log(
      "Failed to fetch V2 Flowty Listing Metadata [" +
        contractName +
        "] listingResourceID: " +
        listingResourceID
    );
    console.log(err);
  }
  return null;
};
