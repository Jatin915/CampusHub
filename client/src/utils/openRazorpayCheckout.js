import {
  verifyPayment,
  cancelCheckout,
} from "../services/paymentServices";

export const openRazorpayCheckout = ({
  checkout,
  onSuccess,
  onError,
  onClose,
  onPaymentStart,
  onPaymentFailure,
}) => {
  if (!window.Razorpay) {
    onError?.("Payment gateway failed to load. Please refresh.");
    return;
  }

  if (
    !checkout?.paymentId ||
    !checkout?.razorpayOrderId ||
    !checkout?.keyId
  ) {
    onError?.("Invalid checkout response from server.");
    return;
  }

  let paymentHandlerStarted = false;
  let cancellationRequested = false;

  // Ask backend to check Razorpay status before releasing stock.
  const requestCancellation = async () => {
    if (cancellationRequested || paymentHandlerStarted) return;

    cancellationRequested = true;

    try {
      const response = await cancelCheckout(checkout.paymentId);

      console.log("Checkout cancellation response:", response);
    } catch (error) {
      console.error(
        "Checkout cancellation request failed:",
        error.response?.data?.message || error.message,
      );

      // Backend expiry worker remains the fallback.
    }
  };

  const options = {
    key: checkout.keyId,
    amount: checkout.amount,
    currency: checkout.currency,
    name: "CampusHub",
    description: "Campus marketplace purchase",
    order_id: checkout.razorpayOrderId,

    handler: async (razorpayResponse) => {
      paymentHandlerStarted = true;
      onPaymentStart?.();

      try {
        const verificationResponse = await verifyPayment({
          paymentId: checkout.paymentId,
          razorpay_order_id: razorpayResponse.razorpay_order_id,
          razorpay_payment_id: razorpayResponse.razorpay_payment_id,
          razorpay_signature: razorpayResponse.razorpay_signature,
        });

        onSuccess?.(verificationResponse);
      } catch (error) {
        console.error(
          "Payment verification failed:",
          error.response?.data?.message || error.message,
        );

        // Do not cancel here. Payment may already be captured.
        onError?.(
          "Payment verification is pending. Please check your orders before retrying.",
        );
      }
    },

    modal: {
      ondismiss: async () => {
        await requestCancellation();
        onClose?.();
      },
    },

    theme: {
      color: "#0f172a",
    },
  };

  const razorpay = new window.Razorpay(options);

  razorpay.on("payment.failed", async (response) => {
    onPaymentFailure?.();

    console.error(
      "Payment failed:",
      response.error?.description || "Unknown payment error",
    );

    await requestCancellation();

    onError?.(
      "Payment attempt failed. Your cart is unchanged. You can try again.",
    );
  });

  razorpay.open();
};
