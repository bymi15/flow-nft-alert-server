import { backOff } from "exponential-backoff";
import { Service } from "typedi";
import config from "../config";
import AlertService from "../services/AlertService";
import BlockService from "../services/BlockService";
import {
  STOREFRONT_V1_ADDRESS,
  STOREFRONT_V1_CONTRACT_NAME,
  STOREFRONT_V2_ADDRESS,
  STOREFRONT_V2_CONTRACT_NAME,
  STOREFRONT_V2_FLOWTY_ADDRESS,
  TOPSHOT_MARKETPLACE_ADDRESS,
  TOPSHOT_MARKETPLACE_CONTRACT_NAME,
} from "../utils/constants";
import { getLatestBlockHeight, queryEvents, transformEventToObject } from "../utils/flowEvents";
import { getEventTypes } from "./eventTypes";
import StorefrontV1Processor from "./StorefrontV1Processor";
import StorefrontV2FlowtyProcessor from "./StorefrontV2FlowtyProcessor";
import StorefrontV2Processor from "./StorefrontV2Processor";
import TopshotProcessor from "./TopshotProcessor";

@Service()
export default class Processor {
  constructor(container) {
    this.logger = container.get("logger");
    this.blockService = container.get(BlockService);
    this.alertService = container.get(AlertService);
    this.processor = {
      [`${STOREFRONT_V2_CONTRACT_NAME}.${STOREFRONT_V2_ADDRESS}`]:
        container.get(StorefrontV2Processor),
      [`${STOREFRONT_V2_CONTRACT_NAME}.${STOREFRONT_V2_FLOWTY_ADDRESS}`]: container.get(
        StorefrontV2FlowtyProcessor
      ),
      [`${STOREFRONT_V1_CONTRACT_NAME}.${STOREFRONT_V1_ADDRESS}`]:
        container.get(StorefrontV1Processor),
      [`${TOPSHOT_MARKETPLACE_CONTRACT_NAME}.${TOPSHOT_MARKETPLACE_ADDRESS}`]:
        container.get(TopshotProcessor),
    };
  }

  async processBlocks(blocks) {
    const latestBlockHeight = await getLatestBlockHeight();
    if (blocks) {
      for (let block of blocks) {
        const checkBlockHeight = Math.max(block.lastCheckedBlockHeight, block.initialBlockHeight);
        const range = latestBlockHeight - checkBlockHeight;
        if (range > 0) {
          this.logger.info(
            `<${block.contractName}> Querying events at block height ${checkBlockHeight} (${range} remaining)...`
          );
          let start = checkBlockHeight + 1;
          let end = Math.min(latestBlockHeight, start + config.MAX_BLOCK_SCAN_RANGE);
          const maxBlockHeight = Math.min(
            start + config.MAX_PROCESS_HEIGHT_PER_BLOCK_ITERATION,
            latestBlockHeight
          );
          while (start < maxBlockHeight) {
            const eventTypes = getEventTypes(block.contractName);
            const liveAlerts = await this.alertService.getLiveAlerts();
            for (let eventType of eventTypes) {
              let rawEvents = [];
              try {
                rawEvents = await backOff(
                  () =>
                    queryEvents(block.contractAddress, block.contractName, eventType, start, end),
                  config.BACKOFF_OPTIONS
                );
              } catch (err) {
                this.logger.error(`<${block.contractName}> Error while fetching events...`);
                this.logger.error(err);
              }

              for (let rawEvent of rawEvents) {
                const processedEvent = transformEventToObject(rawEvent);
                let processor = this.processor[`${block.contractName}.${block.contractAddress}`];
                if (processor) {
                  await processor.processListingEvent(
                    rawEvent.transactionId,
                    processedEvent,
                    liveAlerts
                  );
                }
              }
            }

            try {
              block.lastCheckedBlockHeight = end;
              await block.save();
            } catch (err) {
              this.logger.error(
                `<${block.contractName}> Error while updating lastCheckedBlockHeight...`
              );
            }

            start = end + 1;
            end = Math.min(maxBlockHeight, start + config.MAX_BLOCK_SCAN_RANGE);
          }
          this.logger.info(
            `<${block.contractName}> Completed processing ${
              maxBlockHeight - checkBlockHeight
            } blocks.`
          );
        }
      }
    } else {
      this.logger.info("No remaining blocks to process.");
    }
    this.logger.info("Sleeping...");
    await sleep(config.SLEEP_INTERVAL);
  }

  async process() {
    const blocks = await this.blockService.get();
    await this.processBlocks(blocks);
  }
}
