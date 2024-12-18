import { useState } from "react";

const LoginModalActions = () => {
  const showBtn = true;
  const [openLogin, setOpenLogin] = useState(false);

  return {
    openLogin,
    setOpenLogin,
    showBtn,
  };
};

export default LoginModalActions;
