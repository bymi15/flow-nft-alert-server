import "reflect-metadata";
import Container from "typedi";
import loader from "./loaders";
import Logger from "./loaders/logger";
import nodemailerFactory from "./loaders/nodemailer";
import EmailService from "./services/EmailService";

(async function () {
  await loader({});
  const transporter = nodemailerFactory();
  Container.set("transporter", transporter);
  Logger.info(`
      ################################################
      Test email started
      ################################################
    `);

  const emailService = Container.get(EmailService);
  await emailService.sendListingAlertEmail({
    email: "flownftalert@gmail.com",
    data: {
      name: "Test NFT",
      description: "Test NFT description",
      thumbnailURL: "https://chainbase.media.nft.matrixlabs.org/FlowverseSocks/default.gif",
      nftID: 23,
      nftUUID: 442949765,
      salePrice: 500,
      currency: "FLOW",
      transactionID: "0x0",
    },
  });
  Logger.info("Email sent.");
  process.exit(0);
})();
