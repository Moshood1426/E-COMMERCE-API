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
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);


ReviewSchema.statics.calculateAverageRatings = async function(productId) {
  //set up aggregate pipeline
}

ReviewSchema.post('save', async function () {
  //set up calculate average ratings
})

ReviewSchema.post('remove', async function () {
  //set up calculate average ratings
})

export default mongoose.model("Review", ReviewSchema);
