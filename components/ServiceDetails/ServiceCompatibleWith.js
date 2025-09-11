import useLocalization from "@/config/hooks/useLocalization";
import { Box, Divider } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import DialogCentered from "../DialogCentered";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function ServiceCompatibleWith({ prod }) {
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const [openAllModels, setOpenAllModels] = useState(false);

  return (
    <>
      <Box>
        <Divider
          sx={{
            background: "#EAECF0",
            my: 1,
            height: "5px",
            borderBottomWidth: "0px",
          }}
        />
        <Box
          sx={{
            fontSize: "18px",
            fontWeight: "700",
            mb: 1,
            cursor: "pointer",
            width: "fit-content",
          }}
          onClick={() => {
            if (prod?.service_models?.length) {
              setOpenAllModels(true);
            }
          }}
        >
          {t.compatibleWith}
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            width: isMobile ? "100%" : "50vw",
            cursor: "pointer",
          }}
          onClick={() => {
            if (prod?.service_models?.length) {
              setOpenAllModels(true);
            }
          }}
        >
          <Image
            src={
              prod?.model?.model?.vehicle_brand?.image ||
              "/icons/car-yellow-logo.svg"
            }
            alt="model"
            width={80}
            height={80}
            onError={(e) => (e.target.srcset = "/imgs/no-prod-img.svg")}
            style={{
              width: "auto",
              height: "auto",
              maxWidth: isMobile ? "40px" : "80px",
              maxHeight: isMobile ? "auto" : "80px",
              borderRadius: "10px",
            }}
            loading="lazy"
          />
          <Box
            sx={{
              fontWeight: "500",
              fontSize: "16px",
              textAlign: "center",
            }}
          >
            {prod?.model?.model?.vehicle_brand?.name || t.allCars}
            <br />
            {prod?.model?.model?.name}
          </Box>
          <Box
            sx={{
              fontWeight: "500",
              fontSize: "16px",
            }}
          >
            {prod?.model?.year_from > 0 ? `${prod?.model?.year_from} - ` : null}{" "}
            {prod?.model?.year_to > 0 ? prod?.model?.year_to : null}
          </Box>
          {!!prod?.service_models?.length && (
            <Image
              loading="lazy"
              src="/icons/arrow-left-sm.svg"
              width={isMobile ? 9 : 20}
              height={15}
              alt="arrow"
              style={{
                marginInlineStart: "auto",
                transform: locale === "ar" ? "rotate(0deg)" : "rotate(180deg)",
              }}
            />
          )}
        </Box>
      </Box>

      <DialogCentered
        open={openAllModels}
        setOpen={setOpenAllModels}
        subtitle={false}
        title={t.compatibleWith}
        hasCloseIcon={true}
        content={
          <Box
            sx={{
              maxHeight: "500px",
              overflow: "auto",
            }}
          >
            {prod?.service_models?.map((singleModel, index) => (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    gap: "10px",
                    alignItems: "center",
                  }}
                >
                  <Image
                    src={
                      singleModel?.model?.vehicle_brand?.image ||
                      "/imgs/no-prod-img.svg"
                    }
                    alt="model"
                    width={80}
                    height={80}
                    onError={(e) => (e.target.srcset = "/imgs/no-prod-img.svg")}
                    style={{
                      width: "auto",
                      height: "auto",
                      maxWidth: isMobile ? "40px" : "80px",
                      maxHeight: isMobile ? "auto" : "80px",
                      borderRadius: "10px",
                    }}
                    loading="lazy"
                  />
                  <Box
                    sx={{
                      fontWeight: "500",
                      fontSize: "16px",
                      textAlign: "center",
                    }}
                  >
                    {singleModel?.model?.vehicle_brand?.name}
                    <br />
                    {singleModel?.model?.name}
                  </Box>
                  <Box
                    sx={{
                      fontWeight: "500",
                      fontSize: "16px",
                    }}
                  >
                    {singleModel?.year_from
                      ? `${singleModel?.year_from} - `
                      : null}{" "}
                    {singleModel?.year_to}
                  </Box>
                </Box>
                {index !== prod?.service_models?.length - 1 && (
                  <Divider
                    sx={{
                      background: "#EAECF0",
                      my: 1,
                      height: "5px",
                      borderBottomWidth: "0px",
                    }}
                  />
                )}
              </Box>
            ))}
          </Box>
        }
      />
    </>
  );
}

export default ServiceCompatibleWith;
