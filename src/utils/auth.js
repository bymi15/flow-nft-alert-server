import basicAuth from "express-basic-auth";
import config from "../config";

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers?.authorization;
  if (typeof authHeader === "string") {
    const parts = authHeader.split(" ");
    if (parts.length == 2) {
      const scheme = parts[0];
      if (/^Basic$/i.test(scheme)) {
        return basicAuth({
          users: { [config.AUTH_BASIC_USER]: config.AUTH_BASIC_PASS },
        })(req, res, next);
      }
    }
  }
  return res.status(401).json({ errors: { message: "authorization header missing" } });
};
