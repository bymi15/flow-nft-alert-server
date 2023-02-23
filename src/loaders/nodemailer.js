import nodemailer from "nodemailer";
import config from "../config";

export default () => {
  return nodemailer.createTransport({
    host: config.NODEMAILER_HOST,
    port: config.NODEMAILER_PORT,
    secure: true,
    auth: {
      type: config.NODEMAILER_AUTH_TYPE,
      user: config.NODEMAILER_AUTH_USER,
      serviceClient: config.NODEMAILER_AUTH_SERVICE_CLIENT,
      privateKey: config.NODEMAILER_AUTH_PRIVATE_KEY.replace(/\\n/g, "\n"),
    },
  });
};
