import { Service } from "typedi";

@Service()
export default class BlockService {
  constructor(container) {
    this.blockModel = container.get("blockModel");
    this.logger = container.get("logger");
  }

  async create({ initialBlockHeight, ...data }) {
    try {
      await this.blockModel.create({
        ...data,
        initialBlockHeight,
        lastCheckedBlockHeight: initialBlockHeight,
      });
      this.logger.info("Successfully created block.");
    } catch (err) {
      this.logger.error("Error while creating block...");
      this.logger.error(err);
    }
  }

  async get(query) {
    let record;
    try {
      record = await this.blockModel.find(query).sort({ createdAt: 1 });
    } catch (err) {
      this.logger.error("Error while finding blocks...");
      this.logger.error(err);
    }
    return record;
  }
}
