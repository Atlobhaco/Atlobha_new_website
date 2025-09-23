import useScreenSize from "@/constants/screenSize/useScreenSize";
import { toggleMergeEmail } from "@/redux/reducers/mergeEmailExistReducer";
import { Box, Divider } from "@mui/material";
import Image from "next/image";
import React from "react";
import SharedBtn from "../SharedBtn";
import useLocalization from "@/config/hooks/useLocalization";
import { useDispatch, useSelector } from "react-redux";
import useCustomQuery from "@/config/network/Apiconfig";
import { EMAIL, OTP } from "@/config/endPoints/endPoints";

const closeHolder = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
};

function MergeEmailScreenOrNot({ setStepCount, recallReqOtp }) {
  const { isMobile } = useScreenSize();
  const { t } = useLocalization();
  const dispatch = useDispatch();

  return (
    <Box>
      {isMobile ? (
        <Box sx={closeHolder}>
          <Image
            loading="lazy"
            onClick={() => {
              toggleMergeEmail();
            }}
            style={{
              cursor: "pointer",
            }}
            src="/icons/close-circle.svg"
            alt="close"
            width={34}
            height={34}
          />
        </Box>
      ) : (
        <Divider></Divider>
      )}{" "}
      <Box
        className={`d-flex align-items-center justify-content-center ${
          isMobile ? "mt-0" : "mt-4"
        } flex-column`}
      >
        <Image
          loading="lazy"
          src="/imgs/migration.svg"
          width={122}
          height={isMobile ? 158 : 270}
          alt="add-phone"
          style={{
            minWidth: "100%",
          }}
        />
        <Box
          sx={{
            fontSize: isMobile ? "20px" : "24px",
            fontWeight: "700",
            mt: isMobile ? 1 : 2,
            color: "#1C1C28",
            textAlign: "center",
          }}
        >
          {t.emailEnteredBefore}
        </Box>
        <Box
          sx={{
            fontSize: isMobile ? "14px" : "20px",
            fontWeight: "400",
            mt: 1,
            color: "#1C1C28",
          }}
        >
          {t.mergeTwoAccounts}
        </Box>
        <Box
          sx={{
            width: isMobile ? "100%" : "70%",
            mt: isMobile ? 5 : 2,
            display: "flex",
            gap: "10px",
          }}
        >
          <SharedBtn
            id="second-step-confirm"
            text={"ok"}
            className="big-main-btn"
            customClass="w-100"
            onClick={() => {
              recallReqOtp();
              setStepCount(2);
            }}
          />
          <SharedBtn
            id="second-step-cancel"
            text={"common.cancel"}
            className="outline-btn"
            customClass="w-100"
            onClick={() => dispatch(toggleMergeEmail())}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default MergeEmailScreenOrNot;
