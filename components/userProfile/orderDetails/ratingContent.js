import useLocalization from "@/config/hooks/useLocalization";
import { Box, Divider, Rating } from "@mui/material";
import Image from "next/image";
import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

function RatingContent({
  setOpenRating = () => {},
  rating = false,
  setRating = () => {},
}) {
  const { locale } = useLocalization();
  const prefilledSelections = [
    {
      name: "الخدمة ممتازة",
    },
    {
      name: "التوصيل سريع",
    },
    {
      name: "القطعة اصلية",
    },
    {
      name: "القطعة مطابقة للمواصفات",
    },
    {
      name: "خدمة عملاء جيدة",
    },
  ];
  return (
    <Box>
      <Divider sx={{ background: "#EAECF0", mb: 3 }} />
      <Box className="d-flex flex-column  align-items-center gap-4 w-50 mx-auto text-center">
        <Rating
          sx={{
            direction: locale === "ar" ? "ltr" : "rtl",
          }}
          name="rate-products"
          value={rating}
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
          size="large"
          icon={
            <Image
              loading="lazy"
              src={"/icons/yellow-star.svg"}
              alt="arrow"
              width={42}
              height={42}
              className={"ms-2"}
            />
          }
          emptyIcon={
            <Image
              loading="lazy"
              src={"/icons/grey-star.svg"}
              alt="arrow"
              width={42}
              height={42}
              className={"ms-2"}
            />
          }
        />
        <Box
          sx={{
            color: "#878787",
            fontSize: "16px",
            lineHeight: "24px",
          }}
        >
          أعطي تقييمًا من 1 إلى 5 نجوم، 1 يعني خيبة الأمل و5 يعني الرضا
        </Box>
        <Box
          sx={{
            fontWeight: 700,
            fontSize: "16px",
            color: "#1C1C28",
          }}
        >
          ماذا يعجبك من الخدمة المقدمة
        </Box>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            // alignItems: "center",
            // justifyContent: "space-between",
          }}
        >
          {prefilledSelections?.map((data) => (
            <Box
              sx={{
                background: "#F2F4F7",
                border: "1px solid #DEDEDE",
                borderRadius: "10px",
                padding: "4px 12px",
              }}
              key={data?.name}
            >
              {data?.name}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default RatingContent;
