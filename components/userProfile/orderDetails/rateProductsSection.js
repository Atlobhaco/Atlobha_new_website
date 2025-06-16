import DialogCentered from "@/components/DialogCentered";
import SharedBtn from "@/components/shared/SharedBtn";
import { Box } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import RatingContent from "./ratingContent";

function RateProductsSection({ orderDetails = {} }) {
  const [openRating, setOpenRating] = useState(false);
  const [rating, setRating] = useState(2);

  return (
    <Box
      sx={{
        padding: "0px 10px",
        background: "#FEFCED",
        height: "90px",
        display: "flex",
      }}
    >
      <Box
        sx={{
          flex: 1,
          padding: "7px 16px",
          display: "flex",
          gap: "15px",
          alignItems: "center",
        }}
      >
        <Image
          loading="lazy"
          src="/icons/star-rate.svg"
          alt="rate"
          width={30}
          height={30}
        />
        <Box>
          <Box
            sx={{
              color: "#EE772F",
              fontSize: "14px",
              fontWeight: "700",
            }}
          >
            قيم المنتجات
          </Box>
          <Box
            sx={{
              color: "#6B7280",
              fontSize: "10px",
              fontWeight: "500",
            }}
          >
            رايك يهمنا لانه يساعدنا في تحسين جودة منتجاتنا وخدماتنا
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <SharedBtn
          customStyle={{
            height: "38px",
            padding: "6px 12px",
          }}
          className="big-main-btn"
          text="rateProductsNow"
          //   onClick={() => setOpenRating(true)}
        />
      </Box>
      {/* rating poup */}
      <DialogCentered
        hasCloseIcon={true}
        open={openRating}
        setOpen={setOpenRating}
        title={"استمتع بتجربة الخدمة معنا"}
        subtitle={false}
        // customClass="minimize-center-dialog-width"
        content={
          <RatingContent
            setOpenRating={setOpenRating}
            rating={rating}
            setRating={setRating}
          />
        }
      />
    </Box>
  );
}

export default RateProductsSection;
