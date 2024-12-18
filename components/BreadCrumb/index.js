import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function BreadCrumb() {
  const router = useRouter();
  const { t } = useLocalization();
  const { isMobile } = useScreenSize();

  const routeName = router?.route?.split("/").filter(Boolean).length
    ? router?.route?.split("/").filter(Boolean)
    : ["mainPage"];

  const titleStyle = {
    fontWeight: "500",
    fontSize: isMobile ? "12px" : "16px",
    cursor: "pointer",
  };

  const onclick = (route, index) => {
    if (!index || +index === 0) {
      router.push(`/${route}`);
    } else {
      router.push(
        `/${router?.route
          ?.split("/")
          .filter(Boolean)
          ?.splice(0, index + 1)
          ?.join("/")}`
      );
    }
  };

  const renderTitleOfPages = () => {
    return +routeName?.length > 1 ? (
      routeName.map((singleRoute, index) => {
        return (
          <span
            key={singleRoute}
            style={{
              ...titleStyle,
              color: index !== routeName?.length - 1 ? "#A1A1AA" : "#18181B",
            }}
            onClick={() => onclick(singleRoute, index)}
          >
            {t[singleRoute]}
            {index !== routeName?.length - 1 && <span className="mx-2">/</span>}
          </span>
        );
      })
    ) : (
      <span
        style={{
          ...titleStyle,
          color: "#18181B",
        }}
        onClick={() => onclick(routeName, 0)}
      >
        {t[routeName]}
      </span>
    );
  };
  return (
    <div>
      <Image
        src={"/imgs/home.svg"}
        alt="arrow"
        width={isMobile ? 14 : 18}
        height={isMobile ? 14 : 18}
        className="ms-2 mb-1"
      />
      {renderTitleOfPages()}
    </div>
  );
}

export default BreadCrumb;
