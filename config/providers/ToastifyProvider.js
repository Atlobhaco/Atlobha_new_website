import React from "react";
import { useRouter } from "next/router";
import { Zoom, ToastContainer } from "react-toastify";

const ToastifyProvider = ({ children }) => {
  const { locale } = useRouter();

  return (
    <>
      <ToastContainer
        autoClose={3000}
        hideProgressBar={false}
        position="top-center"
        newestOnTop
        rtl={locale === "ar" && true}
        pauseOnFocusLoss={false}
        draggable
        transition={Zoom}
        theme="colored"
		limit={2}
      />
      {children}
    </>
  );
};

export default ToastifyProvider;
