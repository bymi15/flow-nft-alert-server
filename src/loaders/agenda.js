import Agenda from "agenda";
import config from "../config";

export default ({ mongoConnection }) => {
  return new Agenda({
    mongo: mongoConnection,
    db: { collection: config.AGENDA.DB_COLLECTION },
    processEvery: config.AGENDA.POOL_TIME,
    maxConcurrency: config.AGENDA.CONCURRENCY,
  });
};
