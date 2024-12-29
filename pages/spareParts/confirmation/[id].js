import React, { useRef } from "react";
import style from "./confirmation.module.scss";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { toast } from "react-toastify";
import useLocalization from "@/config/hooks/useLocalization";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Image from "next/image";
import { useRouter } from "next/router";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import SharedBtn from "@/components/shared/SharedBtn";
import useCustomQuery from "@/config/network/Apiconfig";
import { ORDERS, SPARE_PARTS } from "@/config/endPoints/endPoints";

function Confirmation() {
  const { isMobile } = useScreenSize();

  const router = useRouter();
  const { id } = router.query;
  const { t } = useLocalization();

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id).then(
      () => {
        toast.success(`${t.copySuccess}, ${id}`);
      },
      (err) => {
        console.error("Failed to copy: ", err);
      }
    );
  };

  const { data, refetch: addPricing } = useCustomQuery({
    name: ["getDataforPricing", id],
    url: `${SPARE_PARTS}${ORDERS}/${id}`,
    refetchOnWindowFocus: false,
    enabled: id ? true : false,
    select: (res) => res?.data?.data,
    onError: (err) => {
      toast.error(err?.response?.data?.first_error);
    },
  });

  return (
    <div className={`${style["confirmation"]}`}>
      <div className={`${style["confirmation_thank"]}`}>{t.thankYou}</div>
      <div className={`${style["numberSection"]}`}>
        <div className={`${style["numberSection_num"]}`}>
          <div className={`${style["numberSection_num-holder"]}`}>
            {t.orderNum}:
          </div>
          <div className={`${style["numberSection_num-id"]}`}>
            {data?.reference_code || ""}
          </div>
          <div>
            <ContentCopyIcon
              sx={{ cursor: "pointer", width: isMobile ? "17px" : "auto" }}
              onClick={() => handleCopy(data?.reference_code)} // Add onClick handler
            />
          </div>
        </div>
        <div className={`${style["numberSection_hint"]}`}>
          {t.confirmMessage}
        </div>
      </div>
      <div className={`${style["deliverySec"]}`}>
        <div>
          <LocationOnOutlinedIcon
            sx={{
              width: "24px",
              height: "24px",
            }}
          />
        </div>
        <div className={`${style["deliverySec_address"]}`}>
          <div className={`${style["deliverySec_address-holder"]}`}>
            {t.deliveryAddress}
          </div>
          <div className={`${style["deliverySec_address-location"]}`}>
            {data?.address?.address || ""} {data?.address?.city?.name}
          </div>
        </div>
      </div>
      <div className={`${style["timeSec"]}`}>
        <div>
          <CalendarMonthOutlinedIcon
            sx={{
              width: "24px",
              height: "24px",
            }}
          />
        </div>
        <div className={`${style["timeSec_appoin"]}`}>
          <div className={`${style["timeSec_appoin-holder"]}`}>
            {t.deliveryTime}
          </div>
          <div className={`${style["timeSec_appoin-date"]}`}>
            <Image
              src="/icons/alert-blue.svg"
              alt="alert"
              width={isMobile ? 14 : 20}
              height={isMobile ? 14 : 20}
            />
            {data?.estimated_delivery_date || t.dateLater}
          </div>
        </div>
      </div>
      <div className={`${style["details"]}`}>
        <div className={`${style["details-header"]}`}>
          <Image
            src="/icons/brakes-black.svg"
            alt="alert"
            width={24}
            height={24}
          />
          {t.partsData}
        </div>
        {data?.parts?.map((part) => (
          <div className={`${style["details-parts"]}`} key={part?.id}>
            <div className={`${style["details-parts_imgHolder"]}`}>
              <Image
                src={part?.image || "/imgs/no-img-holder.svg"}
                width={isMobile ? 50 : 70}
                height={isMobile ? 50 : 70}
                alt="spare-part"
              />
            </div>
            <div className={`${style["details-parts_details"]}`}>
              <div className={`${style["details-parts_details-name"]}`}>
                {part?.name}
              </div>
              <div className={`${style["details-parts_details-qty"]}`}>
                {part?.quantity} {t.piece}{" "}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center">
        <SharedBtn
          onClick={() => router.push(`/spareParts`)}
          text="goMain"
          className="black-btn"
          customStyle={{
            width: "450px",
          }}
        />
      </div>
    </div>
  );
}

export default Confirmation;
