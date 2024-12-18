import { Schema, model } from "mongoose"

export const LogSchema = new Schema({
  text: {
    type: String,
    trim: true,
    required: [true, "Log text is required"]
  },
  priority: {
    type: String,
    default: "low",
    enum: ["low", "moderate", "high"]
  },
  user: {
    type: String,
    trim: true,
    required: [true, "User is required"]
  },
  created: {
    type: Date,
    default: Date.now(),
  }
});

export default model("Log", LogSchema);
