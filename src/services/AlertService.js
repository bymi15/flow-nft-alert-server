import { Service } from "typedi";

@Service()
export default class AlertService {
  constructor(container) {
    this.alertModel = container.get("alertModel");
    this.logger = container.get("logger");
  }

  async getLiveAlerts() {
    let alert;
    try {
      alert = await this.alertModel
        .find({
          active: true,
          $or: [{ expiry: { $gt: Math.floor(Date.now() / 1000) } }, { expiry: { $exists: false } }],
        })
        .sort({ createdAt: -1 });
    } catch (err) {
      this.logger.error("Error while finding alerts...");
      this.logger.error(err);
    }
    return alert;
  }

  async checkActiveAlertCountByEmail({ email }) {
    let count = 0;
    try {
      count = await this.alertModel.count({
        email,
        active: true,
        $or: [{ expiry: { $gt: Math.floor(Date.now() / 1000) } }, { expiry: { $exists: false } }],
      });
    } catch (err) {
      this.logger.error("Error while getting active alert count by email...");
      this.logger.error(err);
    }
    return count;
  }

  async checkExistingActiveAlert(data) {
    try {
      let query = data;
      if (data.expiry) {
        const { expiry, ...remainingData } = data;
        query = remainingData;
      }
      const exists = await this.alertModel.findOne({
        ...query,
        active: true,
        $or: [{ expiry: { $gt: Math.floor(Date.now() / 1000) } }, { expiry: { $exists: false } }],
      });
      if (exists) {
        return true;
      }
    } catch (err) {
      this.logger.error("Error while checking existing active alert...");
      this.logger.error(err);
    }
    return false;
  }

  async getActiveUserCount({ contractName, contractAddress }) {
    let count;
    try {
      count = await this.alertModel.distinct("email").count({
        contractName,
        contractAddress,
        active: true,
        $or: [{ expiry: { $gt: Math.floor(Date.now() / 1000) } }, { expiry: { $exists: false } }],
      });
    } catch (err) {
      this.logger.error("Error while getting active user count...");
      this.logger.error(err);
    }
    return count;
  }

  async getActiveAlertCount({ contractName, contractAddress }) {
    let count;
    try {
      count = await this.alertModel.count({
        contractName,
        contractAddress,
        active: true,
        $or: [{ expiry: { $gt: Math.floor(Date.now() / 1000) } }, { expiry: { $exists: false } }],
      });
    } catch (err) {
      this.logger.error("Error while getting active alert count...");
      this.logger.error(err);
    }
    return count;
  }

  async get(query) {
    let alert;
    try {
      alert = await this.alertModel.find(query).sort({ createdAt: -1 });
    } catch (err) {
      this.logger.error("Error while finding alerts...");
      this.logger.error(err);
    }
    return alert;
  }

  async create(data) {
    try {
      await this.alertModel.create(data);
      this.logger.info("Successfully created alert.");
    } catch (err) {
      this.logger.error("Error while creating alert...");
      this.logger.error(err);
    }
  }

  async update(queryCondition, data) {
    try {
      const alert = await this.alertModel.findOne(queryCondition);
      if (alert) {
        for (let key of Object.keys(data)) {
          alert[key] = data[key];
        }
        await alert.save();
      }
    } catch (err) {
      this.logger.error("Error while updating alert...");
      this.logger.error(err);
    }
  }

  async delete(data) {
    try {
      await this.alertModel.deleteOne(data);
    } catch (err) {
      this.logger.error("Error while deleting alert...");
      this.logger.error(err);
    }
  }
}
