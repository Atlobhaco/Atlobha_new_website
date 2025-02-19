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
      <Script
        id="webengage-config"
        strategy="lazyOnload"
        src="https://wsdk-files.webengage.com/webengage/ksa~76aa41d/v4.js"
        onError={() => console.error("Failed to load WebEngage config script")}
      />

      {/* WebEngage Initialization */}
      <Script
        id="_webengage_script_tag"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
          var webengage;
          !function(w, e, b, n, g) {
            function o(e, t) {
              e[t[t.length - 1]] = function() {
                r.__queue.push([t.join("."), arguments]);
              };
            }
            var i, s, r = w[b],
              z = " ",
              l = "init options track screen onReady".split(z),
              a = "feedback survey notification".split(z),
              c = "options render clear abort".split(z),
              p = "Open Close Submit Complete View Click".split(z),
              u = "identify login logout setAttribute".split(z);
            if (!r || !r.__v) {
              for (w[b] = r = { __queue: [], __v: "6.0", user: {} }, i = 0; i < l.length; i++) 
                o(r, [l[i]]);
              for (i = 0; i < a.length; i++) {
                for (r[a[i]] = {}, s = 0; s < c.length; s++) 
                  o(r[a[i]], [a[i], c[s]]);
                for (s = 0; s < p.length; s++) 
                  o(r[a[i]], [a[i], "on" + p[s]]);
              }
              for (i = 0; i < u.length; i++) 
                o(r.user, ["user", u[i]]);
              setTimeout(function() {
                var f = e.createElement("script");
                f.type = "text/javascript";
                f.async = true;
                f.src = "https://ssl.widgets.webengage.com/js/webengage-min-v-6.0.js";
                e.head.appendChild(f);
              }, 1000);
            }
          }(window, document, "webengage");

          webengage.init('ksa~76aa41d');
          `,
        }}
      />
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
