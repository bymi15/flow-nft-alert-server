import "reflect-metadata";

import Container from "typedi";
import Processor from "./processor";

(async function () {
  await (await import("./loaders")).default({});
  const eventProcessor = Container.get(Processor);
  while (1) {
    await eventProcessor.process();
  }
})();
