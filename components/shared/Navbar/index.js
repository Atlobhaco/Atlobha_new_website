import { Box, IconButton, Menu, MenuItem } from "@mui/material";
import React, { useState } from "react";
import style from "./Navbar.module.scss";
import DropDownAddress from "./DropdownAddress";
import Image from "next/image";
import AdvertiseHint from "./AdvertiseHint";
import HeaderPage from "./HeaderPage";
import SectionsNav from "./SectionsNav";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useRouter } from "next/router";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import IconInsideCircle from "@/components/IconInsideCircle";
import SharedBtn from "../SharedBtn";
import SharedInput from "../SharedInput";
import CarPalette from "./CarPalette";
import { useDispatch } from "react-redux";
import { logout } from "@/redux/reducers/authReducer";
import { isAuth } from "@/config/hooks/isAuth";
import LoginModalActions from "@/constants/LoginModalActions/LoginModalActions";
import Login from "@/components/Login";

const firstPartStyle = {
  display: "flex",
  flexDirection: "column",
  width: "60%",
  gap: "10px",
};

const secondPartStyle = {
  display: "flex",
  gap: "10px",
};

function Navbar({ setOpenCategories }) {
  const dispatch = useDispatch();
  const { setOpenLogin, showBtn, openLogin } = LoginModalActions();

  const router = useRouter();
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const hideInSparePartsPage = router?.pathname?.includes("spare");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedSection, setSelectedSection] = useState("1");

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuUserIcon = [
    ...(isAuth()
      ? [
          {
            name: t.profile,
            onClick: () => {
              router.push("/userProfile");
              handleClose();
            },
          },
        ]
      : []),
    {
      name: isAuth() ? t.logout : t.login,
      onClick: () => {
        if (isAuth()) {
          dispatch(logout());
          handleClose();
        } else {
          handleClose();
          setOpenLogin(true);
        }
      },
    },
  ];

  return (
    <Box
      className={`${style["navbar"]}`}
      sx={{
        background: "#FFF5EF",
      }}
    >
      <Box className={`${style["navbar-container"]}`}>
        <Box sx={firstPartStyle}>
          {hideInSparePartsPage && <DropDownAddress />}
          <Image
            alt="logo"
            width={isMobile ? 84 : 130}
            height={isMobile ? 33 : 49}
            src="/logo/atlobha-ar-en.svg"
          />
          {!isMobile && hideInSparePartsPage && <CarPalette />}
          <AdvertiseHint />
          <HeaderPage />
          {isMobile && hideInSparePartsPage && <CarPalette />}
        </Box>
        <Box sx={secondPartStyle}>
          {!isMobile && (
            <>
              <LanguageSwitcher />
              <IconInsideCircle
                hasText={false}
                onClick={() => setOpenCategories(true)}
              />
              <IconInsideCircle
                hasText={false}
                iconUrl="/icons/search-black.svg"
              />
              <IconInsideCircle
                hasText={false}
                iconUrl="/icons/basket-black.svg"
              />
            </>
          )}
          <SharedBtn
            text="atlobhaPlus"
            customClass={`${isMobile ? style["mobile-btn"] : ""}`}
          />

          <div>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              sx={{ margin: 0, padding: 0 }}
            >
              <IconInsideCircle
                hasText={false}
                iconUrl="/icons/user-black.svg"
                width={isMobile ? "24px" : "41px"}
                height={isMobile ? "24px" : "41px"}
                imgWidth={isMobile ? 16 : 28}
                imgHeight={isMobile ? 16 : 28}
              />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              PaperProps={{
                sx: {
                  ml: 3,
                },
              }}
            >
              {menuUserIcon?.map((singleData) => (
                <MenuItem onClick={singleData?.onClick}>
                  {singleData?.name}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </Box>
      </Box>
      {!isMobile && !hideInSparePartsPage && (
        <Box className={`${style["searching"]}`}>
          <Box className={`${style["searching-header"]}`}>تدور قطع غيار !</Box>
          <Box className={`${style["searching-sub"]}`}>
            يمكنك البحث في قطع الغيار والصيانة الدورية والمشاكل المتعلقة
            بسياراتك
          </Box>
          <Box className={`${style["searching-parent"]}`}>
            <Box className={`${style["searching-parent_holder"]}`}>
              <SharedInput />
              <SharedBtn className="search-btn" text={"search"} />
            </Box>
          </Box>
        </Box>
      )}
      <Box className={`${style["sections"]}`}>
        <SectionsNav
          selectedSection={selectedSection}
          setSelectedSection={setSelectedSection}
        />
      </Box>
      <Login showBtn={!showBtn} open={openLogin} setOpen={setOpenLogin} />
    </Box>
  );
}

export default Navbar;
