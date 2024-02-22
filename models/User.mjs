import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const User = mongoose.model(
  "User",
  new Schema(
    {
      username: { type: String, required: true },
      password: { type: String, required: true },
      messages: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Message",
        },
      ],
    },
    { timestamps: true }
  )
);
