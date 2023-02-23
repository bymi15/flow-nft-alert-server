import mongoose from "mongoose";
import config from "../config";

export default async ({ databaseURL }) => {
  const connection = await mongoose.connect(databaseURL ?? config.DATABASE_URL);
  return connection.connection.db;
};
