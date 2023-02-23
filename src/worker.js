import "reflect-metadata";

import moment from "moment";
import Container from "typedi";
import config from "./config";
import EmailJobs from "./jobs/emailJobs";
import agendaFactory from "./loaders/agenda";
import { injectDependencies } from "./loaders/dependencyInjector";
import Logger from "./loaders/logger";
import mongooseLoader from "./loaders/mongoose";
import nodemailerFactory from "./loaders/nodemailer";

(async function () {
  Container.set("logger", Logger);
  const mongoConnection = await mongooseLoader({});
  const agenda = agendaFactory({ mongoConnection });
  Container.set("agenda", agenda);
  const transporter = nodemailerFactory();
  Container.set("transporter", transporter);
  await injectDependencies();

  Logger.info("-- Worker dependencies loaded --");

  const emailJobs = new EmailJobs();

  agenda.define(
    "send-listing-alert-email",
    { priority: "high", concurrency: config.AGENDA.CONCURRENCY },
    emailJobs.sendListingAlertEmail
  );

  agenda.on("fail", (_, job) => {
    job.attrs.nextRunAt = moment().add(60, "minutes").toDate(); // retry 1 hour later
    job.save();
  });

  await agenda.start();

  Logger.info("Waiting for jobs...");
})();
