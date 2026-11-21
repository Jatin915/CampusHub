import { verifyPayment } from "../services/paymentService";

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

  const options = {
    key: checkout.keyId,
    amount: checkout.amount,
    currency: checkout.currency,
    name: "CampusHub",
    description: "Campus marketplace purchase",
    order_id: checkout.razorpayOrderId,

    handler: async (razorpayResponse) => {
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

        onError?.(
          "Payment verification is pending. Please check your orders before retrying.",
        );
      }
    },

    modal: {
      ondismiss: () => {
        onClose?.();
      },
    },

    theme: {
      color: "#0f172a",
    },
  };

  const razorpay = new window.Razorpay(options);

  razorpay.on("payment.failed", (response) => {
    onPaymentFailure?.();

    console.error(
      "Payment failed:",
      response.error?.description || "Unknown payment error",
    );

    onError?.(
      "Payment attempt failed. Your cart is unchanged. You can try again.",
    );
  });

  razorpay.open();
};