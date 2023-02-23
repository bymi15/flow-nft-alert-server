import mongoose from "mongoose";

const BlockSchema = new mongoose.Schema(
  {
    contractName: { type: String, required: true },
    contractAddress: { type: String, required: true },
    initialBlockHeight: Number,
    lastCheckedBlockHeight: Number,
  },
  { timestamps: true }
);

const Block = mongoose.model("Block", BlockSchema);
export default Block;
