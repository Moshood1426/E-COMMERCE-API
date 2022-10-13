import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, "Please provide ratings"],
    },
    title: {
      type: String,
      trim: true,
      required: [true, "Please provide review title"],
      maxLength: 100,
    },
    comment: {
      type: String,
      requred: [true, "Please provide comment"],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "products",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Review", ReviewSchema);
