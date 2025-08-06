import axios from "axios";
import { createContext, useState, useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";

// Create a context for holding and updating Axios loading state
export const AxiosContext = createContext();

// Axios instance creation
export const axiosInstance = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    "x-api-key": "w123",
  },
});

// Setting up an interceptor to dynamically add the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    // let token =
    //   typeof window !== "undefined"
    //     ? localStorage.getItem("access_token")
    //     : null;
    // token = token?.replace(/^"|"$/g, "");
    // if (token && token !== "null") {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// AxiosProvider component for React context
const AxiosProvider = ({ children }) => {
  const [loader, setLoader] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    // Optional: You can track request loading state globally here if needed
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        setLoader(true); // Set loading to true before request is sent
        return config;
      }
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => {
        setLoader(false); // Set loading to false on response
        return response;
      },
      (error) => {
        setLoader(false); // Ensure loading is set to false even on error
        if (+error?.status === 401) {
          logout();
        }
        return Promise.reject(error);
      }
    );

    // Cleanup interceptors on unmount
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <AxiosContext.Provider value={{ loader, setLoader }}>
      {children}
    </AxiosContext.Provider>
  );
};

export default AxiosProvider;
