import { MANUFACTURERS } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import Slider from "react-slick";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

function AtlobhaPartners({ sectionInfo }) {
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const [data, setData] = useState([]);
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);

  useCustomQuery({
    name: [`partenres${sectionInfo?.id}`, sectionInfo?.is_active],
    url: `${MANUFACTURERS}?page=1`,
    refetchOnWindowFocus: false,
    enabled: sectionInfo?.requires_authentication
      ? isAuth() && sectionInfo?.is_active
      : sectionInfo?.is_active,
    select: (res) => res?.data,
    onSuccess: (res) => setData(res?.data?.filter((d) => d?.is_active)),
  });

  var settings = {
    dots: true,
    infinite: false,
    slidesToShow: isMobile ? 2 : 3,
    slidesToScroll: 1,
    initialSlide:
      locale === "ar"
        ? isMobile
          ? Math.max(Math.ceil(data.length / 3), 0)
          : Math.max(Math.ceil(data.length / 3) - 3, 0)
        : 0, // 👈 start at last "page"
    // autoplay: true,
    // rtl: false,
    // touchThreshold: 0,
    // speed: 2500,
    // autoplaySpeed: 0,
    // cssEase: "ease-in",
    // arrows: false,
    // isDragging: true,
    // swipe: false,
    // pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4.5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
    beforeChange: () => setIsDragging(true), // Set dragging to true when slide changes
    afterChange: () => setTimeout(() => setIsDragging(false), 100), // Reset dragging state
  };

  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  return !sectionInfo?.is_active || !data?.length ? null : (
    <Box>
      <Box
        sx={{
          fontWeight: "700",
          fontSize: isMobile ? sectionInfo?.customFont || "20px" : "30px",
          textAlign: sectionInfo?.textAlign || "start",
          color: sectionInfo?.textColor || "inherit",
        }}
      >
        {sectionInfo?.title}
      </Box>

      <Box sx={{ mt: 3, mb: 1 }}>
        <Slider {...settings}>
          {chunkArray(data, 3).map((group, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                gap: 2, // space between the 3 items
                justifyContent: "center",
                direction: locale === "en" ? "rtl" : "ltr",
              }}
            >
              {group.map((part, subIndex) => (
                <Box
                  key={subIndex}
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    height: isMobile ? "52px" : "100px",
                    mb: isMobile ? 1 : 3,
                    // mx: isMobile ? 0 : 1,
                    cursor: "pointer",
                    width: "85%",
                    margin: isMobile ? "8px auto 8px auto" : 1,
                  }}
                  onClick={() => {
                    if (!isDragging) {
                      router.push(`/manufacture/${part?.id}`);
                    }
                  }}
                >
                  <Box
                    sx={{
                      //   fontSize: "5px",
                      background: "#F9DD4B",
                      height: "100%",
                      ...(locale === "en"
                        ? {
                            borderTopRightRadius: "10px",
                            borderBottomRightRadius: "10px",
                          }
                        : {
                            borderTopLeftRadius: "10px",
                            borderBottomLeftRadius: "10px",
                          }),
                      display: "flex",
                      alignItems: "flex-end",
                      flexDirection: "column",
                      justifyContent: "center",
                      padding: isMobile
                        ? "10px"
                        : locale === "en"
                        ? "0px 0px 0px 20px"
                        : "0px 20px 0px 0px",
                      width: isMobile ? "calc(100% / 1.5)" : "calc(100% / 2)",
                    }}
                  >
                    <Box
                      sx={{
                        fontWeight: "bold",
                        color: "#232323",
                        textAlign: "end",
                      }}
                    >
                      {part?.name}
                    </Box>
                    <Box
                      sx={{
                        fontWeight: "500",
                        color: "#6B7280",
                      }}
                    >
                      <KeyboardArrowRightIcon
                        sx={{
                          color: "grey",
                          transform: `rotateY(${
                            locale === "ar" ? "180deg" : "0deg"
                          })`,
                        }}
                      />
                      {t.visitStore}{" "}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      width: isMobile ? "90px" : "200px",
                    }}
                  >
                    <Image
                      onClick={() => {
                        if (!isDragging) {
                          router.push(`/manufacture/${part?.id}`);
                        }
                      }}
                      src={part?.logo?.url}
                      alt={part?.logo?.url}
                      width={isMobile ? 53 : 100}
                      height={isMobile ? 50 : 100}
                      style={{
                        width: "auto",
                        height: "auto",
                        margin: "auto",
                        maxWidth: "100%",
                        maxHeight: isMobile ? "40px" : "100px",
                        cursor: "pointer",
                        objectFit: "contain",
                      }}
                      loading="lazy"
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
}

export default AtlobhaPartners;
