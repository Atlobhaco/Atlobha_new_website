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
import useBranch from "./useBranch";
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
import { RouteProvider } from "@/config/providers/RouteTracker";

const theme = createTheme();
const queryClient = new QueryClient();

const AppContent = ({ Component, pageProps }) => {
  const { t } = useLocalization();
  const { locale } = useRouter();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const router = useRouter();
  const { socialLogin, paymentStatus, orderId, payment_id } = router.query;

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
  useEffect(() => {
    if (orderId) {
      if (paymentStatus === "canceled") {
        toast.success(t.paymentCancelled);
        router.push(router.pathname);
        return;
      }
      if (paymentStatus === "declined") {
        toast.error(t.paymentFailure);
        router.push(router.pathname);
        return;
      }
    } else if (payment_id && router.pathname == "/") {
      toast.error(t.paymentFailure);
      router.push(router.pathname);
      return;
    }
  }, [router]);

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
          <Component {...pageProps} />
        </Layout>
      </>
    </Provider>
  );
};

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window !== "undefined" && window.webengage) {
      window.webengage.init(process.env.NEXT_PUBLIC_WEBENGAGE_LICENCE); // Your WebEngage License Code
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Script
        id="webengage-config"
        strategy="lazyOnload"
        src={`https://wsdk-files.webengage.com/webengage/${process.env.NEXT_PUBLIC_WEBENGAGE_LICENCE}/v4.js`}
        onError={() => console.error("Failed to load WebEngage config script")}
      />

      {/* WebEngage Initialization */}
      <Script
        id="_webengage_script_tag"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var webengage;!function(w,e,b,n,g){
              function o(e,t){e[t[t.length-1]]=function(){r.__queue.push([t.join("."),arguments])}}
              var i,s,r=w[b],z=" ",l="init options track screen onReady".split(z),
              a="webPersonalization feedback survey notification notificationInbox".split(z),
              c="options render clear abort".split(z),
              p="Prepare Render Open Close Submit Complete View Click".split(z),
              u="identify login logout setAttribute".split(z);
              if(!r||!r.__v){
                for(w[b]=r={__queue:[],__v:"6.0",user:{}},i=0;i < l.length;i++)o(r,[l[i]]);
                for(i=0;i < a.length;i++){
                  for(r[a[i]]={},s=0;s < c.length;s++)o(r[a[i]],[a[i],c[s]]);
                  for(s=0;s < p.length;s++)o(r[a[i]],[a[i],"on"+p[s]])
                }
                for(i=0;i < u.length;i++)o(r.user,["user",u[i]]);
                setTimeout(function(){
                  var f=e.createElement("script"),d=e.getElementById("_webengage_script_tag");
                  f.type="text/javascript",f.async=!0,
                  f.src="https://widgets.ksa.webengage.com/js/webengage-min-v-6.0.js"				  ,
                  d.parentNode.insertBefore(f,d)
                })
              }
            }(window,document,"webengage");
          `,
        }}
      />
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
