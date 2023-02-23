import { Service } from "typedi";

@Service()
export default class MetricService {
  constructor(container) {
    this.metricModel = container.get("metricModel");
    this.logger = container.get("logger");
  }

  async getByContractName(contractName) {
    let record;
    try {
      record = await this.metricModel.findOne({ contractName });
    } catch (err) {
      this.logger.error("Error while finding metric...");
      this.logger.error(err);
    }
    return record;
  }

  async get(query) {
    let records;
    try {
      records = await this.metricModel.find(query).sort({ createdAt: -1 });
    } catch (err) {
      this.logger.error("Error while finding metrics...");
      this.logger.error(err);
    }
    return records;
  }

  async create(data) {
    try {
      await this.metricModel.create(data);
    } catch (err) {
      this.logger.error("Error while creating metric...");
      this.logger.error(err);
    }
  }

  async updateMetrics({
    contractName,
    contractAddress,
    sentAlerts,
    activeAlerts,
    activeUniqueUsers,
  }) {
    try {
      let metric = await this.metricModel.findOne({ contractName, contractAddress });
      if (metric) {
        metric.sentAlerts = parseInt(metric.sentAlerts ?? 0) + parseInt(sentAlerts);
        metric.activeAlerts = activeAlerts;
        metric.activeUniqueUsers = activeUniqueUsers;
        await metric.save();
      } else {
        await this.metricModel.create({
          contractName,
          contractAddress,
          sentAlerts,
          activeAlerts,
          activeUniqueUsers,
        });
      }
    } catch (err) {
      this.logger.error("Error while updating metrics...");
      this.logger.error(err);
    }
  }
}
