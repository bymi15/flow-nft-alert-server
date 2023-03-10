import { Service } from "typedi";
import { getTopshotMetadata } from "../flow/scripts/getTopshotMetadata";
import Scheduler from "../jobs/scheduler";
import AlertService from "../services/AlertService";
import MetricService from "../services/MetricService";
import { checkAlertByNFTMetadata, filterAlertsByEvent } from "../utils/alertUtils";
import { TOPSHOT_MARKETPLACE_ADDRESS, TOPSHOT_MARKETPLACE_CONTRACT_NAME } from "../utils/constants";
import { formatAsLongUTCDate, parseIPFSURL } from "../utils/utils";

const contractName = "TopShot";
const contractAddress = "0x0b2a3299cc857e29";

@Service()
export default class TopshotProcessor {
  constructor(container) {
    this.logger = container.get("logger");
    this.alertService = container.get(AlertService);
    this.metricService = container.get(MetricService);
    this.scheduler = container.get(Scheduler);
  }

  async processListingEvent(transactionID, event, alerts) {
    if (!event.seller) {
      this.logger.error(
        `Skipping TopShot listing event as seller is empty... (tx id: ${transactionID})`
      );
    }
    const matchingAlerts = filterAlertsByEvent(
      alerts,
      contractName,
      contractAddress,
      event.id,
      event.price,
      "USD"
    );
    if (matchingAlerts.length > 0) {
      this.logger.info(
        `<${TOPSHOT_MARKETPLACE_CONTRACT_NAME}> Processing ListingAvailable event for ${contractName}, NFT ID ${event.id}...`
      );
      try {
        const nftMetadata = await getTopshotMetadata(event.seller, event.id);
        if (!nftMetadata) {
          this.logger.error(
            `Skipped processing ListingAvailable event for contractName: ${contractName}, NFT ID ${event.id}, listing NFT metadata could not be fetched (tx id: ${transactionID})`
          );
          return;
        }

        // Send email notification
        let sentAlerts = 0;
        const currentDateTime = formatAsLongUTCDate();
        for (let alert of matchingAlerts) {
          // Further processing of alerts
          if (!checkAlertByNFTMetadata(alert, nftMetadata)) {
            continue;
          }
          await this.scheduler.sendListingAlertEmail({
            email: alert.email,
            data: {
              contractName,
              contractAddress,
              name: nftMetadata.name,
              description: nftMetadata.description,
              thumbnailURL: parseIPFSURL(nftMetadata.thumbnail),
              nftID: event.id,
              createdAt: currentDateTime,
              salePrice: event.price,
              currency: "USD",
              transactionID,
              storefrontContractName: TOPSHOT_MARKETPLACE_CONTRACT_NAME,
              storefrontContractAddress: TOPSHOT_MARKETPLACE_ADDRESS,
              ownerAddress: event.seller,
            },
          });

          sentAlerts++;

          // De-activate alert if it's a one-time alert
          if (alert.expiry === undefined) {
            await this.alertService.update({ _id: alert._id }, { active: false });
          }
        }

        // Update metrics
        if (sentAlerts > 0) {
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
        }
      } catch (err) {
        this.logger.error(
          `Error while processing ListingAvailable event... (tx id: ${transactionID})`
        );
        this.logger.error(err);
      }
    }
  }
}
