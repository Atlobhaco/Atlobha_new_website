import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/router";

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

const sectionService = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  background: "#FFDDEC",
  height: "118px",
  borderRadius: "4px",
  padding: "8px",
};

const sectionServiceTitle = {
  color: "black",
  fontSize: "14px",
  fontWeight: "400",
};

const imgBoxStyle = {
  flexGrow: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const imgStyle = {
  width: "100%",
  height: "100%",
};

function CategoriesPopupcontent({ activeSection, setActiveSection }) {
  const router = useRouter();
  const { isMobile } = useScreenSize();

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
    fontWeight: isMobile ? "500" : "400",
  };

  return (
    <Box>
      <Grid container spacing={2}>
        {/* First row with two columns */}
        <Grid item size={{ xs: 6, md: 6 }}>
          <Box
            sx={{ ...boxStyle, ...(activeSection ? active : {}) }}
            onClick={() => {
              setActiveSection(true);
              router.push("/spareParts");
            }}
          >
            <Box>
              <Box sx={boxHeader}>تسعير قطع الغيار</Box>
              <Box sx={boxSub}>افضل الاسعار نلاقيها لك!</Box>
              <Box sx={{ ...coloredBox, background: "#EB3C24" }}>مجاني</Box>
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
        <Grid item size={6}>
          <Box
            sx={{ ...boxStyle, ...(!activeSection ? active : {}) }}
            onClick={() => {
              setActiveSection(false);
              router.push("/");
            }}
          >
            <Box>
              <Box sx={boxHeader}>المتجر</Box>
              <Box sx={boxSub}>كل احتياجات سياراتك و اكثر </Box>
              <Box sx={{ ...coloredBox, background: "#6FBC36" }}>
                توصيل مجاني
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
      <Grid container spacing={2} marginTop={2}>
        <Grid item size={12}>
          <Box sx={secondHeader}>المزيد من الخدمات</Box>
        </Grid>
        <Grid item size={{ xs: 4, md: 2 }}>
          <Box sx={{ ...sectionService, background: "red" }}>
            <Box sx={sectionServiceTitle}>المساعدة علي الطريق</Box>
            <Box sx={imgBoxStyle}>
              <Image
                alt="img"
                src="/icons/user-black.svg"
                height={20}
                width={20}
                style={imgStyle}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item size={{ xs: 4, md: 2 }}>
          <Box sx={sectionService}>
            <Box sx={sectionServiceTitle}>تجارب القيادة</Box>
            <Box sx={imgBoxStyle}>
              <Image
                alt="img"
                src="/icons/menu-1.svg"
                height={20}
                width={20}
                style={imgStyle}
              />
            </Box>
          </Box>
        </Grid>
        <Grid item size={{ xs: 4, md: 2 }}>
          3
        </Grid>
        <Grid item size={{ xs: 4, md: 2 }}>
          <Box sx={sectionService}>
            <Box sx={sectionServiceTitle}>تجارب القيادة</Box>
            <Box sx={imgBoxStyle}>
              <Image
                alt="img"
                src="/icons/menu-1.svg"
                height={20}
                width={20}
                style={imgStyle}
              />
            </Box>
          </Box>{" "}
        </Grid>
        <Grid item size={{ xs: 4, md: 2 }}>
          5
        </Grid>
        <Grid item size={{ xs: 4, md: 2 }}>
          <Box sx={sectionService}>
            <Box sx={sectionServiceTitle}>تجارب القيادة</Box>
            <Box sx={imgBoxStyle}>
              <Image
                alt="img"
                src="/icons/menu-1.svg"
                height={20}
                width={20}
                style={imgStyle}
              />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default CategoriesPopupcontent;
