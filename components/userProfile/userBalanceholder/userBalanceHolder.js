import React from "react";
import style from "./userBalanceHolder.module.scss";
import Image from "next/image";
import ActionButtons from "@/components/shared/actionButtons";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useAuth } from "@/config/providers/AuthProvider";

function UserBalanceHolder({ data }) {
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

  return (
    <div className={`col-md-12`}>
      <div className={`${style["holder"]}`}>
        <div className={`${style["info"]}`}>
          <Image
            src="/imgs/user-profile.svg"
            width={isMobile ? 35 : 56}
            height={isMobile ? 35 : 56}
            alt="user-img"
          />
          <div>
            <div className={`${style["name"]}`}>{data?.name}</div>
            <div className={`${style["hint"]}`}>اظهر وعدل ملفك الشخصي</div>
          </div>
        </div>
        <div className={`${style["edit"]}`}>
          <ActionButtons type="edit" onClick={() => alert("clicked")} />
        </div>
      </div>
      <div className={`${style["balance"]}`}>
        <div className={`${style["text"]}`}>
          <Image
            src="/imgs/wallet-sm.svg"
            width={isMobile ? 25 : 30}
            height={isMobile ? 25 : 30}
            alt="wallet"
            style={{
              marginBottom: "4px",
            }}
          />
          رصيد حسابي علي اطلبها{" "}
          <span>
            {data?.wallet_balance || 0} {t.sar}
          </span>
        </div>
        <Image
          src="/icons/arrow-left-sm.svg"
          width={isMobile ? 8 : 12}
          height={12}
          alt="arrow"
        />
      </div>
    </div>
  );
}

export default UserBalanceHolder;
