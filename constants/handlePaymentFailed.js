import Cookies from "js-cookie";

export const handlePaymentFailed = async (
  orderId,
  orderType,
  callCalculateReceipt
) => {
  if (!orderId || !orderType) {
    console.error("Missing orderId or orderType");
    return;
  }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/${orderType}/orders/${orderId}/payment_failed`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "w123",
          Authorization: `Bearer ${localStorage?.getItem("access_token")}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to mark payment as failed");
    }

    console.log(
      "✅ Payment failed status successfully updated for order:",
      orderId
    );
  } catch (error) {
    console.error("❌ Error updating payment failed status:", error);
  } finally {
    // Always clean up cookies
    Cookies.remove("created_order_id");
    Cookies.remove("payment_failed");
    Cookies.remove("order_type");
    Cookies.remove("payment_method");
    Cookies.remove("url_after_pay_failed");

    // Optionally trigger re-fetch of receipt
    if (typeof callCalculateReceipt === "function") {
      callCalculateReceipt();
    }
  }
};
