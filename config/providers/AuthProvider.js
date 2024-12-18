import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { loginSuccess } from "@/redux/reducers/authReducer";
import { useDispatch } from "react-redux";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const login = (userData) => {
    setUser(userData);
  };

  //   useEffect(() => {
  //     const loggedInUser = localStorage.getItem("user");
  //     if (loggedInUser) {
  //       setUser(JSON.parse(loggedInUser));
  //     }
  //     //  else if (router.pathname !== "/auth/login") {
  //     //   router.push("/auth/login");
  //     // }
  //   }, [router]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window?.localStorage.getItem("access_token") !== "undefined" &&
      window?.localStorage.getItem("user") !== "undefined"
    ) {
      const data = {
        data: {
          user: localStorage.getItem("user")
            ? JSON.parse(localStorage.getItem("user"))
            : null,
          access_token: localStorage.getItem("access_token")
            ? localStorage.getItem("access_token")
            : null,
        },
      };
      if (typeof window !== "undefined" && localStorage.getItem("user")) {
        dispatch(loginSuccess(data));
        setUser(data);
      }
    }
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
