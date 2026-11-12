
import crypto from "crypto";
import WebhookEvent from "./webhookEvent.model.js";

const PROCESSING_LEASE_MS = 5 * 60 * 1000;

export const claimWebhookEvent = async (eventId, eventName) => {
  const processingToken = crypto.randomUUID();
  const now = new Date();

  // First delivery: attempt to create the event.
  try {
    const webhookEvent = await WebhookEvent.create({
      eventId,
      event: eventName,
      status: "PROCESSING",
      processingStartedAt: now,
      processingToken,
      attempts: 1,
    });

    return {
      claimed: true,
      webhookEvent,
      processingToken,
    };
  } catch (error) {
    if (error.code !== 11000) {
      throw error;
    }
  }

  // Duplicate delivery: try to reclaim only if its lease expired.
  const staleBefore = new Date(now.getTime() - PROCESSING_LEASE_MS);

  const webhookEvent = await WebhookEvent.findOneAndUpdate(
    {
      eventId,
      status: "PROCESSING",
      processingStartedAt: { $lte: staleBefore },
    },
    {
      $set: {
        processingStartedAt: now,
        processingToken,
      },
      $inc: {
        attempts: 1,
      },
    },
    {
      returnDocument: "after"
    },
  );

  if (webhookEvent) {
    return {
      claimed: true,
      webhookEvent,
      processingToken,
    };
  }

  // Check why the event couldn't be claimed.
  const existingEvent = await WebhookEvent.findOne({ eventId });

  if (existingEvent?.status === "PROCESSED") {
    return { claimed: false, reason: "PROCESSED" };
  }

  return { claimed: false, reason: "PROCESSING" };
};



export const markWebhookEventProcessed = async (
  eventId,
  processingToken,
) => {
  const result = await WebhookEvent.updateOne(
    {
      eventId,
      status: "PROCESSING",
      processingToken,
    },
    {
      $set: {
        status: "PROCESSED",
        processedAt: new Date(),
      },
      $unset: {
        processingToken: 1,
      },
    },
  );

  return result.modifiedCount === 1;
};

export const releaseWebhookEventClaim = async (
  eventId,
  processingToken,
) => {
  await WebhookEvent.deleteOne({
    eventId,
    status: "PROCESSING",
    processingToken,
  });
};