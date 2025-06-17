import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress, Typography } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

function SingleCarItem({ car, setDeleteCarId, isLoading, deleteCarId }) {
  const { t } = useLocalization();
  const router = useRouter();
  const { isMobile } = useScreenSize();

  const box = {
    padding: isMobile ? "12px" : "24px",
    borderRadius: "10px",
    border: "2px solid #F4F4F4",
    background: "#FFF",
    mb: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "5px",
    // flexWrap: "wrap",
  };

  const actionBox = {
    width: isMobile ? "35px" : "50px",
    height: isMobile ? "30px" : "40px",
    borderRadius: "10px",
    padding: isMobile ? "8px" : "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  return (
    <Box sx={box} key={car.id}>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "10px 0px",
          }}
        >
          {/* Car Logo */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: isMobile ? "30px" : "48px",
              height: isMobile ? "30px" : "48px",
            }}
          >
            <Image
              loading="lazy"
              alt={car?.brand?.name}
              src={car?.brand?.image} // Car logo
              width={isMobile ? 25 : 48}
              height={isMobile ? 25 : 48}
              style={{
                width: "auto",
                height: "auto",
                maxHeight: isMobile ? "25px" : "48px",
                maxWidth: isMobile ? "25px" : "48px",
              }}
            />
          </Box>
          {/* Car Details */}
          <Box
            sx={{
              flexGrow: 1,
              textAlign: "right",
              display: "flex",
              gap: "15px",
              alignItems: "flex-start",
            }}
          >
            <Box>
              <Typography
                sx={{
                  fontSize: isMobile ? "12px" : "16px",
                  fontWeight: 500,
                  textAlign: "start",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                {car?.brand?.name} {car?.model?.name}
              </Typography>
              <Typography
                sx={{
                  fontSize: isMobile ? "12px" : "16px",
                  fontWeight: 500,
                  textAlign: "start",
                }}
              >
                {car?.year}
              </Typography>
            </Box>
            {!!car?.is_default && (
              <Box
                sx={{
                  background: "#E9F4FC",
                  color: "#3D96F7",
                  padding: "2px 8px",
                  fontSize: "10px",
                  fontWeight: "400",
                  borderRadius: "50px",
                  // height: "26px",
                  display: "flex",
                  // alignItems: "center",
                }}
              >
                {t.default}
              </Box>
            )}
          </Box>
        </Box>

        {!car?.brand?.enabled_for_spare_parts && (
          <Box
            sx={{
              marginInlineStart: "40px",
              background: "#EE772F",
              width: "fit-content",
              padding: isMobile ? "1px 4px" : "1px 6px",
              borderRadius: "4px",
              marginBottom: "2px",
              color: "white",
              fontSize: isMobile ? "10px" : "15px",
              fontWeight: "500",
            }}
          >
            <ErrorOutlineIcon
              sx={{
                color: "white",
                width: isMobile ? "16px" : "20px",
                marginInlineEnd: "4px",
              }}
            />
            {t.limitSupport}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: isMobile ? "5px" : "10px",
        }}
      >
        {/* <Box
          sx={{
            ...actionBox,
            background: "#E9FAEF",
          }}
        >
          <Image
            alt="info"
            src={"/icons/exclamation-green.svg"}
            width={isMobile ? 15 : 24}
            height={isMobile ? 15 : 24}
          />
        </Box> */}
        <Box
          sx={{
            ...actionBox,
            background: "#E7F5FF",
          }}
          onClick={() => {
            router.push(`/userProfile/myCars/${car?.id}`);
          }}
        >
          <Image
            loading="lazy"
            alt="info"
            src={"/icons/pen-blue.svg"}
            width={isMobile ? 15 : 24}
            height={isMobile ? 15 : 24}
          />
        </Box>
        <Box
          sx={{
            ...actionBox,
            background: "#FFE4DD",
          }}
          onClick={() => {
            setDeleteCarId(car?.id);
          }}
        >
          {isLoading && +car?.id === +deleteCarId ? (
            <CircularProgress color="inherit" size={10} />
          ) : (
            <Image
              loading="lazy"
              alt="info"
              src={"/icons/basket-red.svg"}
              width={isMobile ? 15 : 24}
              height={isMobile ? 15 : 24}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default SingleCarItem;
