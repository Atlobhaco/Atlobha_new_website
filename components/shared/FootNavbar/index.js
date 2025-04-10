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

function FootNavbar({ setOpenCategories, openCategories }) {
  const [activeTab, setActiveTab] = useState(null);
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
            activeTab={activeTab === "menu" ? true : false}
            onClick={() => setOpenCategories(true)}
          />
          <FootNavSection
            icon={<Basket />}
            text={t.basket}
            activeTab={activeTab === "basket" ? true : false}
            onClick={() => setActiveTab("basket")}
            hasNum={basket?.length}
          />
          <Box sx={{ width: "75px" }}></Box>
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
