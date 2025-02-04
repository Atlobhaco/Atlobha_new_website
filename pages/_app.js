import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "@/styles/globals.scss";
import { ThemeProvider, createTheme } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRouter } from "next/router";
import AuthProvider, { useAuth } from "@/config/providers/AuthProvider";
import Layout from "@/layouts/MainLayout";
import store from "@/redux/store";
import { Provider } from "react-redux";
import ToastifyProvider from "@/config/providers/ToastifyProvider";
import { useEffect } from "react";
import { toast } from "react-toastify";
import useCustomQuery from "@/config/network/Apiconfig";
import { BRANCHES } from "@/config/endPoints/endPoints";
import "react-bootstrap-carousel/dist/react-bootstrap-carousel.css";
import "moment/locale/ar";
import moment from "moment";
import AxiosProvider from "@/config/network/AxiosConfig";

const theme = createTheme();
const queryClient = new QueryClient();

const AppContent = ({ Component, pageProps }) => {
  const router = useRouter();
  const { locale, route } = router;
  const { user } = useAuth();
  moment.locale(locale);

  useEffect(() => {
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = locale === "ar" ? "ar" : "en";
  }, [locale]);

  const getLayout = (route) => {
    return Layout;
  };

  const RenderedLayout = getLayout(route);

  //   useEffect(() => {
  //     if (user === null) return;
  //     if (!user && router.pathname !== "/auth/login") {
  //       router.push("/auth/login");
  //     }
  //   }, [user, router]);

  return (
    <Provider store={store}>
      <RenderedLayout>
        <Component {...pageProps} />
      </RenderedLayout>
    </Provider>
  );
};

export default function App({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
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
