
import mongoose from "mongoose";

const webhookEventSchema = new mongoose.Schema(
  {
    eventId: {
      type: String,
      required: true,
      unique: true,
    },

    event: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["PROCESSING", "PROCESSED"],
      default: "PROCESSING",
      required: true,
    },

    attempts: {
      type: Number,
      default: 1,
      min: 1,
    },

    processedAt: {
      type: Date,
      default: null,
    },

    processingStartedAt: {
        type: Date,
        default: Date.now,
    },

    processingToken: {
        type: String,
        default: null,
    },
  },
  { timestamps: true },
);

const WebhookEvent = mongoose.model(
  "WebhookEvent",
  webhookEventSchema,
);

export default WebhookEvent;
