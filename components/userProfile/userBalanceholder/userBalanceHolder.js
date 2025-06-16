import React from "react";
import style from "./userBalanceHolder.module.scss";
import Image from "next/image";
import ActionButtons from "@/components/shared/actionButtons";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import { riyalImgBlack } from "@/constants/helpers";

function UserBalanceHolder({ data, removeStyle = false }) {
  const router = useRouter();
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();

  return (
    <div className={`col-md-12`}>
      <Box
        sx={{
          border: removeStyle ? "unset" : "1px solid #f0f0f0",
          padding: removeStyle ? "10px  0px" : "20px",
        }}
        className={`${style["holder"]}`}
      >
        <div className={`${style["info"]}`}>
          <Image
            loading="lazy"
            src="/imgs/user-profile.svg"
            width={isMobile ? 35 : 56}
            height={isMobile ? 35 : 56}
            alt="user-img"
          />
          <div>
            <div className={`${style["name"]}`}>{data?.name}</div>
            <div className={`${style["hint"]}`}>{t.showAndEditProfile}</div>
          </div>
        </div>
        <div className={`${style["edit"]}`}>
          <ActionButtons
            type="edit"
            onClick={() => router.push("/userProfile/editInfo")}
          />
        </div>
      </Box>
      <Box
        sx={{
          borderBottomRightRadius: removeStyle ? "10px !important" : "unset",
          borderBottomLeftRadius: removeStyle ? "10px !important" : "unset",
          borderTopLeftRadius: removeStyle ? "10px" : "unset",
          borderTopRightRadius: removeStyle ? "10px" : "unset",
        }}
        className={`${style["balance"]}`}
      >
        <div className={`${style["text"]}`}>
          <Image
            loading="lazy"
            src="/imgs/wallet-sm.svg"
            width={isMobile ? 20 : 30}
            height={isMobile ? 20 : 30}
            alt="wallet"
            style={{
              marginBottom: "3px",
            }}
          />
          <Box sx={{ mt: 1 }}>{t.balanceProfile}</Box>
          <span>
            {data?.wallet_balance || 0} {riyalImgBlack()}
          </span>
        </div>
        <Image
          loading="lazy"
          src="/icons/arrow-left-sm.svg"
          width={isMobile ? 9 : 12}
          height={12}
          alt="arrow"
          style={{
            transform: locale === "ar" ? "rotate(0deg)" : "rotate(180deg)",
          }}
        />
      </Box>
    </div>
  );
}

export default UserBalanceHolder;
