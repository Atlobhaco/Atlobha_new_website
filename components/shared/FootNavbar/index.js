import React, { useState } from "react";
import style from "./FootNavbar.module.scss";
import { Box } from "@mui/material";
import FootNavSection from "./FootNavSection";
import Search from "../../../public/icons/search-grey.svg";
import Basket from "../../../public/icons/basket-sm.svg";
import Main from "../../../public/icons/main.svg";
import More from "../../../public/icons/more.svg";
import BlackMenu from "../../../public/icons/black-menu.svg";
import CloseYellow from "../../../public/icons/close-yellow.svg";
import { useSelector } from "react-redux";
import useLocalization from "@/config/hooks/useLocalization";
import { useRouter } from "next/router";
import { isAuth } from "@/config/hooks/isAuth";

function FootNavbar({ setOpenCategories, openCategories }) {
  const router = useRouter();
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
          {/* <FootNavSection
            icon={<Main />}
            text="الرئيسية"
            activeTab={activeTab === "main" ? true : false}
            onClick={() => setActiveTab("main")}
          />
          <FootNavSection
            icon={<Search />}
            text="البحث"
            activeTab={activeTab === "search" ? true : false}
            onClick={() => setActiveTab("search")}
          /> */}
          <Box sx={{ width: "75px" }}></Box>
          <Box sx={{ width: "75px" }}></Box>
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
          {isAuth() ? (
            <FootNavSection
              icon={<More />}
              text={t.more}
              activeTab={
                router?.pathname?.includes("userProfile") ? true : false
              }
              onClick={() => {
                router.push("/userProfile");
              }}
            />
          ) : (
            <Box sx={{ width: "75px" }}></Box>
          )}

          {/* <FootNavSection
            icon={<Basket />}
            text="السلة"
            activeTab={activeTab === "basket" ? true : false}
            onClick={() => setActiveTab("basket")}
          />
          <FootNavSection
            icon={<More />}
            text="المزيد"
            activeTab={activeTab === "more" ? true : false}
            onClick={() => setActiveTab("more")}
          />{" "} */}
        </>
      )}
    </Box>
  );
}

export default FootNavbar;
