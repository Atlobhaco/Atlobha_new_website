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

function FootNavbar({ setOpenCategories, openCategories }) {
  const [activeTab, setActiveTab] = useState(null);

  return (
    <Box
      className={`${style["footNavbar"]}`}
      sx={{
        justifyContent: openCategories ? "center" : "space-between",
        zIndex: !openCategories ? 1 : 9999,
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
            text="الرئيسية"
            activeTab={activeTab === "main" ? true : false}
            onClick={() => setActiveTab("main")}
          />
          <FootNavSection
            icon={<Search />}
            text="البحث"
            activeTab={activeTab === "search" ? true : false}
            onClick={() => setActiveTab("search")}
          />
          <FootNavSection
            icon={<BlackMenu />}
            customWidth="43px"
            customHeight="43px"
            activeTab={activeTab === "menu" ? true : false}
            onClick={() => setOpenCategories(true)}
          />
          <FootNavSection
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
          />{" "}
        </>
      )}
    </Box>
  );
}

export default FootNavbar;
