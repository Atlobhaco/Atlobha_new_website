import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useCustomQuery from "@/config/network/Apiconfig";
import {
  APP_SECTIONS,
  APP_SECTIONS_GROUPS,
} from "@/config/endPoints/endPoints";
import { toast } from "react-toastify";
import useLocalization from "@/config/hooks/useLocalization";
import { setAllGroups } from "@/redux/reducers/appGroups";
import { useDispatch } from "react-redux";
import { MARKETPLACE, SPAREPARTS } from "@/constants/enums";
import ProductCardSkeleton from "@/components/cardSkeleton";
import { setSectionsSeo } from "@/redux/reducers/homeSectionsReducer";

const active = {
  border: "1px solid #F9DD4B",
};

const coloredBox = {
  borderRadius: "4px",
  height: "20px",
  padding: "3px 10px",
  fontSize: "10px",
  color: "white",
  width: "fit-content",
};

const secondHeader = {
  fontSize: "20px",
  fontWeight: "500",
  color: "black",
};

function CategoriesPopupcontent({
  activeSection,
  setActiveSection,
  setOpenCategories = () => {},
}) {
  const router = useRouter();
  const { route } = router;
  const { mobileScreen } = router.query;
  const dispatch = useDispatch();
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const [appGroups, setAppGroups] = useState([]);
  const [mainGroups, setMainGroups] = useState([]);
  const [fakeLoaderAppear, setFakeLoaderAppear] = useState(true);

  const sectionService = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#FFDDEC",
    height: isMobile ? "160px" : "170px",
    borderRadius: "4px",
    padding: "8px",
    background: `url(/imgs/najm.svg)`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    cursor: "pointer",
  };

  const boxStyle = {
    borderRadius: "8px",
    padding: "10px",
    minHeight: isMobile ? "100%" : "150px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    cursor: "pointer",
    flexWrap: isMobile ? "noWrap" : "wrap",
    maxHeight: isMobile ? "100%s" : "unset",
    flexDirection: isMobile ? "column" : "row",
    gap: "10px",
  };

  const boxHeader = {
    fontSize: isMobile ? "12px" : "20px",
    fontWeight: "500",
    color: "black",
    marginBottom: "5px",
  };

  const menuImgStyle = {
    // position: isMobile && "relative",
    // top: isMobile && "-24px",
    // left: isMobile && locale === "ar" ? "5%" : "-11px",
    margin: isMobile ? "auto" : "auto",
  };

  const sectionServiceTitle = {
    color: "black",
    fontSize: isMobile ? "13px" : "14px",
    fontWeight: isMobile ? "500" : "500",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    lineHeight: "1.4",
    width: "100%",
    paddingTop: "5px",
  };

  const boxSub = {
    fontSize: "10px",
    fontWeight: "400",
    color: "#6B7280",
    marginBottom: "5px",
    height: isMobile ? "unset" : "auto",
  };

  const { data } = useCustomQuery({
    name: "ListSectionsGroups",
    url: `${APP_SECTIONS_GROUPS}`,
    refetchOnWindowFocus: false,
    enabled: true,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      setAppGroups(res);
      setMainGroups(res);
      // open just in main page
      setTimeout(() => {
        if (
          !route?.includes("myOrders") &&
          !route?.includes("confirmation") &&
          !mobileScreen &&
          !route?.includes("callback") &&
          !route?.includes("appleCallback") &&
          !route?.includes("apple") &&
          route === "/"
        ) {
          setOpenCategories(true);
        }
      }, 500);
      setTimeout(() => {
        setFakeLoaderAppear(false);
      }, 1500);
      dispatch(setAllGroups(res));
    },
    onError: () => {
      toast.error(t.someThingWrong);
    },
  });

  /* -------------------------------------------------------------------------- */
  /*                         save seo for each  section                         */
  /* -------------------------------------------------------------------------- */
  useCustomQuery({
    name: "app-home-sections-seo",
    url: `${APP_SECTIONS}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      dispatch(setSectionsSeo(res));
    },
  });

  const returnImgDependOnId = (id) => {
    switch (id) {
      case 15:
        return "/imgs/test-1.svg";
      case 14:
        return "/imgs/najm.svg";
      case 8:
        return "/imgs/maintenznce.svg";
      case 12:
        return "/imgs/road-help.svg";
      case 9:
        return "/imgs/conz.svg";
      default:
        return "/imgs/remote-car.svg";
    }
  };
  const returnBgColorDependOnId = (id) => {
    switch (id) {
      case 15:
        return "#FFDDEC";
      case 14:
        return "#E9FAEF";
      case 8:
        return "#E7F5FF";
      case 12:
        return "#F3F0FF";
      case 9:
        return "#FFE4DD";
      default:
        return "#DDECFF";
    }
  };

  return (
    <Box>
      {appGroups?.map((group, index) => (
        <Grid
          container
          spacing={2}
          marginTop={index > 0 ? (isMobile ? 2 : 5) : 0}
        >
          {/* First row with two columns */}
          <Grid item size={12}>
            <Box sx={secondHeader}>{group?.title}</Box>
          </Grid>
          {group?.sections?.map((sec, index) => {
            return group?.position === 1 ? (
              <Grid
                key={sec?.id}
                item
                size={{ xs: 6, md: 6 }}
                marginTop={isMobile ? 0 : 2}
              >
                <Box
                  sx={{
                    ...boxStyle,
                    ...((activeSection && sec?.type === SPAREPARTS && active) ||
                      (!activeSection && sec?.type === MARKETPLACE && active)),
                    background: sec?.background_color || "#FFF5EF",
                  }}
                  onClick={() => {
                    if (
                      (route === "/spareParts" && +sec?.type === SPAREPARTS) ||
                      (route === "/" && +sec?.type === MARKETPLACE)
                    ) {
                      return setOpenCategories(false);
                    }
                    setActiveSection(sec?.type === MARKETPLACE ? false : true);
                    router.push(
                      sec?.type === MARKETPLACE ? "/" : "/spareParts"
                    );
                    setTimeout(() => {
                      setOpenCategories(false);
                    }, 150);
                  }}
                >
                  <Box sx={{ maxWidth: isMobile ? "100%" : "70%" }}>
                    <Box sx={boxHeader}>{sec?.title}</Box>
                    <Box sx={boxSub}>{sec?.description}</Box>
                    <Box
                      sx={{
                        ...coloredBox,
                        background: sec?.tag?.color,
                      }}
                    >
                      {sec?.tag?.name}
                    </Box>
                  </Box>
                  <Box sx={menuImgStyle}>
                    {/* <Image
                      alt="img"
                      src="/icons/menu-1.svg"
                      height={100}
                      width={160}
                    /> */}
                    <Image
                      loading="lazy"
                      alt="img"
                      src={sec?.image || "/icons/menu-1.svg"}
                      height={100}
                      width={160}
                      style={{
                        maxWidth: isMobile ? "70px" : "90px",
                        maxHeight: isMobile ? "60px" : "80px",
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            ) : (
              <Grid item key={`${sec?.id}-${index}`} size={{ xs: 4, md: 2 }}>
                {fakeLoaderAppear ? (
                  <ProductCardSkeleton
                    height={"200px"}
                    customMarginBottom="0px"
                  />
                ) : (
                  <Box
                    onClick={() => {
                      router.push(
                        `/sections?secTitle=${sec?.title}&&secType=${sec?.type}`
                      );
                      setTimeout(() => {
                        setOpenCategories(false);
                      }, 150);
                    }}
                    sx={{
                      ...sectionService,
                      background: `url(${
                        returnImgDependOnId(sec?.id) || "/imgs/remote-car.svg"
                      })`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundColor:
                        sec?.background_color ||
                        returnBgColorDependOnId(sec?.id),
                    }}
                  >
                    <Box sx={sectionServiceTitle}>{sec?.title}</Box>
                  </Box>
                )}
              </Grid>
            );
          })}
        </Grid>
      ))}
      {/* Second row */}
      {/* <Grid container spacing={2} marginTop={isMobile ? 2 : 5}>
        <Grid item size={12}>
          <Box sx={secondHeader}>{t.moreServices}</Box>
        </Grid>
        {appGroups?.map((group) =>
          group?.sections?.map((section, index) => (
            <Grid item key={`${section?.id}-${index}`} size={{ xs: 4, md: 2 }}>
              <Box
                sx={{
                  ...sectionService,
                  background: `url(${returnImgDependOnId(section?.id)})`,
                  backgroundColor:
                    section?.background_color ||
                    returnBgColorDependOnId(section?.id),
                }}
              >
                <Box sx={sectionServiceTitle}>{section?.title}</Box>
              </Box>
            </Grid>
          ))
        )}
      </Grid> */}
    </Box>
  );
}

export default CategoriesPopupcontent;
