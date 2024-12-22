// components/AuthGuard.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { isAuth } from "../hooks/isAuth";

const AuthGuard = (WrappedComponent) => {
  const WithAuthComponent = (props) => {
    const router = useRouter();

    useEffect(() => {
      if (!isAuth()) {
        router.replace("/");
      }
    }, [router]);

    if (!isAuth()) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  WithAuthComponent.displayName = `auth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithAuthComponent;
};

export default AuthGuard;
