import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

const cadence = `
import TopShot from 0xTopShot
import MetadataViews from 0xMetadataViews

pub struct CollectionItem {
  pub let nftID: UInt64
  pub let nftUUID: UInt64
  pub let name: String
  pub let description: String
  pub let thumbnail: String
  pub let externalURL: String
  pub let owner: Address?
  pub let royalties: [MetadataViews.Royalty]
  pub let medias: [MetadataViews.Media]

  pub let publicLinkedType: Type
  pub let collectionName: String
  pub let collectionDescription: String
  pub let collectionSquareImage: String
  pub let collectionBannerImage: String
  pub let collectionSocials: {String: MetadataViews.ExternalURL}

  init(
      nftID: UInt64,
      nftUUID: UInt64,
      name: String,
      description: String,
      thumbnail: String,
      externalURL: String,
      owner: Address?,
      royalties: [MetadataViews.Royalty],
      medias: [MetadataViews.Media],
      publicLinkedType: Type,
      collectionName: String,
      collectionDescription: String,
      collectionSquareImage: String,
      collectionBannerImage: String,
      collectionSocials: {String: MetadataViews.ExternalURL}
  ) {
      self.nftID = nftID
      self.nftUUID = nftUUID
      self.name = name
      self.description = description
      self.thumbnail = thumbnail
      self.externalURL = externalURL
      self.owner = owner
      self.royalties = royalties
      self.medias = medias
      self.publicLinkedType = publicLinkedType
      self.collectionName = collectionName
      self.collectionDescription = collectionDescription
      self.collectionSquareImage = collectionSquareImage
      self.collectionBannerImage = collectionBannerImage
      self.collectionSocials = collectionSocials
  }
}

pub fun main(account: Address, nftID: UInt64): CollectionItem {
    let collectionRef = getAccount(account).getCapability(/public/MomentCollection)
        .borrow<&{TopShot.MomentCollectionPublic}>()
        ?? panic("Could not get reference to public TopShot collection")
    let nftRef = collectionRef.borrowNFT(id: nftID)
    
    let displayView = nftRef.resolveView(Type<MetadataViews.Display>())! as! MetadataViews.Display
    let externalURLView = nftRef.resolveView(Type<MetadataViews.ExternalURL>())! as! MetadataViews.ExternalURL
    let collectionDataView = nftRef.resolveView(Type<MetadataViews.NFTCollectionData>())! as! MetadataViews.NFTCollectionData
    let collectionDisplayView = nftRef.resolveView(Type<MetadataViews.NFTCollectionDisplay>())! as! MetadataViews.NFTCollectionDisplay
    let royaltyView = nftRef.resolveView(Type<MetadataViews.Royalties>())! as! MetadataViews.Royalties

    let mediasView = nftRef.resolveView(Type<MetadataViews.Medias>())
    
    if (displayView == nil || externalURLView == nil || collectionDataView == nil || collectionDisplayView == nil || royaltyView == nil) {
        // This NFT does not have the proper views implemented.
        panic("NFT does not have proper metadata views implemented.")
    }

    var medias: [MetadataViews.Media] = []
    if mediasView != nil {
        medias = (mediasView! as! MetadataViews.Medias).items
    }
    return CollectionItem (
        nftID: listingDetails.nftID,
        nftUUID: nftRef!.uuid,
        name: displayView!.name,
        description : displayView!.description,
        thumbnail : displayView!.thumbnail.uri(),
        externalURL : externalURLView!.url,
        owner: account,
        royalties : royaltyView!.getRoyalties(),
        medias: medias,
        publicLinkedType : collectionDataView!.publicLinkedType,
        collectionName : collectionDisplayView!.name,
        collectionDescription : collectionDisplayView!.description,
        collectionSquareImage : collectionDisplayView!.squareImage.file.uri(),
        collectionBannerImage : collectionDisplayView!.bannerImage.file.uri(),
        collectionSocials: collectionDisplayView!.socials
    )
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
