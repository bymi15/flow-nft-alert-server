import { Container } from "typedi";
import Logger from "./logger";

const dependencyInjector = (models) => {
  try {
    models.forEach((m) => {
      Container.set(m.name, m.model);
    });
    Container.set("logger", Logger);
  } catch (e) {
    throw e;
  }
};

export const injectDependencies = async () => {
  dependencyInjector([
    {
      name: "alertModel",
      model: (await import("../models/Alert.js")).default,
    },
    {
      name: "blockModel",
      model: (await import("../models/Block.js")).default,
    },
    {
      name: "metricModel",
      model: (await import("../models/Metric.js")).default,
    },
  ]);
};
