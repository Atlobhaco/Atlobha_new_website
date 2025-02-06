import React, { useRef, useState } from "react";
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

function DropDownAddress() {
  const childRef = useRef(null);
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

  const handleOpenProgrmatically = (event) => {
    if (!event.isTrusted) {
      setAddressModalKey(Date.now());
      return setOpenAddNewAddress(true);
    }
  };

  const handleOpen = (event) => {
    if (!isAuth()) {
      setOpenLogin(true);
    } else {
      if (isMobile) {
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
              maxWidth: "30vw",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            onClick={handleOpen}
            id="openAfterAddNewAddress"
          >
            {selectedAddress?.address ||
              defaultAddress?.address ||
              t.noAddressSelected}{" "}
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

      {/* add new address from navbar popup data inputs */}
      <DialogCentered
        title={t.addNewAddress}
        subtitle={false}
        open={openAddNewAddress}
        setOpen={setOpenAddNewAddress}
        hasCloseIcon
        content={
          <AddNewAddressFromNavbar
            key={addressModalKey}
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
              disabled={canAddAddress}
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

      <Login showBtn={!showBtn} open={openLogin} setOpen={setOpenLogin} />
    </Box>
  );
}

export default DropDownAddress;
