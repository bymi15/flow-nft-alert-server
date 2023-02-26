import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

const cadence = `
import NFTMetadataUtility from 0xNFTMetadataUtility

pub fun main(owner: Address, nftID: UInt64): NFTMetadataUtility.CollectionItem {
    return NFTMetadataUtility.getTopShotMetadata(owner: owner, nftID: nftID)
}
`;

export const getTopshotMetadata = async (userAddress, nftID) => {
  try {
    const script = await fcl.send([
      fcl.script(cadence),
      fcl.args([
        fcl.arg(userAddress, t.Address),
        fcl.arg(nftID.toString(), t.UInt64),
        fcl.arg(listingResourceID.toString(), t.UInt64),
      ]),
    ]);
    return await fcl.decode(script);
  } catch (err) {
    console.log("Failed to fetch metadata [TopShot] NFT ID: " + nftID);
    console.log(err);
  }
  return null;
};
