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
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/reducers/authReducer";
import { isAuth } from "@/config/hooks/isAuth";
import LoginModalActions from "@/constants/LoginModalActions/LoginModalActions";
import Login from "@/components/Login";
import UserBalanceHolder from "@/components/userProfile/userBalanceholder/userBalanceHolder";
import { USERS } from "@/config/endPoints/endPoints";
import { useAuth } from "@/config/providers/AuthProvider";
import useCustomQuery from "@/config/network/Apiconfig";
import BlurText from "../BlurText";
import { MARKETPLACE, SPAREPARTS } from "@/constants/enums";

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

function Navbar({ setOpenCategories, hideNavbarInUrls }) {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const { setOpenLogin, showBtn, openLogin } = LoginModalActions();

  const router = useRouter();
  const { mobileScreen } = router.query;
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const hideInSpareOrSectionsPage =
    router?.pathname?.includes("spare") ||
    router?.pathname?.includes("sections");
  const hideComponent = hideNavbarInUrls.some((url) =>
    router?.pathname?.includes(url)
  );
  const { allGroups } = useSelector((state) => state.appGroups);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedSection, setSelectedSection] = useState(false);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { data } = useCustomQuery({
    name: "userInfoForNavbar",
    url: `${USERS}/${user?.data?.user?.id}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    staleTime: 5 * 60 * 1000,
    enabled: user?.data?.user?.id ? true : false,
  });

  const menuUserIcon = [
    ...(isAuth()
      ? [
          {
            component: <UserBalanceHolder data={data} removeStyle />,
            onClick: () => {
              router.push(isMobile ? "/userProfile" : "/userProfile/editInfo");
              handleClose();
            },
          },
          ...[
            {
              src: "/icons/address-yellow.svg",
              name: t.addresses,
              num: 0,
              onClick: () => {
                router.push("/userProfile/myAddresses");
                handleClose();
              },
            },
            {
              src: "/icons/orders-yellow.svg",
              name: t.myOrders,
              num: 0,
              onClick: () => {
                router.push("/userProfile/myOrders");
                handleClose();
              },
            },
            {
              src: "/icons/car-yellow.svg",
              name: t.Cars,
              num: 0,
              onClick: () => {
                router.push("/userProfile/myCars");
                handleClose();
              },
            },
            {
              src: "/icons/wallet-yellow.svg",
              name: t.myCards,
              num: 0,
            },
          ],
          //   {
          //     name: t.profile,
          //     onClick: () => {
          //       router.push("/userProfile");
          //       handleClose();
          //     },
          //   },
        ]
      : []),
    {
      component: isAuth() ? (
        <div className={`${style["logout-btn"]}`}>{t.logout}</div>
      ) : (
        <div className="mx-2">{t.login}</div>
      ),
      onClick: () => {
        router.push("/userProfile/editInfo");
        handleClose();
      },
      onClick: () => {
        if (isAuth()) {
          router.push("/");
          setTimeout(() => {
            dispatch(logout());
          }, 500);
          handleClose();
        } else {
          handleClose();
          setOpenLogin(true);
        }
      },
    },
  ];

  const returnNavbarBg = () => {
    const sparePartColor = allGroups[0]?.sections?.find(
      (sec) => sec?.type === SPAREPARTS
    )?.background_color;
    const marketPlaceColor = allGroups[0]?.sections?.find(
      (sec) => sec?.type === MARKETPLACE
    )?.background_color;
    const sectionBgColor =
      allGroups[1]?.sections?.find(
        (sec) => sec?.title === router?.query?.secTitle
      )?.background_color || "#DDECFF";

    if (router?.pathname?.includes("/spareParts") || router?.pathname === "/") {
      return router?.pathname?.includes("/spareParts")
        ? sparePartColor || "#FFF5EF"
        : marketPlaceColor || "#FFF5EF";
    } else {
      return hideComponent ? "#F6F6F6" : sectionBgColor;
    }
  };

  const handleAppSectionRedirection = (section) => {
    if (section?.type === SPAREPARTS || section?.type === MARKETPLACE) {
      router.push(section?.type === MARKETPLACE ? "/" : "/spareParts");
    } else {
      router.push(
        `/sections?secTitle=${section?.title}&&secType=${section?.type}`
      );
    }
  };
  return !mobileScreen ? (
    <Box
      className={`${style["navbar"]}`}
      sx={{
        background: returnNavbarBg(),
        padding: isMobile
          ? "10px 20px 0px 20px"
          : hideComponent
          ? "24px 62px 0px 62px"
          : "10px 62px 0px 62px",
      }}
    >
      <Box className={`${style["navbar-container"]}`}>
        <Box sx={firstPartStyle}>
          {!hideComponent && <DropDownAddress />}
          <Image
            alt="logo"
            width={isMobile ? 80 : 130}
            height={isMobile ? 25 : 49}
            src="/logo/atlobha-ar-en.svg"
            onClick={() => router.push("/")}
            className="cursor-pointer"
            style={{
              transition: "opacity 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          />

          {!isMobile && hideInSpareOrSectionsPage && <CarPalette />}
          {!hideComponent && (
            <>
              <AdvertiseHint />
              <HeaderPage />
            </>
          )}
          {isMobile && hideInSpareOrSectionsPage && <CarPalette />}
        </Box>
        <Box sx={secondPartStyle}>
          <LanguageSwitcher />

          {!isMobile && (
            <>
              <IconInsideCircle
                hasText={false}
                onClick={() => setOpenCategories(true)}
              />
              {/* <IconInsideCircle
			  hasText={false}
			  iconUrl="/icons/search-black.svg"
			/>
			<IconInsideCircle
			  hasText={false}
			  iconUrl="/icons/basket-black.svg"
			/> */}
            </>
          )}
          {/* <SharedBtn
		  text="atlobhaPlus"
		  customClass={`${isMobile ? style["mobile-btn"] : ""}`}
		/> */}

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
                  ...(locale !== "ar"
                    ? {
                        right: isMobile ? "5vw !important" : "2vw !important",
                        left: "unset !important",
                        minWidth: isMobile ? "80px" : "120px",
                      }
                    : { left: "0vw !important" }),
                  width: "fit-content",
                  padding: isAuth() ? "20px" : "5px",
                  minWidth: isAuth() ? "23vw" : "10vw",
                },
              }}
            >
              {menuUserIcon?.map((singleData) => (
                <MenuItem
                  sx={{
                    color: "#232323",
                    fontWeight: "500",
                    padding: "0px",
                    mb: 1,
                    fontSize: isMobile ? "11px" : "15px",
                    minHeight: isMobile ? "30px !important" : "48px !important",
                  }}
                  onClick={singleData?.onClick}
                >
                  {singleData?.src && (
                    <Image
                      style={{
                        margin: "0px 10px",
                      }}
                      src={singleData?.src}
                      alt="icon"
                      width={isMobile ? 20 : 30}
                      height={isMobile ? 20 : 30}
                    />
                  )}
                  {singleData?.component || (
                    <BlurText
                      text={singleData?.name}
                      delay={3}
                      animateBy="words"
                      direction="bottom"
                      onAnimationComplete={() => {}}
                      className=""
                    />
                  )}
                </MenuItem>
              ))}
            </Menu>
          </div>
        </Box>
      </Box>
      {!isMobile && !hideInSpareOrSectionsPage && !hideComponent && (
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
      {true && (
        <Box
          className={`${style["sections"]}`}
          sx={{
            padding:
              isMobile && !hideComponent
                ? "0px 5px"
                : hideComponent
                ? "0px"
                : "0px 25px",
          }}
        >
          <SectionsNav
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            handleClick={(section) => handleAppSectionRedirection(section)}
          />
        </Box>
      )}
      <Login showBtn={!showBtn} open={openLogin} setOpen={setOpenLogin} />
    </Box>
  ) : null;
}

export default Navbar;
