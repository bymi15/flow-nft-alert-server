import { Service } from "typedi";
import { getV2FlowtyListingMetadata } from "../flow/scripts/getV2FlowtyListingMetadata";
import Scheduler from "../jobs/scheduler";
import AlertService from "../services/AlertService";
import MetricService from "../services/MetricService";
import { STOREFRONT_V2_CONTRACT_NAME, STOREFRONT_V2_FLOWTY_ADDRESS } from "../utils/constants";
import { getContractInfoFromType } from "../utils/flowEvents";
import {
  filterAlertsByEvent,
  formatAsLongUTCDate,
  parseCurrencyFromSalePaymentVaultType,
  parseIPFSURL,
} from "../utils/utils";

@Service()
export default class StorefrontV2FlowtyProcessor {
  constructor(container) {
    this.logger = container.get("logger");
    this.alertService = container.get(AlertService);
    this.metricService = container.get(MetricService);
    this.scheduler = container.get(Scheduler);
  }

  async processListingEvent(transactionID, event, alerts) {
    const { contractAddress, contractName } = getContractInfoFromType(event.nftType);
    const matchingAlerts = filterAlertsByEvent(
      alerts,
      contractName,
      contractAddress,
      event.nftID,
      event.salePrice,
      parseCurrencyFromSalePaymentVaultType(event.salePaymentVaultType)
    );
    if (matchingAlerts.length > 0) {
      this.logger.info(
        `<${STOREFRONT_V2_CONTRACT_NAME}.Flowty> Processing ListingAvailable event for ${contractName}, NFT ID ${event.nftID}...`
      );
      try {
        const listingMetadata = await getV2FlowtyListingMetadata(
          contractName,
          event.storefrontAddress,
          event.nftID,
          event.listingResourceID
        );
        if (!listingMetadata) {
          this.logger.error(
            `Skipped processing ListingAvailable event for contractName: ${contractName}, NFT ID ${event.nftID}, listing NFT metadata could not be fetched (tx id: ${transactionID})`
          );
          return;
        }

        // Send email notification
        const currentDateTime = formatAsLongUTCDate();
        for (let alert of matchingAlerts) {
          await this.scheduler.sendListingAlertEmail({
            email: alert.email,
            data: {
              contractName,
              contractAddress,
              name: listingMetadata.nft.name,
              description: listingMetadata.nft.description,
              thumbnailURL: parseIPFSURL(listingMetadata.nft.thumbnail),
              nftID: event.nftID,
              createdAt: currentDateTime,
              salePrice: event.salePrice,
              currency: parseCurrencyFromSalePaymentVaultType(event.salePaymentVaultType),
              transactionID,
              storefrontContractName: STOREFRONT_V2_CONTRACT_NAME,
              storefrontContractAddress: STOREFRONT_V2_FLOWTY_ADDRESS,
              ownerAddress: event.storefrontAddress,
            },
          });

          // De-activate alert if it's a one-time alert
          if (alert.expiry === undefined) {
            await this.alertService.update({ _id: alert._id }, { active: false });
          }
        }

        // Update metrics
        const sentAlerts = matchingAlerts.length;
        const activeAlerts = await this.alertService.getActiveAlertCount({
          contractName,
          contractAddress,
        });
        const activeUniqueUsers = await this.alertService.getActiveUserCount({
          contractName,
          contractAddress,
        });
        await this.metricService.updateMetrics({
          contractName,
          contractAddress,
          sentAlerts,
          activeAlerts,
          activeUniqueUsers,
        });
      } catch (err) {
        this.logger.error(
          `Error while processing ListingAvailable event... (tx id: ${transactionID})`
        );
        this.logger.error(err);
      }
    }
  }
}
