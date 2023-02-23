import { Service } from "typedi";

@Service()
export default class Scheduler {
  constructor(container) {
    this.agenda = container.get("agenda");
    this.logger = container.get("logger");
  }
  async sendListingAlertEmail(data) {
    const job = this.agenda.create("send-listing-alert-email", data);
    await job.save();
    this.logger.info("Scheduled agenda job 'send-listing-alert-email'");
  }
}
