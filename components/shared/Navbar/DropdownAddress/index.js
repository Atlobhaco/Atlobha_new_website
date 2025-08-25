import React, { useEffect, useRef, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"; // Import an icon or use your custom SVG
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useSelector } from "react-redux";
import { Box } from "@mui/system";
import Login from "@/components/Login";
import LoginModalActions from "@/constants/LoginModalActions/LoginModalActions";
import DialogCentered from "@/components/DialogCentered";
import SharedBtn from "../../SharedBtn";
import Image from "next/image";
import { isAuth } from "@/config/hooks/isAuth";
import AddressSelectionFromNavbarWeb from "./AddressSelectionFromNavbarWeb";
import AddNewAddressFromNavbar from "./AddNewAddressFromNavbar";
import ShowAddressesFromNavbarMobile from "./ShowAddressesFromNavbarMobile";
import { getAddressFromLatLng } from "@/constants/helpers";
import { useRouter } from "next/router";

function DropDownAddress() {
  const childRef = useRef(null);
  const router = useRouter();
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const { selectedAddress, defaultAddress } = useSelector(
    (state) => state.selectedAddress
  );
  const [addressModalKey, setAddressModalKey] = useState(Date.now());
  const [anchorEl, setAnchorEl] = useState(null);
  const [openAddNewAddress, setOpenAddNewAddress] = useState(false);

  const { setOpenLogin, showBtn, openLogin } = LoginModalActions();
  const [selectCarPopUpMobile, setSelectCarPopUpModal] = useState(false);
  const open = Boolean(anchorEl);
  const [canAddAddress, setCanAddAddress] = useState(false);
  const [addressObj, setAddressObj] = useState(false);

  const handleOpenProgrmatically = (event) => {
    if (!event.isTrusted) {
      setAddressModalKey(Date.now());
      //   setSelectCarPopUpModal(true);
      return setOpenAddNewAddress(true);
    }
  };

  const handleOpen = (event) => {
    console.log("event.isTrusted", event.isTrusted);
    if (!isAuth()) {
      setOpenLogin(true);
    } else {
      // open it in middle of screen when clicked programatically
      if (
        isMobile ||
        (router?.pathname?.includes(SERVICES) && !event.isTrusted)
      ) {
        setSelectCarPopUpModal(true);
        event.preventDefault(); // Prevents the default action (e.g., navigation for links)
        event.stopPropagation();
      } else {
        setAnchorEl(event.currentTarget); // Set the anchor element for the dropdown
        event.preventDefault(); // Prevents the default action (e.g., navigation for links)
        event.stopPropagation();
      }
    }
  };

  const handleClose = () => {
    setAnchorEl(null); // Close the dropdown
  };

  //   to can add address from the pop up modal
  const handleClick = () => {
    if (childRef.current) {
      childRef.current.triggerChildFunction();
    }
  };
  const fetchCity = async (lat, lng) => {
    const { city, area } = await getAddressFromLatLng(lat, lng, locale);
    setAddressObj({
      area: area,
      city: city,
    });
    // return city;
  };

  useEffect(() => {
    if (selectedAddress?.id) {
      fetchCity(selectedAddress?.lat, selectedAddress?.lng);
      return;
    }
    if (defaultAddress?.id) {
      fetchCity(defaultAddress?.lat, defaultAddress?.lng);
      return;
    }
  }, [selectedAddress?.id, defaultAddress?.id]);

  return (
    <Box
      id="openAddAddressModalProgramatically"
      onClick={handleOpenProgrmatically}
    >
      {selectedAddress?.id || defaultAddress?.id ? (
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              color: "#6B7280",
              fontSize: "16px",
              fontWeight: "400",
              width: "fit-content",
              cursor: "pointer",
              maxWidth: isMobile ? "40vw" : "30vw",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            onClick={handleOpen}
            id="openAfterAddNewAddress"
          >
            {`${addressObj?.city || t.noAddressSelected}, ${
              addressObj?.area || ""
            }`}
            {/* {selectedAddress?.city
              ? fetchCity(selectedAddress?.lat, selectedAddress?.lng)
              : defaultAddress?.city
              ? fetchCity(defaultAddress?.lat, defaultAddress?.lng)
              : t.noAddressSelected}{" "} */}
          </Box>

          <KeyboardArrowDownIcon
            onClick={handleOpen}
            style={{
              color: "#6B7280",
              left: locale === "ar" ? "7px" : "unset",
              right: locale !== "ar" ? "7px" : "unset",
            }}
          />
        </Box>
      ) : (
        <Box
          sx={{
            color: "#6B7280",
            fontSize: "16px",
            fontWeight: "400",
            width: "fit-content",
            cursor: "pointer",
          }}
          onClick={handleOpen}
        >
          {t.noAddressSelected}{" "}
          <KeyboardArrowDownIcon
            style={{
              color: "#6B7280",
              left: locale === "ar" ? "7px" : "unset",
              right: locale !== "ar" ? "7px" : "unset",
            }}
          />{" "}
        </Box>
      )}

      <AddressSelectionFromNavbarWeb
        open={open}
        anchorEl={anchorEl}
        handleClose={handleClose}
        setOpenAddNewAddress={setOpenAddNewAddress}
      />

      {/* poup address selection for mobile that list all addresses */}
      <DialogCentered
        title={false}
        subtitle={false}
        open={selectCarPopUpMobile}
        setOpen={setSelectCarPopUpModal}
        hasCloseIcon
        content={
          (
            <ShowAddressesFromNavbarMobile
              setSelectCarPopUpModal={setSelectCarPopUpModal}
            />
          ) || <></>
        }
        renderCustomBtns={
          <Box sx={{ mt: 1, width: "100%" }}>
            <SharedBtn
              onClick={() => {
                handleClose();
                setOpenAddNewAddress(true);
                setSelectCarPopUpModal(false);
              }}
              className="btn-outline-green"
              customClass="w-100"
              text="addNewAddress"
              compBeforeText={
                <Image
                  loading="lazy"
                  alt="location"
                  width={20}
                  height={20}
                  src="/icons/location-green.svg"
                  style={{
                    marginBottom: "4px",
                  }}
                />
              }
            />
          </Box>
        }
      />

      {/* key={addressModalKey} */}
      {/* this key was make multiple render in mobile screen */}
      {/* add new address from navbar popup data inputs */}
      <DialogCentered
        title={t.addNewAddress}
        subtitle={false}
        open={openAddNewAddress}
        setOpen={setOpenAddNewAddress}
        hasCloseIcon
        content={
          <AddNewAddressFromNavbar
            // key={addressModalKey}
            ref={childRef}
            setCanAddAddress={setCanAddAddress}
            setOpenAddNewAddress={setOpenAddNewAddress}
          />
        }
        renderCustomBtns={
          <Box
            sx={{
              display: "flex",
              gap: "10px",
              borderTop: "1px solid rgba(24, 24, 27, 0.06)",
              width: "100%",
              justifyContent: "flex-end",
              pt: 3,
              pb: 1,
            }}
          >
            <SharedBtn
              type="submit"
              text="addAddress"
              className="big-main-btn"
              customClass={`${isMobile ? "w-100" : ""}`}
              //   disabled={canAddAddress}
              onClick={() => {
                handleClick();
              }}
            />

            {!isMobile && (
              <SharedBtn
                text="common.cancel"
                className="outline-btn"
                onClick={() => {
                  setOpenAddNewAddress(false);
                }}
              />
            )}
          </Box>
        }
      />

      <Login
        showBtn={!showBtn}
        open={openLogin}
        setOpen={setOpenLogin}
        id="thirdLogin"
        customIDOtpField="thirdOtpField"
        customIDLogin="thirdBtnLogin"
      />
    </Box>
  );
}

export default DropDownAddress;
