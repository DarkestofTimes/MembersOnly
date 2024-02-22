import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const Message = mongoose.model(
  "Message",
  new Schema(
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      subject: { type: String, required: true },
      message: { type: String, required: true },
    },
    { timestamps: true }
  )
);
