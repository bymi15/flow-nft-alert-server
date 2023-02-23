import nodemailer from "nodemailer";
import config from "../config";

export default () => {
  return nodemailer.createTransport({
    host: config.NODEMAILER_HOST,
    port: config.NODEMAILER_PORT,
    auth: {
      user: config.NODEMAILER_USER,
      pass: config.NODEMAILER_PASSWORD,
    },
  });
};
