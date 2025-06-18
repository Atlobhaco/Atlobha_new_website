import Login from "@/components/Login";
import SharedBtn from "@/components/shared/SharedBtn";
import ProfileSetting from "@/components/userProfile/ProfileSetting";
import CommunicationSection from "@/components/userProfile/communicationSection";
import useLocalization from "@/config/hooks/useLocalization";
import LoginModalActions from "@/constants/LoginModalActions/LoginModalActions";
import { Box } from "@mui/material";
import Image from "next/image";
import React from "react";

function GuestMobileView({ profileSections, boxShadowStyle }) {
  const { locale, t } = useLocalization();
  const { setOpenLogin, showBtn, openLogin } = LoginModalActions();

  return (
    <Box
      sx={{
        boxShadow: boxShadowStyle,
      }}
      className="col-12 pb-0 p-3"
    >
      <div className="d-flex align-items-center flex-column justify-content-center">
        <Image
          loading="lazy"
          src="/imgs/user-profile.svg"
          width={56}
          height={56}
          alt="user-img-mobile"
        />
        <Box
          sx={{
            mt: 1,
            fontSize: "25px",
            fontWeight: "500",
            color: "#0F172A",
          }}
        >
          {t.login}
        </Box>
        <Box
          sx={{
            mb: 1,
            color: "#6B7280",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          {t.createNewAccount}
        </Box>
        <SharedBtn
          className="big-main-btn"
          text={"login"}
          customClass="w-100 mb-1"
          onClick={() => setOpenLogin(true)}
        />
      </div>
      <div className="row mt-3">
        {profileSections?.map((data, index) => (
          <Box className="col-md-12" key={`${data?.text}${index}`}>
            <ProfileSetting data={data} />
          </Box>
        ))}

        {/* <div className="col-12 mb-3">
            <AtlobhaPlusHint />
          </div> */}

        <CommunicationSection />
      </div>

      <Login
        showBtn={!showBtn}
        open={openLogin}
        setOpen={setOpenLogin}
        id="fourthLogin"
        customIDOtpField="fourthOtpField"
        customIDLogin="fourthBtnLogin"
      />
    </Box>
  );
}

export default GuestMobileView;
