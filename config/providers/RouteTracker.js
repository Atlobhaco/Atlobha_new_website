// context/RouteTracker.js
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

const RouteContext = createContext();

export const RouteProvider = ({ children }) => {
  const [prevRoute, setPrevRoute] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      setPrevRoute(router.asPath);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  return (
    <RouteContext.Provider value={{ prevRoute }}>
      {children}
    </RouteContext.Provider>
  );
};

export const useRouteTracker = () => useContext(RouteContext);
