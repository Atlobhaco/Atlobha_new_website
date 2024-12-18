export const isAuth = () => {
	return typeof window !== "undefined" &&
	  window?.localStorage.getItem("access_token") !== "null" &&
	  typeof window?.localStorage.getItem("access_token") !== "object"
	  ? true
	  : false;
  };
  