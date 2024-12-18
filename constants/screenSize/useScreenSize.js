import { useMediaQuery } from "@mui/material";

const useScreenSize = () => {
  const isMobile = useMediaQuery("(max-Width: 767px)");
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 991px)");
  const isDesktop = useMediaQuery("(min-width: 992px)");

  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};

export default useScreenSize;
