import React, { useState } from "react";
import dynamic from "next/dynamic";

const UserProfile = dynamic(() => import(".."), {
  ssr: false, // disable SSR if the component uses browser APIs (window, document, etc.)
  loading: () => <p>...</p>, // optional fallback UI
});
import useScreenSize from "@/constants/screenSize/useScreenSize";
import BreadCrumb from "@/components/BreadCrumb";
import { useSelector } from "react-redux";
import useLocalization from "@/config/hooks/useLocalization";
import {
  Box,
  CircularProgress,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import { riyalImgOrange } from "@/constants/helpers";
import SharedBtn from "@/components/shared/SharedBtn";
import style from "./walletTransactions.module.scss";
import useCustomQuery from "@/config/network/Apiconfig";
import { WALLET_TRANSACTIONS } from "@/config/endPoints/endPoints";
import { toast } from "react-toastify";
import NotransactionsHappen from "./NotransactionsHappen";
import ShowTransactions from "./ShowTransactions";
import AddBalanceVoucher from "./AddBalanceVoucher";

function WalletTransactions() {
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const { userDataProfile } = useSelector((state) => state.quickSection);
  const [filterBy, setFilterBy] = useState("");
  const [page, setPage] = useState(1);
  const [openVoucher, setOpenAddVoucher] = useState(false);

  const {
    data: transactions,
    refetch: refetchTransactions,
    isFetching,
  } = useCustomQuery({
    name: ["walletTransactions", filterBy, page],
    url: `${WALLET_TRANSACTIONS}${
      filterBy?.length ? `?type=${filterBy}&page=${page}` : `?page=${page}`
    }`,
    refetchOnWindowFocus: false,
    enabled: true,
    select: (res) => res?.data,
    onSuccess: (res) => {
      const element = document.getElementById("trans_data");
      if (element) {
        const y = element.getBoundingClientRect().top + window.pageYOffset - 80;
        const currentY = window.scrollY || window.pageYOffset;
        // scroll only if currently below the section
        if (currentY > y + 100) {
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    },
    onError: () => {
      toast.error(t.someThingWrong);
    },
  });

  const handleChangeFilter = (value) => {
    setPage(1);
    setFilterBy(value);
  };
  const handleOpenAddVoucher = () => setOpenAddVoucher(true);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {!isMobile && (
          <div className="col-md-4">
            <UserProfile />
          </div>
        )}
        <div className="col-md-8 col-12 pt-4">
          <div className="row mb-2">
            <BreadCrumb />
          </div>
          <div
            className="row mb-3 mt-3"
            style={{
              backgroundImage: isMobile ? "url('/imgs/bg-balance.png')" : false,
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          >
            <div className="col-12">
              <div
                className={`${
                  isMobile ? "d-block" : "d-flex"
                } justify-content-between gap-5 mb-2`}
              >
                <div className={`${isMobile ? "w-100" : "w-50"}`}>
                  <Box className="d-flex justify-content-between align-items-center">
                    <Box>
                      <>
                        <Box
                          onClick={handleOpen}
                          sx={{
                            color: "#374151",
                            fontWeight: 700,
                            fontSize: isMobile ? "16px" : "18px",
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                        >
                          {t.availableBalance}
                          <Box
                            component="span"
                            sx={{
                              fontSize: "18px",
                              transform: anchorEl
                                ? "rotateX(180deg)"
                                : "rotateX(0deg)",
                            }}
                          >
                            ▼
                          </Box>
                        </Box>

                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleClose}
                          anchorOrigin={{
                            vertical: "bottom", // "top", "center", or "bottom"
                            horizontal: locale === "ar" ? "left" : "right", // "left", "center", or "right"
                          }}
                          transformOrigin={{
                            vertical: "top", // where the menu attaches from
                            horizontal: "center",
                          }}
                          PaperProps={{
                            sx: {
                              borderRadius: "10px",
                              width: isMobile ? "100%" : 350,
                              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                              left: "10px",
                            },
                          }}
                        >
                          <Box
                            onClick={handleClose}
                            sx={{
                              p: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                              }}
                            >
                              <Box>{t.cashbackBalance}</Box>
                              <Box
                                sx={{
                                  color: "#EE772F",
                                }}
                              >
                                {userDataProfile?.cashback_balance}{" "}
                                {riyalImgOrange()}
                              </Box>
                            </Box>
                          </Box>
                          <Box
                            onClick={handleClose}
                            sx={{
                              p: 1,
                            }}
                          >
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                width: "100%",
                              }}
                            >
                              <Box>{t.walletBalance}</Box>
                              <Box
                                sx={{
                                  color: "#EE772F",
                                }}
                              >
                                {userDataProfile?.wallet_balance}{" "}
                                {riyalImgOrange()}
                              </Box>{" "}
                            </Box>{" "}
                          </Box>
                        </Menu>
                      </>
                      <Box
                        sx={{
                          fontSize: isMobile ? "29px" : "36px",
                          fontWeight: "500",
                          color: "#EE772F",
                        }}
                      >
                        {userDataProfile?.cashback_and_wallet_balance} {riyalImgOrange()}
                      </Box>{" "}
                    </Box>
                    {isMobile && (
                      <div>
                        <SharedBtn
                          onClick={() => handleOpenAddVoucher()}
                          text="addBalance"
                          className="big-main-btn"
                        />
                      </div>
                    )}
                  </Box>
                </div>
                <Box
                  sx={{
                    color: "#374151",
                    fontSize: isMobile ? "12px" : "15px",
                  }}
                >
                  {t.walletInfo}{" "}
                </Box>
              </div>
              <div
                className={`${
                  isMobile ? "d-block" : "d-flex"
                } justify-content-between gap-5 mb-2`}
              >
                <div className={`${style["filter"]}`}>
                  <Typography
                    className={filterBy === "" && style.selected}
                    onClick={() => handleChangeFilter("")}
                  >
                    {t.showAll}
                  </Typography>
                  <Typography
                    onClick={() => handleChangeFilter("addition")}
                    className={filterBy === "addition" && style.selected}
                  >
                    {t.received}
                  </Typography>
                  <Typography
                    onClick={() => handleChangeFilter("deduction")}
                    className={filterBy === "deduction" && style.selected}
                  >
                    {t.spent}
                  </Typography>
                </div>
                {!isMobile && (
                  <div>
                    <SharedBtn
                      onClick={() => handleOpenAddVoucher()}
                      text="addBalance"
                      className="big-main-btn"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className={`row mb-3`} id="trans_data">
            {isFetching ? (
              <Box className="mt-2 text-center">
                <CircularProgress
                  sx={{
                    color: "#FFD400",
                  }}
                  size={30}
                />
              </Box>
            ) : transactions?.data?.length ? (
              <ShowTransactions
                transactions={transactions}
                setPage={setPage}
                isFetching={isFetching}
              />
            ) : (
              <NotransactionsHappen
                handleOpenAddVoucher={handleOpenAddVoucher}
              />
            )}
          </div>
        </div>
      </div>
      <AddBalanceVoucher
        open={openVoucher}
        setOpen={setOpenAddVoucher}
        refetchTransactions={refetchTransactions}
        setPage={setPage}
      />
    </div>
  );
}

export default WalletTransactions;
