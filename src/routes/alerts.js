import { celebrate, Joi } from "celebrate";
import * as EmailValidator from "email-validator";
import express from "express";
import { Container } from "typedi";
import AlertService from "../services/AlertService";

const alertRoutes = express.Router();

alertRoutes.get("/", async (_, res) => {
  const alertService = Container.get(AlertService);
  const liveAlerts = await alertService.getLiveAlerts();
  res.status(200).json(liveAlerts);
});

alertRoutes.post(
  "/",
  celebrate({
    body: Joi.object({
      contractName: Joi.string(),
      contractAddress: Joi.string(),
      email: Joi.string(),
      alertType: Joi.string(),
      nftID: Joi.number().integer().min(0).empty(""),
      serialNumber: Joi.number().integer().min(0).empty(""),
      name: Joi.string().empty(""),
      price: Joi.number().min(0),
      currency: Joi.string(),
      expiry: Joi.number().empty(""),
    }),
  }),
  async (req, res) => {
    const alertService = Container.get(AlertService);
    if (!EmailValidator.validate(req.body.email)) {
      res.status(400).json({ error: "Please provide a valid email address." });
      return;
    }
    const numberOfActiveAlerts = await alertService.checkActiveAlertCountByEmail({
      email: req.body.email,
    });
    if (numberOfActiveAlerts > 10) {
      res.status(400).json({ error: "You can only have 10 active alerts at a time." });
      return;
    }
    const alertExists = await alertService.checkExistingActiveAlert(req.body);
    if (alertExists) {
      res.status(400).json({ error: "You already have an active alert." });
      return;
    }
    await alertService.create({ ...req.body, active: true });
    res.status(200).json();
  }
);
export default alertRoutes;
