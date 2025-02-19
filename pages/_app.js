import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.scss";
import { ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import moment from "moment";
import Script from "next/script";
import { Provider } from "react-redux";
import AuthProvider, { useAuth } from "@/config/providers/AuthProvider";
import ToastifyProvider from "@/config/providers/ToastifyProvider";
import AxiosProvider from "@/config/network/AxiosConfig";
import store from "@/redux/store";
import Layout from "@/layouts/MainLayout";

const theme = createTheme();
const queryClient = new QueryClient();

const AppContent = ({ Component, pageProps }) => {
  const { locale } = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    moment.locale(locale);
  }, [locale]);

  //   useEffect(() => {
  //     if (typeof window !== "undefined") {
  //       console.log("🔄 Checking WebEngage...");
  //       if (window.webengage) {
  //         console.log("✅ WebEngage exists, initializing...");
  //         window.webengage.init("ksa~76aa41d"); // Replace with your actual license code

  //         setTimeout(() => {
  //           if (window.webengage?.onReady) {
  //             window.webengage.onReady(() => {
  //               console.log("✅ WebEngage is Ready!");
  //               window.webengage.user.login("test_user");
  //             });
  //           } else {
  //             console.error(
  //               "❌ webengage.onReady is not available after timeout."
  //             );
  //           }
  //         }, 500);
  //       }
  //     }
  //   }, []);

  //   console.log(window?.webengage);
  return (
    <Provider store={store}>
      {/* <Script
        id="webengage-sdk"
        strategy="afterInteractive"
        src="https://cdn.widgets.webengage.com/js/webengage-min-v-6.0.js"
        onLoad={() => console.log("✅ WebEngage script loaded.")}
      /> */}
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
};

export default function App({ Component, pageProps }) {
//   useEffect(() => {
//     let interval; // ✅ Declare interval outside

//     if (typeof window !== "undefined") {
//       console.log("🔄 Checking WebEngage...");

//       interval = setInterval(() => {
//         if (window.webengage?.init) {
//           clearInterval(interval); // ✅ Stop checking once initialized
//           console.log("✅ WebEngage exists, initializing...");
// 		  console.log("WebEngage License Code:", "ksa~76aa41d");
//           window.webengage.init("ksa~76aa41d"); // Replace with your real license code

//           window.webengage.onReady(() => {
//             console.log("✅ WebEngage is Ready!");
//           });
//         }
//       }, 500); // Check every 500ms
//     }

//     return () => {
//       if (interval) clearInterval(interval); // ✅ Cleanup interval properly
//     };
//   }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* <Script
        id="webengage-sdk"
        strategy="afterInteractive"
        src="https://cdn.widgets.webengage.com/js/webengage-min-v-6.0.js"
        onLoad={() => console.log("✅ WebEngage script loaded.")}
      /> */}
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <ToastifyProvider>
            <AuthProvider>
              <AxiosProvider>
                <AppContent Component={Component} pageProps={pageProps} />
              </AxiosProvider>
            </AuthProvider>
          </ToastifyProvider>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}
