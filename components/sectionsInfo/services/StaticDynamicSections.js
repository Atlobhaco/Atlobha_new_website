import HeaderSection from "@/components/HeaderSection";
import useLocalization from "@/config/hooks/useLocalization";
import { SERVICES } from "@/constants/enums";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useSelector } from "react-redux";

function StaticDynamicSections({
  sectionInfo,
  selectedId = false,
  setOpenStaticDynamic = () => {},
}) {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();
  const router = useRouter();
  const { allGroups } = useSelector((state) => state.appGroups);
  const sectiontitle = allGroups
    ?.map((data) => data?.sections)
    ?.flat()
    ?.find((sec) => sec?.type === SERVICES)?.title;

  const sectionsData = [
    {
      imgSrc: "/imgs/dynamic-car-service.svg",
      title: t.portableServices,
      subTitle: t.deliverAtDoor,
      redirect: () => {
        router.push(
          `/serviceCategory/${selectedId || "first-id"}?secTitle=${
            router?.query?.secTitle || sectiontitle
          }&secType=${SERVICES}&portableService=true`
        );
        setTimeout(() => {
          setOpenStaticDynamic(false);
        }, 500);
      },
    },
    {
      imgSrc: "/imgs/static-car-service.svg",
      title: t.fixedServices,
      subTitle: t.approvedCenters,
      redirect: () => {
        router.push(
          `/serviceCategory/${selectedId || "first-id"}?secTitle=${
            router?.query?.secTitle || sectiontitle
          }&secType=${SERVICES}&portableService=false`
        );
        setTimeout(() => {
          setOpenStaticDynamic(false);
        }, 500);
      },
    },
  ];

  return (
    <div className="row">
      <HeaderSection title={sectionInfo?.title || t.serviceCategories} />
      {sectionsData?.map((info) => (
        <div className={`col-6 mt-3 ${isMobile && "px-1"}`}>
          <Box
            key={info?.title}
            sx={{
              fontSize: "12px",
              background: "#E7F5FF",
              border: " 1px solid #FFF",
              borderRadius: "8px",
              display: isMobile ? "block" : "flex",
              justifyContent: "space-between",
              gap: "10px",
              padding: isMobile ? "8px" : "20px",
              cursor: "pointer",
              "&: hover": {
                opacity: "0.8",
              },
            }}
            onClick={() => info?.redirect()}
          >
            <Box>
              <Box
                sx={{
                  color: "#232323",
                  fontSize: isMobile ? "14px" : "20px",
                  fontWeight: "500",
                  mb: isMobile ? 0 : 1,
                }}
              >
                {info?.title}
              </Box>
              <Box
                sx={{
                  color: "#6B7280",
                  fontSize: isMobile ? "10px" : "14px",
                  fontWeight: "400",
                }}
              >
                {info?.subTitle}
              </Box>
            </Box>
            <Box
              sx={{
                ...(isMobile
                  ? {
                      display: "flex",
                      justifyContent: "flex-end",
                    }
                  : {}),
              }}
            >
              <Image
                src={info?.imgSrc}
                alt={info?.title}
                width={170}
                height={isMobile ? 65 : 134}
                style={{
                  width: "auto",
                }}
              />
            </Box>
          </Box>
        </div>
      ))}
    </div>
  );
}

export default StaticDynamicSections;
