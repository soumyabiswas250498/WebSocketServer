import { mongoose, Types } from "mongoose";

const Schema = mongoose.Schema;

const DeviceSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    inUse: {
      type: Boolean,
      default: false,
    },
    usageType: {
      type: String,
      enum: ["temporary", "permanent"],
      default: "permanent",
      required: true,
    },
    owner: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    messages: {
      type: String,
    },
    memoryUsage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const DeviceModel = mongoose.model("device", DeviceSchema);

export default DeviceModel;
