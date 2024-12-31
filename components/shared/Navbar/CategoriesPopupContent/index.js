import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";
import useCustomQuery from "@/config/network/Apiconfig";
import { APP_SECTIONS_GROUPS } from "@/config/endPoints/endPoints";
import { toast } from "react-toastify";
import useLocalization from "@/config/hooks/useLocalization";

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
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const [appGroups, setAppGroups] = useState([]);
  const [mainGroups, setMainGroups] = useState([]);

  const sectionService = {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#FFDDEC",
    height: isMobile ? "140px" : "170px",
    borderRadius: "4px",
    padding: "8px",
    background: `url(/imgs/najm.svg)`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
    cursor: "pointer",
  };

  const boxStyle = {
    background: "#FFF5EF",
    borderRadius: "8px",
    padding: "10px",
    minHeight: "144px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    cursor: "pointer",
    flexWrap: "wrap",
    maxHeight: isMobile ? "160px" : "unset",
  };

  const boxHeader = {
    fontSize: isMobile ? "12px" : "20px",
    fontWeight: "500",
    color: "black",
    marginBottom: "5px",
  };

  const menuImgStyle = {
    position: isMobile && "relative",
    top: isMobile && "-24px",
    left: isMobile && locale === "ar" ? "5%" : "-11px",
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
    height: isMobile ? "23px" : "auto",
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
      setOpenCategories(true);
    },
    onError: () => {
      toast.error(t.someThingWrong);
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
      <Grid container spacing={2}>
        {/* First row with two columns */}
        {mainGroups?.map((group) => (
          <Grid
            key={group?.id}
            item
            size={{ xs: 6, md: 6 }}
            marginTop={isMobile ? 0 : 2}
          >
            <Box
              sx={{
                ...boxStyle,
                ...((activeSection && group?.id === 1 && active) ||
                  (!activeSection && group?.id === 2 && active)),
              }}
              onClick={() => {
                if (
                  (route === "/spareParts" && +group?.id === 1) ||
                  (route === "/" && +group?.id === 2)
                ) {
                  return setOpenCategories(false);
                }
                setActiveSection(group?.id === 2 ? false : true);
                router.push(group?.id === 2 ? "/" : "/spareParts");
                setTimeout(() => {
                  setOpenCategories(false);
                }, 150);
              }}
            >
              <Box>
                <Box sx={boxHeader}>{group?.title}</Box>
                <Box sx={boxSub}>
                  {group?.id === 2 ? t.allCarsNeed : t.bestPriceForYou}
                </Box>
                <Box
                  sx={{
                    ...coloredBox,
                    background: group?.id === 2 ? "#6FBC36" : "#EB3C24",
                  }}
                >
                  {group?.id === 2 ? t.freeDilevery : t.free}
                </Box>
              </Box>
              <Box sx={menuImgStyle}>
                <Image
                  alt="img"
                  src="/icons/menu-1.svg"
                  height={100}
                  width={160}
                />
              </Box>
            </Box>
          </Grid>
        ))}
        {/* <Grid item size={6} marginTop={isMobile ? 0 : 2}>
          <Box
            sx={{ ...boxStyle, ...(!activeSection ? active : {}) }}
            onClick={() => {
              setActiveSection(false);
              router.push("/");
              setOpenCategories(false);
            }}
          >
            <Box>
              <Box sx={boxHeader}>{t.store}</Box>
              <Box sx={boxSub}>{t.allCarsNeed}</Box>
              <Box sx={{ ...coloredBox, background: "#6FBC36" }}>
                {t.freeDilevery}
              </Box>
            </Box>
            <Box sx={menuImgStyle}>
              <Image
                alt="img"
                src="/icons/menu-1.svg"
                height={100}
                width={160}
              />
            </Box>{" "}
          </Box>
        </Grid> */}
      </Grid>
      {/* Second row */}
      <Grid container spacing={2} marginTop={isMobile ? 2 : 5}>
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
      </Grid>
    </Box>
  );
}

export default CategoriesPopupcontent;
