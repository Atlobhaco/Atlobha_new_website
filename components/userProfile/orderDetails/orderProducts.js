import SharedBtn from "@/components/shared/SharedBtn";
import SparePartItem from "@/components/spareParts/AddSparePart/SparePartItem";
import useLocalization from "@/config/hooks/useLocalization";
import { Box, CircularProgress, Dialog } from "@mui/material";
import React, { useState } from "react";
import style from "../../../pages/spareParts/confirmation/confirmation.module.scss";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import Image from "next/image";
import { ORDERSENUM, STATUS } from "@/constants/enums";
import {
  addOrUpdateSparePart,
  clearSpareParts,
} from "@/redux/reducers/addSparePartsReducer";
import { useDispatch, useSelector } from "react-redux";
import useCustomQuery from "@/config/network/Apiconfig";
import { ORDERS, PARTS, SPARE_PARTS } from "@/config/endPoints/endPoints";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { riyalImgBlack } from "@/constants/helpers";

function OrderProducts({
  orderDetails = {},
  callSingleOrder = () => {},
  orderDetailsFetching = false,
}) {
  const router = useRouter();
  const { idOrder, type } = router.query;
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();
  const [editMode, setEditMode] = useState(false);
  const dispatch = useDispatch();
  const { selectedParts } = useSelector((state) => state.addSpareParts);
  const [largeImage, setLargeImage] = useState(false);

  const imgHolderStyle = {
    borderRadius: isMobile ? "8px" : "20px",
    overflow: "hidden",
    width: isMobile ? "50px" : "62px",
    height: isMobile ? "50px" : "62px",
    background: "#E6E6E6",
    display: "flex",
    cursor: "pointer",
  };

  const renderUrlDependOnType = () => {
    switch (type) {
      case ORDERSENUM?.marketplace:
        return `/marketplace${ORDERS}/${idOrder}`;
      case ORDERSENUM?.spareParts:
        return `${SPARE_PARTS}${ORDERS}/${idOrder}${PARTS}`;
      default:
        return type;
    }
  };

  const {
    data,
    isFetching,
    refetch: callChangeParts,
  } = useCustomQuery({
    name: "changePartsOrder",
    url: renderUrlDependOnType(),
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    enabled: false,
    method: "put",
    body: {
      parts: selectedParts,
    },
    onSuccess: (res) => {
      callSingleOrder();
      setEditMode(!editMode);
    },
    onError: (err) => {
      toast.error(err?.response?.data?.first_error || t.someThingWrong);
    },
  });

  return (
    <Box
      sx={{
        background: editMode ? "#FEFCED" : " inherit",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px 0px",
          mt: 2,
        }}
      >
        <Box
          sx={{
            fontSize: isMobile ? "16px" : "18px",
            fontWeight: 700,
          }}
        >
          {t.selectedProducts} ({orderDetails?.parts?.length})
        </Box>

        {(orderDetails?.status === STATUS?.new ||
          orderDetails?.status === STATUS?.incomplete ||
          orderDetails?.status === STATUS?.priced) &&
          (!editMode ? (
            <SharedBtn
              compBeforeText={
                (isFetching || orderDetailsFetching) && (
                  <CircularProgress color="inherit" size={15} />
                )
              }
              id="editOrderProd"
              className="outline-btn"
              text="common.edit"
              customStyle={{
                padding: isMobile ? "6px  20px" : "8px 25px",
                fontSize: "10px",
                height: "unset",
              }}
              onClick={() => {
                dispatch(clearSpareParts());
                setEditMode(!editMode);
                dispatch(
                  addOrUpdateSparePart(
                    ...orderDetails?.parts?.map((d) => ({
                      ...d,
                      insideOrder: true,
                    }))
                  )
                );
              }}
              disabled={isFetching}
            />
          ) : (
            <Box className="d-flex gap-2">
              <SharedBtn
                compBeforeText={
                  isFetching && <CircularProgress color="inherit" size={10} />
                }
                id="saveProducts"
                className="green-hover"
                text="common.save"
                customStyle={{
                  padding: isMobile ? "6px  20px" : "8px 25px",
                  fontSize: "10px",
                  height: "unset",
                  background: "#1FB256",
                  color: "#fff",
                }}
                onClick={() => callChangeParts()}
                disabled={isFetching}
              />
              <SharedBtn
                id="cancelEdit"
                className="green-hover"
                text="common.cancel"
                customStyle={{
                  padding: isMobile ? "6px  20px" : "8px 25px",
                  fontSize: "10px",
                  height: "unset",
                  background: "white",
                  color: "#DC2626",
                  borderColor: "#DC2626",
                }}
                onClick={() => {
                  setEditMode(!editMode);
                  dispatch(clearSpareParts());
                }}
                disabled={isFetching}
              />
            </Box>
          ))}
      </Box>

      <Box>
        {editMode
          ? selectedParts?.map((data) => (
              <SparePartItem data={data} insideOrder={true} />
            ))
          : orderDetails?.parts?.map((part) => (
              <div
                className={`${style["details-parts"]} justify-content-between`}
                key={part?.id}
              >
                <div className="d-flex gap-2">
                  <Box
                    sx={imgHolderStyle}
                    className={`${style["details-parts_imgHolder"]}`}
                  >
                    <Image
                      src={part?.image || "/imgs/no-img-holder.svg"}
                      width={isMobile ? 50 : 61}
                      height={isMobile ? 50 : 61}
                      alt="spare-part"
                      onClick={() =>
                        setLargeImage(part?.image ? part?.image : false)
                      } // Open modal on click
                    />
                  </Box>
                  <div
                    className={`${style["details-parts_details"]} justify-content-end`}
                  >
                    <div className={`${style["details-parts_details-name"]}`}>
                      {part?.name}
                    </div>
                    <div
                      className={`${style["details-parts_details-second-qty"]}`}
                    >
                      {part?.quantity} {t.piece}{" "}
                    </div>
                  </div>
                </div>
                {orderDetails?.status !== STATUS?.new ? (
                  <div
                    style={{
                      color: "#EE772F",
                      fontWeight: "500",
                      fontSize: isMobile ? "14px" : "16px",
                    }}
                  >
                    {part?.total_price} {riyalImgBlack()}
                  </div>
                ) : null}
              </div>
            ))}
      </Box>
      <Dialog
        maxWidth="lg"
        open={largeImage ? true : false}
        onClose={() => setLargeImage(false)}
        sx={{
          minWidth: "100% !important",
        }}
      >
        <Image
          src={largeImage}
          width={500}
          height={500}
          alt="spare-part-large"
          style={{
            width: "auto",
            height: "auto",
          }} // Responsive sizing
        />
      </Dialog>
    </Box>
  );
}

export default OrderProducts;
