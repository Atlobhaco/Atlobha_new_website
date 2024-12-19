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

const boxSub = {
  fontSize: "10px",
  fontWeight: "400",
  color: "#6B7280",
  marginBottom: "5px",
};

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

function CategoriesPopupcontent({ activeSection, setActiveSection }) {
  const router = useRouter();
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const [appGroups, setAppGroups] = useState([]);

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
    fontSize: isMobile ? "14px" : "20px",
    fontWeight: "500",
    color: "black",
    marginBottom: "5px",
  };

  const menuImgStyle = {
    position: isMobile && "relative",
    top: isMobile && "-24px",
    left: isMobile && "5%",
  };

  const sectionServiceTitle = {
    color: "black",
    fontSize: "14px",
    fontWeight: isMobile ? "500" : "500",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    lineHeight: "1.4",
    width: "100%",
    paddingTop: "5px",
  };

  const { data } = useCustomQuery({
    name: "ListSectionsGroups",
    url: `${APP_SECTIONS_GROUPS}`,
    refetchOnWindowFocus: false,
    enabled: true,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      setAppGroups(res);
    },
    onError: () => {
      toast.error(t.someThingWrong);
    },
  });

  const returnImgDependOnId = (id) => {
    switch (id) {
      case 6:
        return "/imgs/test-1.svg";
      case 5:
        return "/imgs/najm.svg";
      case 3:
        return "/imgs/maintenznce.svg";
      case 7:
        return "/imgs/road-help.svg";
      case 4:
        return "/imgs/conz.svg";
      default:
        return "/imgs/remote-car.svg";
    }
  };
  const returnBgColorDependOnId = (id) => {
    switch (id) {
      case 6:
        return "#FFDDEC";
      case 5:
        return "#E9FAEF";
      case 3:
        return "#E7F5FF";
      case 7:
        return "#F3F0FF";
      case 4:
        return "#FFE4DD";
      default:
        return "#DDECFF";
    }
  };
  return (
    <Box>
      <Grid container spacing={2}>
        {/* First row with two columns */}
        <Grid item size={{ xs: 6, md: 6 }} marginTop={isMobile ? 0 : 2}>
          <Box
            sx={{ ...boxStyle, ...(activeSection ? active : {}) }}
            onClick={() => {
              setActiveSection(true);
              router.push("/spareParts");
            }}
          >
            <Box>
              <Box sx={boxHeader}>{t.sparePartPricing}</Box>
              <Box sx={boxSub}>{t.bestPriceForYou}</Box>
              <Box sx={{ ...coloredBox, background: "#EB3C24" }}>{t.free}</Box>
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
        <Grid item size={6} marginTop={isMobile ? 0 : 2}>
          <Box
            sx={{ ...boxStyle, ...(!activeSection ? active : {}) }}
            onClick={() => {
              setActiveSection(false);
              router.push("/");
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
        </Grid>
      </Grid>
      {/* Second row */}
      <Grid container spacing={2} marginTop={isMobile ? 2 : 5}>
        <Grid item size={12}>
          <Box sx={secondHeader}>{t.moreServices}</Box>
        </Grid>
        {appGroups?.map((group) => (
          <Grid item size={{ xs: 4, md: 2 }}>
            <Box
              sx={{
                ...sectionService,
                background: `url(${returnImgDependOnId(group?.id)})`,
                backgroundColor: `${returnBgColorDependOnId(group?.id)}`,
              }}
            >
              <Box sx={sectionServiceTitle}>{group?.title}</Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default CategoriesPopupcontent;
