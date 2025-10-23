import { Box, Typography } from "@mui/material";
import React from "react";
import style from "./walletTransactions.module.scss";
import moment from "moment";
import useLocalization from "@/config/hooks/useLocalization";
import { riyalImgGreen, riyalImgRed } from "@/constants/helpers";
import Image from "next/image";
import PaginateComponent from "@/components/Pagination";

function ShowTransactions({ transactions, isFetching, setPage }) {
  const { t } = useLocalization();

  const renderOperationText = (operation, type) => {
    const commonRow = (left, right) => (
      <Box className="d-flex justify-content-between mb-1">
        <Box>{left}</Box>
        <Box>{right}</Box>
      </Box>
    );

    switch (operation) {
      case "refund":
        return commonRow(t.refundAmount, t.toWallet);
      case "withdrawal":
        return commonRow(t.spendInApp, t.fromWallet);
      case "voucher_expired":
      case "cashback-expired":
        return commonRow(t.blanaceExpired, t.fromWallet);
      case "add_cashback":
        return commonRow(t.cashBackAdded, t.toWallet);
      case "redeem":
        return commonRow(t.voucherAdded, t.toWallet);
      case "manual":
        return commonRow(
          type === "addition" ? t.BalanceAddCustomer : t.BalanceDeductCustomer,
          type === "addition" ? t.toWallet : t.fromWallet
        );
      default:
        return null;
    }
  };

  const renderAmountForType = (type, amount) => {
    const isAdd = type === "addition";
    const color = isAdd ? "#1FB256" : "#EB3C24";
    const icon = isAdd ? "/icons/add-green.svg" : "/icons/minus-red.svg";
    const riyalImage = isAdd ? riyalImgGreen() : riyalImgRed();

    return (
      <Box sx={{ fontSize: "20px", fontWeight: 500, color }}>
        {amount} {riyalImage}{" "}
        <Image
          alt={isAdd ? "green" : "red"}
          src={icon}
          width={24}
          height={24}
        />
      </Box>
    );
  };

  return (
    <>
      {transactions?.data?.map((tx) => (
        <Box key={tx?.id} className="col-12">
          <Box className={style.transaction}>
            {[
              {
                label: t.amount,
                value: renderAmountForType(tx?.type, tx?.amount),
              },
              {
                label: t.transNum,
                value: tx?.order_id ? `#${tx.order_id}` : "-",
              },
              {
                label: t.transDate,
                value: tx?.created_at
                  ? moment(tx.created_at).format("D/M/YYYY")
                  : "-",
              },
              {
                label: t.balanceAfterTrans,
                value:
                  tx?.new_wallet_balance >= 0
                    ? `${tx.new_wallet_balance} ${t.sar}`
                    : "-",
              },
            ].map(({ label, value }, index) => (
              <Box
                key={label}
                className="d-flex justify-content-between mb-2"
                sx={
                  index === 0
                    ? { fontSize: "16px", fontWeight: 500, color: "#232323" }
                    : {}
                }
              >
                <Box>{label}</Box>
                <Box>{value}</Box>
              </Box>
            ))}

            {renderOperationText(tx?.operation, tx?.type)}
          </Box>
        </Box>
      ))}
      <div className="d-flex justify-content-center mt-2">
        <PaginateComponent
          meta={transactions?.meta}
          setPage={setPage}
          isLoading={isFetching}
        />
      </div>
    </>
  );
}

export default ShowTransactions;
