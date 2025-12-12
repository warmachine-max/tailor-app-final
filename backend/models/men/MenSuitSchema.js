import mongoose from "mongoose";

const menSuitSchema = new mongoose.Schema(
  {
    image: {
      public_id: { type: String },
        url: { type: String }, 
    },

    notes: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("MenSuit", menSuitSchema);
