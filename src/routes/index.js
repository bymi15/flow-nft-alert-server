import { Router } from "express";
import { authMiddleware } from "../utils/auth";
import alerts from "./alerts";
import metrics from "./metrics";

export default () => {
  const app = Router();
  app.use(authMiddleware);
  app.use("/alerts", alerts);
  app.use("/metrics", metrics);
  return app;
};
