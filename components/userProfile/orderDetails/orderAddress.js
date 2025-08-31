import React, { useRef, useState } from "react";
import style from "../../../pages/spareParts/confirmation/confirmation.module.scss";
import useLocalization from "@/config/hooks/useLocalization";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import Image from "next/image";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box, CircularProgress, Typography } from "@mui/material";
import DialogCentered from "@/components/DialogCentered";
import { usersAddressesQuery } from "@/config/network/Shared/GetDataHelper";
import {
  setAllAddresses,
  setDefaultAddress,
} from "@/redux/reducers/selectedAddressReducer";
import { useAuth } from "@/config/providers/AuthProvider";
import { useDispatch, useSelector } from "react-redux";
import SharedCheckbox from "@/components/shared/SharedCheckbox";
import useCustomQuery from "@/config/network/Apiconfig";
import { ADDRESS, ORDERS, SPARE_PARTS } from "@/config/endPoints/endPoints";
import { ORDERSENUM, STATUS } from "@/constants/enums";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import AddNewAddressFromNavbar from "@/components/shared/Navbar/DropdownAddress/AddNewAddressFromNavbar";
import SharedBtn from "@/components/shared/SharedBtn";

const header = {
  fontSize: "20px",
  fontWeight: "500",
  color: "black",
  mb: 2,
};

function OrderAddress({
  orderDetails = {},
  callSingleOrder = () => {},
  handleChangeAddress = false,
  customtitle = false,
  customDialogTitle = false,
  hideArrow = false,
}) {
  const childRef = useRef(null);
  const router = useRouter();
  const { idOrder, type } = router.query;
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { allAddresses } = useSelector((state) => state.selectedAddress);

  const [openchangeAddress, setOpenChangeAddress] = useState(false);
  const [newAddressId, setNewAddressId] = useState(false);
  const [openAddNewAddress, setOpenAddNewAddress] = useState(false);

  usersAddressesQuery({
    setAllAddresses,
    user,
    dispatch,
    setDefaultAddress,
  });

  const renderUrlDependOnType = () => {
    switch (type) {
      case ORDERSENUM?.marketplace:
        return `/marketplace${ORDERS}/${idOrder}`;
      case ORDERSENUM?.spareParts:
        return `${SPARE_PARTS}${ORDERS}/${idOrder}${ADDRESS}`;
      default:
        return type;
    }
  };
  const { data, isFetching } = useCustomQuery({
    name: ["changeOrderAddress", newAddressId],
    url: renderUrlDependOnType(),
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    enabled: !!newAddressId,
    method: "patch",
    body: {
      address_id: newAddressId,
    },
    onSuccess: (res) => {
      setNewAddressId(false);
      setOpenChangeAddress(false);
      callSingleOrder();
    },
    onError: (err) => {
      toast.error(err?.response?.data?.first_error || t.someThingWrong);
    },
  });

  const handleCheckboxChange = (data) => {
    setNewAddressId(data?.id);
  };

  const handleChangeAddressCutom = (data) => {
    if (handleChangeAddress) {
      handleChangeAddress(data);
    }
    setOpenChangeAddress(false);
  };

  //   to can add address from the pop up modal
  const handleClick = () => {
    if (childRef.current) {
      childRef.current.triggerChildFunction();
    }
  };
  const handleClose = () => {
    if (childRef.current) {
      childRef.current.triggerEmptyFields();
    }
  };

  return (
    <div
      className={`${style["deliverySec"]} justify-content-between align-items-center mb-1 border-bottom-0`}
    >
      <div
        className="d-flex align-items-center"
        onClick={() => !hideArrow && setOpenChangeAddress(true)}
        style={{
          cursor: "pointer",
        }}
      >
        <div>
          <LocationOnOutlinedIcon
            sx={{
              width: "25px",
              height: "25px",
              color: "#FFD400",
              ...(locale === "ar" ? { ml: 1 } : { mr: 1 }),
            }}
          />
        </div>
        <div className={`${style["deliverySec_address"]}`}>
          <Box className={`${style["deliverySec_address-holder"]}`}>
            {customtitle || t.deliveryAddress}
          </Box>
          <div className={`${style["deliverySec_address-location"]}`}>
            {orderDetails?.address?.address || ""}{" "}
            {orderDetails?.address?.city?.name}
          </div>
        </div>
      </div>
      {(orderDetails?.status === STATUS?.new ||
        orderDetails?.status === STATUS?.priced) &&
        type !== ORDERSENUM?.marketplace && (
          <Box
            sx={{ p: isMobile ? 0 : 3, cursor: "pointer" }}
            onClick={() => !hideArrow && setOpenChangeAddress(true)}
          >
            {!hideArrow && (
              <Image
                loading="lazy"
                src="/icons/arrow-left-sm.svg"
                width={isMobile ? 9 : 20}
                height={15}
                alt="arrow"
                style={{
                  transform:
                    locale === "ar" ? "rotate(0deg)" : "rotate(180deg)",
                }}
              />
            )}
          </Box>
        )}
      {/* change the address for the order from here */}
      <DialogCentered
        title={customDialogTitle || t.changeAddress}
        subtitle={false}
        open={openchangeAddress}
        setOpen={setOpenChangeAddress}
        hasCloseIcon
        content={
          <Box
            sx={{
              maxHeight: "60vh",
            }}
          >
            {allAddresses.map((address) => (
              <Box
                key={address.id}
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  padding: "10px 0px",
                }}
              >
                {/* Checkbox */}
                <SharedCheckbox
                  selectedId={orderDetails?.address?.id}
                  handleCheckboxChange={
                    handleChangeAddressCutom || handleCheckboxChange
                  }
                  data={address}
                />

                {/* Address Icon */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "flex-start",
                    width: isMobile ? "30px" : "20px",
                    height: isMobile ? "30px" : "20px",
                  }}
                >
                  <Image
                    loading="lazy"
                    alt={address?.name}
                    src={"/icons/home-address.svg"}
                    width={isMobile ? 30 : 48}
                    height={isMobile ? 30 : 48}
                    style={{
                      width: "auto",
                      height: "auto",
                      maxHeight: "20px",
                      maxWidth: "20px",
                      marginTop: "1px",
                    }}
                  />
                </Box>

                {/* Address Details */}
                <Box
                  sx={{
                    flexGrow: 1,
                    textAlign: "right",
                    display: "flex",
                    gap: "15px",
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <Box
                    onClick={() => {
                      if (handleChangeAddress) {
                        handleChangeAddress(address);
                        setOpenChangeAddress(false);
                      } else {
                        handleCheckboxChange(address);
                      }
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: isMobile ? "12px" : "16px",
                        fontWeight: 500,
                        display: "flex",
                        gap: "10px",
                        alignItems: "center",
                      }}
                    >
                      {typeof translateAddressName === "function"
                        ? translateAddressName(address?.name, locale)
                        : address?.name}
                      {!!address?.is_default && (
                        <Box
                          sx={{
                            background: "#E9F4FC",
                            color: "#3D96F7",
                            padding: isMobile ? "2px 5px" : "2px 8px",
                            fontSize: isMobile ? "12px" : "16px",
                            fontWeight: "400",
                            borderRadius: "50px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          {t.default}
                        </Box>
                      )}
                      {isFetching && newAddressId === address?.id && (
                        <CircularProgress color="inherit" size={12} />
                      )}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: isMobile ? "12px" : "16px",
                        fontWeight: 400,
                        textAlign: "start",
                        color: "#6B7280",
                      }}
                    >
                      {address?.address}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>
        }
        renderCustomBtns={
          <Box
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SharedBtn
              customStyle={{
                width: isMobile ? "100%" : "30%",
              }}
              onClick={() => {
                setOpenAddNewAddress(true);
              }}
              className="btn-outline-green"
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

      {/* form to add new  address */}
      <DialogCentered
        title={t.addNewAddress}
        subtitle={false}
        open={openAddNewAddress}
        setOpen={setOpenAddNewAddress}
        hasCloseIcon
        actionsWhenClose={() => {
          handleClose();
        }}
        content={
          <AddNewAddressFromNavbar
            ref={childRef}
            setCanAddAddress={() => {}}
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
                  handleClose();
                }}
              />
            )}
          </Box>
        }
      />
    </div>
  );
}

export default OrderAddress;
