import { MANUFACTURERS } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import useLocalization from "@/config/hooks/useLocalization";
import useCustomQuery from "@/config/network/Apiconfig";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

function AtlobhaPartners({ sectionInfo }) {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();
  const [data, setData] = useState([]);

  useCustomQuery({
    name: [`partenres${sectionInfo?.id}`, sectionInfo?.is_active],
    url: `${MANUFACTURERS}?page=1`,
    refetchOnWindowFocus: false,
    enabled: sectionInfo?.requires_authentication
      ? isAuth() && sectionInfo?.is_active
      : sectionInfo?.is_active,
    select: (res) => res?.data,
    onSuccess: (res) => setData(res?.data),
  });

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 7, // Number of items to show on desktop
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 5, // Number of items to show on tablets
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 4, // Number of items to show on mobile
    },
  };

  return !sectionInfo?.is_active || !data?.length ? null : (
    <Box>
      <Box
        sx={{
          fontWeight: "700",
          fontSize: isMobile ? "20px" : "30px",
        }}
      >
        {sectionInfo?.title}
      </Box>

      <Box sx={{ mt: 3, mb: 1 }}>
        <Carousel
          responsive={responsive}
          infinite
          autoPlay
          autoPlaySpeed={1000}
          keyBoardControl
          showDots={false}
          arrows={false}
        >
          {data?.map((part, index) => (
            <Box
              key={part?.logo?.url + index}
              sx={{
                display: "flex",
                alignItems: "end",
                justifyContent: "end",
              }}
            >
              <Image
                src={part?.logo?.url}
                alt={part?.logo?.url}
                width={isMobile ? 53 : 113}
                height={isMobile ? 50 : 106}
                style={{
                  width: "auto",
                  height: "auto",
                  margin: "auto",
                  maxWidth: "100%",
                  maxHeight: "100%",
                }}
              />
            </Box>
          ))}
        </Carousel>
      </Box>
    </Box>
  );
}

export default AtlobhaPartners;
