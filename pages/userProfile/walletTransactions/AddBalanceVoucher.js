import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import DialogCentered from "@/components/DialogCentered";
import VoucherCode from "@/components/spareParts/VoucherCode";
import SharedBtn from "@/components/shared/SharedBtn";
import { useQueryClient } from "react-query";
import {
  setVoucher,
  setVoucherAllData,
} from "@/redux/reducers/addSparePartsReducer";
import { useDispatch } from "react-redux";

function AddBalanceVoucher({ open, setOpen, refetchTransactions, setPage }) {
  const dispatch = useDispatch();
  const { t } = useLocalization();
  const queryClient = useQueryClient();
  const { isMobile } = useScreenSize();
  const [canAddVoucher, setCanAddVoucher] = useState(false);
  const [inputValVoucher, setInputValVoucher] = useState(false);

  const resetDataToDefault = () => {
    setCanAddVoucher(false);
    setOpen(false);
    dispatch(setVoucher({ data: null }));
    dispatch(
      setVoucherAllData({
        data: null,
      })
    );
    setInputValVoucher(false);
  };

  useEffect(() => {
    if (canAddVoucher?.amount) {
      refetchTransactions();
      //   recall for user profile and info from navbar
      queryClient.refetchQueries("userInfoForNavbar");
      queryClient.refetchQueries({
        queryKey: ["getProfileInfo"],
        exact: false,
      });
      dispatch(setVoucher({ data: null }));
      dispatch(
        setVoucherAllData({
          data: null,
        })
      );
      resetDataToDefault();
    }
  }, [canAddVoucher]);

  return (
    <DialogCentered
      hasCloseIcon={true}
      open={open}
      setOpen={() => {
        setOpen(false);
        resetDataToDefault();
      }}
      subtitle={false}
      title={t.addBalanceToWallet}
      actionsWhenClose={() => resetDataToDefault()}
      content={
        <>
          <Box
            sx={{
              textAlign: isMobile ? "start" : "center",
              fontSize: isMobile ? "15px" : "20px",
              fontWeight: "400",
              color: "#0F172A",
              mt: isMobile ? 2 : 4,
              mb: 1,
              mx: isMobile ? 0 : 2,
            }}
          >
            {t.availablePurchase}
            <br />
            {t.justUseVoucher}
          </Box>
          <Box>
            <VoucherCode
              setCanAddVoucher={setCanAddVoucher}
              canAddVoucher={canAddVoucher}
              setInputValVoucher={setInputValVoucher}
              inputValVoucher={inputValVoucher}
              dialogOpen={open}
            />
            {/* <Box className="d-flex justify-content-center">
              <SharedBtn
                onClick={() => resetDataToDefault()}
                text="okFine"
                className="big-main-btn"
                customClass={`${isMobile ? "w-100 mt-2" : "w-75 mt-3"}`}
              />
            </Box> */}
          </Box>
        </>
      }
    />
  );
}

export default AddBalanceVoucher;
