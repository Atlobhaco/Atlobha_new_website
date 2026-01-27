"use client";
import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { ORDERS, PAYMENT_FAILED } from "@/config/endPoints/endPoints";

export default function PaymentFailChecker() {
  const hasRun = useRef(false);
  const paymentFailed = Cookies.get("payment_failed");

  useEffect(() => {
    if (paymentFailed && !hasRun.current) {
      hasRun.current = true;

      // Check if current URL contains "confirmation"
      // to fix the payment failed calling in confirmation page spareparts
      const shouldDelay = window.location.href.includes("confirmation");
      const delay = shouldDelay ? 4000 : 0; // 4 seconds if confirmation, else 0

      const timer = setTimeout(() => {
        const orderId = Cookies.get("created_order_id");
        const orderType = Cookies.get("order_type");
        const url_after_pay_failed = Cookies.get("url_after_pay_failed");

        if (paymentFailed === "failed" && orderId) {
          const path = `${process.env.NEXT_PUBLIC_API_BASE_URL}/${orderType}${
            orderType === "vehicle-pricing-orders"
              ? `/${orderId}`
              : `${ORDERS}/${orderId}`
          }${PAYMENT_FAILED}`;

          fetch(path, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "w123",
              Authorization: `Bearer ${localStorage?.getItem("access_token")}`,
            },
          })
            .then((res) => {
              if (!res.ok) throw new Error("Request failed");
              console.log(
                "Payment fail (success) status updated for order:",
                orderId,
              );
            })
            .catch((err) => console.error("Payment fail update error:", err))
            .finally(() => {
              Cookies.remove("created_order_id");
              Cookies.remove("payment_failed");
              Cookies.remove("order_type");
              Cookies.remove("payment_method");
              Cookies.remove("url_after_pay_failed");
            });
        }

        hasRun.current = false;
      }, delay);

      return () => {
        clearTimeout(timer);
        hasRun.current = false;
      };
    }
  }, [paymentFailed]);

  return null;
}
