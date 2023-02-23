import mongoose from "mongoose";

const MetricSchema = new mongoose.Schema(
  {
    contractName: { type: String, required: true },
    contractAddress: { type: String, required: true },
    sentAlerts: Number,
    activeAlerts: Number,
    activeUniqueUsers: Number,
  },
  { timestamps: true }
);

const Metric = mongoose.model("Metric", MetricSchema);
export default Metric;
