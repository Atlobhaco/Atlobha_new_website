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
import ContentForBasket from "./ContentForBasketPopup";
import AutoCompleteInput from "@/components/AutoCompleteInput";
import Link from "next/link";
import { setUserData } from "@/redux/reducers/quickSectionsProfile";

const firstPartStyle = {
  display: "flex",
  flexDirection: "column",
  width: "60%",
  gap: "10px",
  width: "fit-content",
};

function Navbar({ setOpenCategories, hideNavbarInUrls }) {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const { setOpenLogin, showBtn, openLogin } = LoginModalActions();
  const { basket } = useSelector((state) => state.basket);

  const router = useRouter();
  const { mobileScreen } = router.query;
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();

  //   appear at service section page with no checkout
  const appearAt =
    router?.pathname?.includes("spare") ||
    router?.pathname?.includes("sections") ||
    (router?.pathname?.includes("service") &&
      !router?.pathname?.includes("checkout")) ||
    router?.pathname === "/";

  const hideComponent = hideNavbarInUrls.some((url) =>
    router?.pathname?.includes(url)
  );

  const hiddenUrlsFound = ["checkout"].some((url) =>
    router?.pathname?.includes(url)
  );

  const hideAddress = ["category", "search", "products"].some((url) =>
    router?.pathname?.includes(url)
  );

  const routeForBasketChekout =
    router?.pathname?.includes("basket") ||
    router?.pathname?.includes("checkout");

  const { allGroups } = useSelector((state) => state.appGroups);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorElBasket, setAnchorElBasket] = React.useState(null);
  const [selectedSection, setSelectedSection] = useState(false);

  const secondPartStyle = {
    display: "flex",
    gap: isMobile && isAuth() ? "0px" : "10px",
    height: "fit-content",
  };

  const { data, refetch: callUserDetails } = useCustomQuery({
    name: "userInfoForNavbar",
    url: `${USERS}/${user?.data?.user?.id}`,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    staleTime: 5 * 60 * 1000,
    enabled: user?.data?.user?.id ? true : false,
    onSuccess: (res) => {
      dispatch(
        setUserData({
          data: res,
        })
      );
    },
  });

  const handleMenu = (event) => {
    if (isAuth()) {
      callUserDetails();
    }
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuBasket = (event) => {
    setAnchorElBasket(event.currentTarget);
  };
  const handleCloseBasket = () => {
    setAnchorElBasket(null);
  };

  const menuUserIcon = [
    ...(isAuth()
      ? [
          {
            component: <UserBalanceHolder data={data} removeStyle />,
            onClick: () => {
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
        <Box
          sx={{
            mx: 2,
            fontSize: "18px",
          }}
        >
          {t.login}
        </Box>
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
        (sec) =>
          sec?.type?.toLowerCase() === router?.query?.secTitle ||
          sec?.type?.toLowerCase() === router?.query?.secType?.toLowerCase()
      )?.background_color || marketPlaceColor;
    //   marketPlaceColor default bg color for any page no section
    //   the correct one to detect the old path not marketPlaceColor
    if (
      (router?.pathname?.includes("/spareParts") && !router?.query?.secType) ||
      router?.pathname === "/"
    ) {
      return router?.pathname?.includes("/spareParts") &&
        !router?.query?.secType
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
        `/sections?secTitle=${section?.title}&secType=${section?.type}`
      );
    }
  };
  return !mobileScreen ? (
    <Box
      id="navbar"
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
        <div style={firstPartStyle}>
          {!hideComponent && !hiddenUrlsFound && !hideAddress && (
            <DropDownAddress />
          )}
          <Image
            loading="lazy"
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

          {!isMobile && appearAt && <CarPalette />}
          {!hideComponent && (
            <>
              <AdvertiseHint />
              <HeaderPage />
            </>
          )}
          {isMobile && appearAt && (
            <Box sx={{ mb: 1 }}>
              <CarPalette />
            </Box>
          )}
        </div>
        <div style={secondPartStyle}>
          <LanguageSwitcher />

          {isMobile ? (
            <Link href="https://wa.me/966502670094" target="_blank">
              <Image
                alt="whatsapp"
                src="/icons/social/whats.svg"
                width={25}
                height={25}
                className="cursor-pointer"
                loading="lazy"
                style={{
                  marginInlineStart: "4px",
                }}
              />
            </Link>
          ) : (
            <>
              <IconInsideCircle
                hasText={false}
                onClick={() => setOpenCategories(true)}
              />
              <div>
                {/* user profile icon in or no auth */}
                {(!isMobile || !isAuth()) && (
                  <IconButton
                    aria-label="abasket of user"
                    aria-controls="basket-popup"
                    aria-haspopup="true"
                    onClick={handleMenuBasket}
                    color="inherit"
                    sx={{ margin: 0, padding: 0 }}
                  >
                    <IconInsideCircle
                      hasText={false}
                      iconUrl="/icons/basket-black.svg"
                      hasNum={basket?.length}
                    />
                  </IconButton>
                )}
                <Menu
                  id="basket-popup"
                  anchorEl={anchorElBasket}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElBasket)}
                  onClose={handleCloseBasket}
                  PaperProps={{
                    sx: {
                      ml: 3,
                      ...(locale !== "ar"
                        ? {
                            right: isMobile
                              ? "8vw !important"
                              : "6vw !important",
                            left: "unset !important",
                            minWidth: isMobile ? "80px" : "120px",
                          }
                        : { left: "6vw !important" }),
                      width: "fit-content",
                      padding: isAuth() ? "20px" : "20px",
                      minWidth: isAuth() ? "25vw" : "25vw",
                      borderRadius: "20px  !important",
                      maxHeight: "calc(100% - 0px)",
                    },
                  }}
                >
                  <ContentForBasket handleCloseBasket={handleCloseBasket} />
                </Menu>
              </div>
            </>
          )}
          {/* <SharedBtn
		  text="atlobhaPlus"
		  customClass={`${isMobile ? style["mobile-btn"] : ""}`}
		/> */}

          <div>
            {/* user profile icon in or no auth */}
            {!isMobile && (
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
            )}
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
                      loading="lazy"
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
        </div>
      </Box>
      {/* search logic */}
      {((!routeForBasketChekout && !hideComponent && !isMobile) ||
        (isMobile && router?.pathname?.includes("search"))) && (
        <Box className={`${style["searching"]}`}>
          {!isMobile && (
            <>
              <Box className={`${style["searching-header"]}`}>
                {t.lookForParts} !
              </Box>
              <Box className={`${style["searching-sub"]}`}>
                {t.searchAboutCars}
              </Box>
            </>
          )}
          <Box className={`${style["searching-parent"]}`}>
            <Box
              className={`${style["searching-parent_holder"]} ${
                isMobile && "w-100 mb-3"
              }`}
            >
              <AutoCompleteInput />
              {/* <SharedBtn className="search-btn" text={"search"} /> */}
            </Box>
          </Box>
        </Box>
      )}
      <Box
        className={`${style["sections"]}`}
        sx={{
          padding: hiddenUrlsFound
            ? "0px"
            : isMobile && !hideComponent
            ? "0px 5px"
            : hideComponent
            ? "0px"
            : "0px 25px",
        }}
      >
        {!hiddenUrlsFound && !router?.pathname?.includes("search") && (
          <SectionsNav
            selectedSection={selectedSection}
            setSelectedSection={setSelectedSection}
            handleClick={(section) => handleAppSectionRedirection(section)}
          />
        )}
      </Box>
      <Login
        showBtn={!showBtn}
        open={openLogin}
        setOpen={setOpenLogin}
        id="firstLogin"
        customIDOtpField="firstOtpField"
        customIDLogin="firstBtnLogin"
      />
    </Box>
  ) : null;
}

export default Navbar;
