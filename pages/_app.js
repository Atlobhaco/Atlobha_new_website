import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/styles/globals.scss";
import { Box, ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter } from "next/router";
import { useEffect } from "react";
import moment from "moment";
import Script from "next/script";
import { Provider, useDispatch } from "react-redux";
import AuthProvider, { useAuth } from "@/config/providers/AuthProvider";
import ToastifyProvider from "@/config/providers/ToastifyProvider";
import AxiosProvider from "@/config/network/AxiosConfig";
import store from "@/redux/store";
import Layout from "@/layouts/MainLayout";
import "moment/locale/ar";
import { ReactQueryDevtools } from "react-query/devtools";
import {
  addItemAsync,
  fetchCartAsync,
  syncFromLocalStorage,
} from "@/redux/reducers/basketReducer";
import { isAuth } from "@/config/hooks/isAuth";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import LogoLoader from "@/components/LogoLoader";
import { toast } from "react-toastify";
import useLocalization from "@/config/hooks/useLocalization";
import "react-inner-image-zoom/lib/styles.min.css";
import * as gtag from "../config/googleAnalytics/gtag";
import { RouteProvider } from "@/config/providers/RouteTracker";
import PaymentFailChecker from "@/components/PaymentFailChecker";

const theme = createTheme();
const queryClient = new QueryClient();

const AppContent = ({ Component, pageProps }) => {
  const { t } = useLocalization();
  const { locale } = useRouter();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const router = useRouter();
  const { socialLogin, paymentStatus, orderId, payment_id } = router.query;

  /* -------------------------------------------------------------------------- */
  /*                            google analytics code                           */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale;
    moment.locale(locale === "ar" ? "ar" : "en");
  }, [locale]);

  useEffect(() => {
    // basket items depenc on user auth or not
    if (localStorage.getItem("basket")) {
      if (!isAuth()) {
        const basket = JSON.parse(localStorage.getItem("basket"));
        dispatch(addItemAsync(basket));
      } else {
        const basket = JSON.parse(localStorage.getItem("basket"));
        dispatch(syncFromLocalStorage(basket));
        localStorage.removeItem("basket");
        dispatch(fetchCartAsync());
      }
    }
    if (isAuth()) {
      dispatch(fetchCartAsync());
    }
  }, [isAuth(), locale]);

  useEffect(() => {
    if (document) {
      const loadingScreen = document?.getElementById("loading-screen");
      if (
        !router?.pathname?.includes("callback") &&
        !router?.pathname?.includes("appleCallback") &&
        !router?.pathname?.includes("apple")
      ) {
        setTimeout(() => {
          loadingScreen.style.display = "none";
        }, 3000);
      }
    }
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                   show success message after social login                  */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    if (socialLogin === "true") {
      toast.success(t.loginSuccess);
      router.push(router.pathname);
    }
  }, [router]);

  /* -------------------------------------------------------------------------- */
  /*           handle failure and cancel for tamara payment and tabby           */
  /* -------------------------------------------------------------------------- */
  //   useEffect(() => {
  //     if (orderId) {
  //       if (paymentStatus === "canceled") {
  //         toast.success(t.paymentCancelled);
  //         router.push(router.pathname);
  //         return;
  //       }
  //       if (paymentStatus === "declined") {
  //         toast.error(t.paymentFailure);
  //         router.push(router.pathname);
  //         return;
  //       }
  //     } else if (payment_id && router.pathname == "/") {
  //       toast.error(t.paymentFailure);
  //       router.push(router.pathname);
  //       return;
  //     }
  //   }, [router]);

  return (
    <Provider store={store}>
      <>
        <Box
          sx={{
            background: "#F3F5F8",
            position: "absolute",
            zIndex: "999",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}
          id="loading-screen"
        >
          <LogoLoader />
        </Box>
        <Layout>
          {/* component to check failure for the payment methods */}
          <PaymentFailChecker /> {/* runs once on app load */}
          <Component {...pageProps} />
        </Layout>
      </>
    </Provider>
  );
};

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      {/* google tag manager */}
      <Script id="gtm-script" strategy="afterInteractive">
        {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id=${process.env.NEXT_PUBLIC_GTM_ID}'+dl;
          f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
        `}
      </Script>
      {/* google analytics scripts */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />

      <Script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Atlobha",
          url: "https://atlobha.com",
          logo: "https://atlobha.com/favicon.png", // make sure this image is accessible
        })}
      </Script>

      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <RouteProvider>
            <ToastifyProvider>
              <AuthProvider>
                <AxiosProvider>
                  <AppContent Component={Component} pageProps={pageProps} />
                  {/* <ReactQueryDevtools
                  initialIsOpen={false}
                  position="bottom-right"
                /> */}
                </AxiosProvider>
              </AuthProvider>
            </ToastifyProvider>
          </RouteProvider>
        </ThemeProvider>
      </Provider>
    </QueryClientProvider>
  );
}
