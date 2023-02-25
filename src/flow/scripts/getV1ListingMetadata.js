import * as fcl from "@onflow/fcl";
import * as t from "@onflow/types";

const cadence = `
import NFTStorefront from 0xNFTStorefront
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

pub struct SaleItem {
  pub let nft: CollectionItem

  // Storefront Item info
  pub let listingResourceID: UInt64
  pub let storefrontID: UInt64
  pub let purchased: Bool
  pub let nftType: Type
  pub let salePaymentVaultType: Type
  pub let salePrice: UFix64
  pub let saleCuts: [NFTStorefront.SaleCut]

  init(
      nft: CollectionItem,
      listingResourceID: UInt64,
      storefrontID: UInt64,
      purchased: Bool,
      nftType: Type,
      salePaymentVaultType: Type,
      salePrice: UFix64,
      saleCuts: [NFTStorefront.SaleCut]
  ) {
      self.nft = nft
      self.listingResourceID = listingResourceID
      self.storefrontID = storefrontID
      self.purchased = purchased
      self.nftType = nftType
      self.salePaymentVaultType = salePaymentVaultType
      self.salePrice = salePrice
      self.saleCuts = saleCuts
  }
}

pub fun main(account: Address, nftID: UInt64, listingResourceID: UInt64): SaleItem {
    let storefrontRef = getAccount(account)
        .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
            NFTStorefront.StorefrontPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public storefront from address")
    let listing = storefrontRef.borrowListing(listingResourceID: listingResourceID)
        ?? panic("No item with that ID")
    let listingDetails = listing.getDetails()

    let nftRef = listing.borrowNFT() ?? panic("nft not found")
    
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
    return SaleItem(
        nft: CollectionItem (
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
        ),
        listingResourceID: id,
        storefrontID: listingDetails.storefrontID,
        purchased: listingDetails.purchased,
        nftType: listingDetails.nftType,
        salePaymentVaultType: listingDetails.salePaymentVaultType,
        salePrice: listingDetails.salePrice,
        saleCuts: listingDetails.saleCuts
    )
}
`;

export const getV1ListingMetadata = async (contractName, userAddress, nftID, listingResourceID) => {
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
    console.log(
      "Failed to fetch V1 Listing Metadata [" +
        contractName +
        "] NFT ID: " +
        nftID +
        ", listingResourceID: " +
        listingResourceID
    );
    console.log(err);
  }
  return null;
};
