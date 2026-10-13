// models/Notification.js
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sender:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type:      { type: String, enum: ["answer", "comment", "mention"], required: true },
  message:   { type: String, required: true },
  link:      { type: String }, // link to question or answer
  isRead:    { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);