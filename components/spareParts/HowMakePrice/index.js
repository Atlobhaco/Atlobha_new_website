import SharedBtn from "@/components/shared/SharedBtn";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

const closeHolder = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
};

function HowMakePrice({ setOpenhowPricing }) {
  const { isMobile } = useScreenSize();

  const header = {
    mt: 2,
    mb: 3,
    display: "flex",
    gap: "10px",
    alignItems: "center",
    fontWeight: "500",
    fontSize: isMobile ? "17px" : "20px",
    color: "black",
  };
  const contentData = {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    fontSize: "12px",
    fontWeight: "400",
    color: "#0F172A",
    mb: 2,
    paddingInlineEnd: isMobile ? "0px" : "50px",
  };

  return (
    <Box>
      <Box sx={closeHolder}>
        <Image
          onClick={() => setOpenhowPricing(false)}
          style={{
            cursor: "pointer",
          }}
          src="/icons/close-circle.svg"
          alt="close"
          width={34}
          height={34}
        />
      </Box>
      <Box sx={header}>
        <Image
          style={{
            cursor: "pointer",
          }}
          src="/imgs/how-price.svg"
          alt="close"
          width={53}
          height={37}
        />
        <Box component="span">ماهي تسعير قطع الغيار في اطلبها؟</Box>
      </Box>
      <Box sx={contentData}>
        <Image
          src="/icons/white-circle-check.svg"
          alt="check"
          width={18}
          height={18}
        />
        اضف اسم او رقم القطعه الخاصه بسيارتك مع ارفاق صوره ان وجد
      </Box>
      <Box sx={{ ...contentData, fontWeight: "700" }}>
        <Image
          src="/icons/yellow-circle-check.svg"
          alt="check"
          width={18}
          height={18}
        />
        سيتم البحث عن القطع من قبل فريق اطلبها عند الوكلاء المعتمدين و تسعير
        القطع باقل سعر موجود ف السوق{" "}
      </Box>
      <Box sx={contentData}>
        <Image
          src="/icons/white-circle-check.svg"
          alt="check"
          width={18}
          height={18}
        />
        سيتم اعلامك عند الانتهاء من التسعير وذلك ليتم تاكيد الطلب من جهتك ، و
        اتمام عمليه الدفع{" "}
      </Box>
      <Box sx={contentData}>
        <Image
          src="/icons/white-circle-check.svg"
          alt="check"
          width={18}
          height={18}
        />
        عند تاكيد الطلب و اتمام عمليه الدفع سيتم شحن القطع الي العنوان الذي
        اخترته
      </Box>

      <Box>
        <Image
          style={{
            width: "100%",
            marginTop: "20px",
          }}
          src="/imgs/pricing-done.svg"
          alt="close"
          width={335}
          height={200}
        />
      </Box>

      <Box
        sx={{
          marginTop: "40px",
        }}
      >
        <SharedBtn
          className="big-main-btn"
          customClass="w-100"
          text="addRequest"
        />
      </Box>
      <Box
        sx={{
          margin: "20px 0px",
          textAlign: "center",
          color: "#6B7280",
          fontSize: "16px",
          fontWeight: "500",
          cursor: "pointer",
        }}
      >
        اريد معلومات اكثر عنها
      </Box>
    </Box>
  );
}

export default HowMakePrice;
