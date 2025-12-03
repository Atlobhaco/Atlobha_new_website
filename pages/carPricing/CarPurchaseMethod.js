import React from "react";
import style from "./carPricing.module.scss";
import useLocalization from "@/config/hooks/useLocalization";
import Image from "next/image";
import SharedTextField from "../../components/shared/SharedTextField";

function CarPurchaseMethod({
  selectedPurchase,
  setSelectedPurchase,
  purchaseDetails,
  setPurchaseDetails,
}) {
  const { t } = useLocalization();

  const purchaseMethods = [
    {
      type: "CASH",
      text: t.cash,
      image: "/icons/wallet-yellow.svg",
      activeImage: "/icons/card-black.svg",
    },
    {
      type: "INSTALLMENT",
      text: t.payMethods.INSTALLMENT,
      image: "/icons/installment-black.svg",
      activeImage: "/icons/installment-black.svg",
    },
  ];

  return (
    <div className={`${style["border-bottom"]} py-4`}>
      <div className="d-flex align-items-center gap-3">
        <Image src="/icons/yellow-card.svg" alt="car" width={25} height={25} />
        <div className={style.heading}>{t.purchaseMethod}</div>
      </div>
      <div className="d-flex gap-3 mt-3">
        {purchaseMethods.map((method) => {
          const isActive = selectedPurchase?.type === method.type;
          return (
            <div
              key={method.text}
              className={`${style["purchase-method"]} ${
                isActive ? style["purchase-method-active"] : ""
              }`}
              onClick={() => setSelectedPurchase(method)}
            >
              {method.text}
              <Image
                alt="purchase"
                src={isActive ? method.activeImage : method.image}
                width={23}
                height={23}
                style={{ marginInlineStart: 10 }}
              />
            </div>
          );
        })}
      </div>
      {selectedPurchase?.type === "INSTALLMENT" && (
        <div className="row">
          <div className="col-md-6 mt-3">
            <SharedTextField
              label={t.depositeValue}
              placeholder={t.depositeExample}
              hint={t.depositeHint}
              inputMode="numeric" // 👈 this makes mobile keyboard show numbers
              pattern="[0-9]*"
              imgIcon={false}
              showAstrick={true}
              value={purchaseDetails?.depositeValue}
              handleChange={(e) => {
                const value = e.target.value;
                // Allow only digits (0–9)
                if (/^\d{0,4}$/.test(value)) {
                  setPurchaseDetails({
                    ...purchaseDetails,
                    depositeValue: value,
                  });
                }
              }}
            />{" "}
          </div>
          <div className="col-md-6 mt-3">
            <SharedTextField
              label={t.workAs}
              placeholder={t.workAsExample}
              showAstrick={true}
              imgIcon={false}
              value={purchaseDetails?.jobtitle}
              handleChange={(e) =>
                setPurchaseDetails({
                  ...purchaseDetails,
                  jobtitle: e?.target?.value,
                })
              }
            />{" "}
          </div>
        </div>
      )}
    </div>
  );
}

export default CarPurchaseMethod;
