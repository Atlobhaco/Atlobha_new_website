import { Box } from "@mui/material";
import React, { useState } from "react";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import useCustomQuery from "@/config/network/Apiconfig";
import { SERVICE_CATEGORIES } from "@/config/endPoints/endPoints";
import { isAuth } from "@/config/hooks/isAuth";
import { useSelector } from "react-redux";
import HeaderSection from "@/components/HeaderSection";
import CategoryData from "@/components/Categories/CategoryData";
import { useRouter } from "next/router";
import DialogCentered from "@/components/DialogCentered";
import StaticDynamicSections from "./StaticDynamicSections";
import useLocalization from "@/config/hooks/useLocalization";

export default function CategoriesServices({ sectionInfo }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const router = useRouter();
  const [openStaticDynamic, setOpenStaticDynamic] = useState(false);

  const { selectedAddress, defaultAddress } = useSelector(
    (s) => s.selectedAddress
  );
  const { selectedCar, defaultCar } = useSelector((s) => s.selectedCar);

  const lat = selectedAddress?.lat || defaultAddress?.lat || 24.7136;
  const lng = selectedAddress?.lng || defaultAddress?.lng || 46.6753;
  const modelId = selectedCar?.model?.id || defaultCar?.model?.id || "";

  const authEnabled =
    sectionInfo?.is_active &&
    (!sectionInfo?.requires_authentication || (isAuth() && lat));

  const { data: categories } = useCustomQuery({
    name: [`services-categories=${sectionInfo?.id}`],
    url: `${SERVICE_CATEGORIES}?lat=${lat}&lng=${lng}&model_id=${modelId}`,
    refetchOnWindowFocus: false,
    enabled: authEnabled,
    select: (res) => res?.data?.data,
  });

  if (!sectionInfo?.is_active || !categories?.length) return null;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: isMobile ? "10px" : "25px",
        mb: 2,
      }}
    >
      <HeaderSection title={sectionInfo?.title} />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: isMobile ? "12px" : "32px",
          justifyContent: isMobile ? "space-around" : "flex-start",
        }}
      >
        {categories.map((cat) => (
          <CategoryData
            key={cat?.name}
            category={cat}
            keyValue={cat?.name}
            imgPath={cat?.image?.url}
            text={cat?.name}
            bgImage={cat?.background_image?.url}
            handleClick={() => {
              const hasPortable = cat?.portable_services_count > 0;
              const hasStore = cat?.store_services_count > 0;
              hasPortable && hasStore
                ? setOpenStaticDynamic(true)
                : router.push(
                    `/serviceCategory/${cat?.id}?secTitle=${router.query?.secTitle}&secType=services&portableService=${hasPortable}`
                  );
            }}
          />
        ))}
      </Box>
      <DialogCentered
        title={false}
        subtitle={false}
        open={openStaticDynamic}
        setOpen={setOpenStaticDynamic}
        hasCloseIcon
        content={
          <StaticDynamicSections sectionInfo={{ title: t.serviceCategories }} />
        }
      />
    </Box>
  );
}
