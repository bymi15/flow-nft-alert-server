import { Service } from "typedi";
import { getV1ListingMetadata } from "../flow/scripts/getV1ListingMetadata";
import Scheduler from "../jobs/scheduler";
import AlertService from "../services/AlertService";
import MetricService from "../services/MetricService";
import { filterAlertsByEvent } from "../utils/alertUtils";
import { STOREFRONT_V1_ADDRESS, STOREFRONT_V1_CONTRACT_NAME } from "../utils/constants";
import { getContractInfoFromType } from "../utils/flowEvents";
import {
  formatAsLongUTCDate,
  parseCurrencyFromSalePaymentVaultType,
  parseIPFSURL,
} from "../utils/utils";

@Service()
export default class StorefrontV1Processor {
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
      event.price,
      parseCurrencyFromSalePaymentVaultType(event.ftVaultType)
    );
    if (matchingAlerts.length > 0) {
      this.logger.info(
        `<${STOREFRONT_V1_CONTRACT_NAME}> Processing ListingAvailable event for ${contractName}, NFT ID ${event.nftID}...`
      );
      try {
        const listingMetadata = await getV1ListingMetadata(
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
              salePrice: event.price,
              currency: parseCurrencyFromSalePaymentVaultType(event.ftVaultType),
              transactionID,
              storefrontContractName: STOREFRONT_V1_CONTRACT_NAME,
              storefrontContractAddress: STOREFRONT_V1_ADDRESS,
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
