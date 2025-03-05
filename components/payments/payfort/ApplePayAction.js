import { useStripe } from "@stripe/react-stripe-js";

const ApplePayAction = () => {
  const stripe = useStripe();

  const handleApplePayPayment = async () => {
    if (!window.ApplePaySession) {
      alert("Apple Pay is not supported on this device.");
      return;
    }

    const paymentRequest = stripe.paymentRequest({
      country: "SA", // Set your country
      currency: "SAR",
      total: {
        label: "Your Store Name",
        amount: 100, // Amount in SAR
      },
      requestPayerName: true,
      requestPayerEmail: true,
      supportedMethods: ["applePay"],
    });

    const canMakePayment = await paymentRequest.canMakePayment();
    if (!canMakePayment) {
      alert("Apple Pay is not available.");
      return;
    }

    const paymentResponse = await paymentRequest.show();
    // console.log("Payment Response:", paymentResponse);
  };

  return (
    <button
      onClick={handleApplePayPayment}
      style={{
        padding: 10,
        background: "black",
        color: "white",
        borderRadius: 5,
      }}
    >
      Pay with Apple Pay
    </button>
  );
};

export default ApplePayAction;
