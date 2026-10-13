// models/Question.js
import mongoose, { Schema } from "mongoose";

const questionSchema = new mongoose.Schema({
  title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    askedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    answers: [{
      type: Schema.Types.ObjectId,
      ref: "Answer"
    }]
}, { timestamps: true });

export const Question = mongoose.model("Question",questionSchema);