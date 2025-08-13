import React, { useState } from "react";
import style from "./FootNavbar.module.scss";
import { Box } from "@mui/material";
import FootNavSection from "./FootNavSection";
import Search from "../../../public/icons/search-grey.svg";
import Basket from "../../../public/icons/basket-sm.svg";
import Main from "../../../public/logo/new-atlob-logo.svg";
import More from "../../../public/icons/more.svg";
import BlackMenu from "../../../public/icons/black-menu.svg";
import CloseYellow from "../../../public/icons/close-yellow.svg";
import { useSelector } from "react-redux";
import useLocalization from "@/config/hooks/useLocalization";
import { useRouter } from "next/router";
import { isAuth } from "@/config/hooks/isAuth";

function FootNavbar({ setOpenCategories, openCategories }) {
  const router = useRouter();
  const secType = router?.query?.secType;
  const { basket } = useSelector((state) => state.basket);
  const { t } = useLocalization();

  return (
    <Box
      className={`${style["footNavbar"]}`}
      sx={{
        justifyContent: openCategories ? "center" : "center",
        zIndex: !openCategories ? 2 : 9999,
        // hide when any popoup open except the main one
      }}
    >
      {openCategories ? (
        <FootNavSection
          icon={<CloseYellow />}
          customWidth="43px"
          customHeight="43px"
          onClick={() => setOpenCategories(false)}
        />
      ) : (
        <>
          <FootNavSection
            icon={<Main />}
            text={t.homePage}
            activeTab={router?.pathname === "/" ? true : false}
            onClick={() => router.push("/")}
          />
          <FootNavSection
            icon={<Search />}
            text={t.common.search}
            activeTab={router?.pathname?.includes("search") ? true : false}
            onClick={() => {
              if (secType) {
                router.push(`/search/?secType=${secType}`);
              } else {
                router.push(`/search`);
              }
            }}
          />
          <FootNavSection
            icon={<BlackMenu />}
            customWidth="43px"
            customHeight="43px"
            activeTab={false}
            onClick={() => setOpenCategories(true)}
          />
          <FootNavSection
            icon={<Basket />}
            text={t.basket}
            activeTab={router?.pathname?.includes("basket") ? true : false}
            onClick={() => {
              router.push("/basket");
            }}
            hasNum={basket?.length}
          />

          <FootNavSection
            icon={<More />}
            text={t.more}
            activeTab={router?.pathname?.includes("userProfile") ? true : false}
            onClick={() => {
              router.push("/userProfile");
            }}
          />
        </>
      )}
    </Box>
  );
}

export default FootNavbar;
