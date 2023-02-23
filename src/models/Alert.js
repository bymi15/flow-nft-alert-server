import mongoose from "mongoose";

const AlertSchema = new mongoose.Schema(
  {
    contractName: { type: String, required: true },
    contractAddress: { type: String, required: true },
    email: { type: String, required: true },
    alertType: { type: String, required: true },
    nftID: Number,
    floorPrice: Number,
    currency: String,
    expiry: Number,
    active: Boolean,
  },
  { timestamps: true }
);

const Alert = mongoose.model("Alert", AlertSchema);
export default Alert;
