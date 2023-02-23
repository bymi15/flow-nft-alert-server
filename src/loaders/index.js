import Container from "typedi";
import config from "../config";
import agendaFactory from "./agenda";
import { injectDependencies } from "./dependencyInjector";
import expressLoader from "./express";
import fclLoader from "./fcl";
import Logger from "./logger";
import mongooseLoader from "./mongoose";

export default async ({ expressApp, env, databaseURL }) => {
  const mongoConnection = await mongooseLoader({ databaseURL });
  Logger.info("-- Connected to DB --");

  const agenda = agendaFactory({ mongoConnection });
  Container.set("agenda", agenda);
  Logger.info("-- Loaded Agenda --");

  await injectDependencies();
  Logger.info("-- Injected Dependencies --");

  fclLoader(env ?? config.FCL_ENVIRONMENT);
  Logger.info(`-- Loaded FCL ${config.FCL_ENVIRONMENT} config --`);

  if (expressApp) {
    expressLoader({ app: expressApp });
    Logger.info("-- Loaded Express --");
  }
};
