import { Container } from "typedi";
import EmailService from "../services/EmailService";

export default class EmailJobs {
  async sendListingAlertEmail(job) {
    const logger = Container.get("logger");
    const emailService = Container.get(EmailService);
    await emailService.sendListingAlertEmail(job.attrs.data);
    logger.info(`Listing alert email has been sent!`);
  }
}
