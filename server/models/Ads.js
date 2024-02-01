import mongoose from "mongoose";

const AdvertiseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    websiteLink: {
      type: String,
      required: true,
      min: 2,
      max: 50,
    },
    picturePath: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const Advertise = mongoose.model("Advertise", AdvertiseSchema);
export default Advertise;
