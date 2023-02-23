import { errors } from "celebrate";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import routes from "../routes";

export default ({ app }) => {
  if (process.env.NODE_ENV === "production") {
    app.use((req, res, next) => {
      if (req.header("x-forwarded-proto") !== "https") {
        res.redirect(`https://${req.header("host")}${req.url}`);
      } else {
        next();
      }
    });
  }

  app.get("/health", (_, res) => {
    res.status(200).end();
  });
  app.head("/health", (_, res) => {
    res.status(200).end();
  });

  app.enable("trust proxy");
  app.use(helmet());
  app.disable("x-powered-by");

  app.use(express.json());

  const allowlist = ["http://localhost:3001", "https://flow-nft-alert.vercel.app"];

  const useCors = cors({
    origin: function (origin, callback) {
      if (origin === undefined || allowlist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  });

  // Load API routes
  app.use("/api", useCors, routes());

  app.use(errors());

  app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    res.json({
      errors: {
        message: err.message,
      },
    });
  });
};
