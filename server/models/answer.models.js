// models/Answer.js
import mongoose, { Schema } from "mongoose";

const answerSchema = new mongoose.Schema({
  content:     { type: String, required: true },
  question:    { type: Schema.Types.ObjectId, ref: "Question", required: true },
  author:        { type: Schema.Types.ObjectId, ref: "User", required: true },
  votes:       { type: Number, default: 0 },
  isAccepted:  { type: Boolean, default: false },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User"}],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User"}],
}, { timestamps: true });

export const Answer = mongoose.model("Answer", answerSchema)