import express from "express";
import { Container } from "typedi";
import MetricService from "../services/MetricService";

const metricRoutes = express.Router();

metricRoutes.get("/", async (_, res) => {
  const metricService = Container.get(MetricService);
  const metrics = await metricService.get();
  res.status(200).json(metrics);
});

metricRoutes.get("/:contractName", async (req, res) => {
  const metricService = Container.get(MetricService);
  const metric = await metricService.getByContractName(req.params.contractName);
  res.status(200).json(metric);
});

export default metricRoutes;
