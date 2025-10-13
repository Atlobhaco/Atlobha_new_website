"use client";
import { useEffect, useRef } from "react";
import Cookies from "js-cookie";
import { ORDERS, PAYMENT_FAILED } from "@/config/endPoints/endPoints";

// used to call failed endpoint for marketplace or spare parts to change the status of
// order if the payment failed or cancelled work with key called payment_failed
// it saved in cookies after any payment failed escept MIS pay different flow
export default function PaymentFailChecker() {
  const hasRun = useRef(false);
  const paymentFailed = Cookies.get("payment_failed");

  useEffect(() => {
    if (paymentFailed) {
      //   if (hasRun.current) return; // prevent double execution
      //   hasRun.current = true;

      const orderId = Cookies.get("created_order_id");
      const orderType = Cookies.get("order_type");
      const paytmentMethod = Cookies.get("payment_method");
      const url_after_pay_failed = Cookies.get("url_after_pay_failed");

      if (paymentFailed === "failed" && orderId) {
        fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/${orderType}${ORDERS}/${orderId}${PAYMENT_FAILED}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": "w123",
              Authorization: `Bearer ${localStorage?.getItem("access_token")}`,
            },
          }
        )
          .then((res) => {
            if (!res.ok) throw new Error("Request failed");
            console.log(
              "Payment fail (success) status updated for order:",
              orderId
            );
          })
          .catch((err) => console.error(err))
          .finally(() => {
            Cookies.remove("created_order_id");
            Cookies.remove("payment_failed");
            Cookies.remove("order_type");
            Cookies.remove("payment_method");
            Cookies.remove("url_after_pay_failed");
          });
      }
      //   hasRun.current = false;
    }
  }, [paymentFailed]);

  return null;
}
