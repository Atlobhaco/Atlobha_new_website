import React, { useEffect, useState } from "react";

import Head from "next/head";
import useLocalization from "@/config/hooks/useLocalization";
import MetaTags from "@/components/shared/MetaTags";
import FootNavbar from "@/components/shared/FootNavbar";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { Box } from "@mui/material";
import DialogCentered from "@/components/DialogCentered";
import style from "../../components/shared/Navbar/Navbar.module.scss";
import Navbar from "@/components/shared/Navbar";
import CategoriesPopupcontent from "@/components/shared/Navbar/CategoriesPopupContent";
import { useRouter } from "next/router";
import Footer from "@/components/shared/Footer";
import Login from "@/components/Login";
import ScrollToTop from "@/components/ScrollToTop";
import { UrlsSpecific } from "@/constants/enums";

function Layout({ children }) {
  const { t } = useLocalization();
  const router = useRouter();
  const { route } = router;
  const { mobileScreen, hideFooter } = router.query;
  const { isMobile } = useScreenSize();
  const [openCategories, setOpenCategories] = useState(false);
  const [activeSection, setActiveSection] = useState(true);
  const hideNavbarInUrls = UrlsSpecific;

  useEffect(() => {
    if (route === "/spareParts") {
      setActiveSection(true);
    } else {
      setActiveSection(false);
    }
  }, []);

  return (
    <div>
      <MetaTags title="Atlobha-اطلبها" icon="/logo/road-atlobha-text.svg" />
      <Navbar
        setOpenCategories={setOpenCategories}
        hideNavbarInUrls={hideNavbarInUrls}
      />
      {isMobile && !mobileScreen && (
        <FootNavbar
          setOpenCategories={setOpenCategories}
          openCategories={openCategories}
        />
      )}
      <Box
        sx={{
          marginBottom: isMobile ? "100px" : "50px",
          maxWidth: hideNavbarInUrls ? "98%" : "90vw",
          marginRight: "auto",
          marginLeft: "auto",
          minHeight: "300px",
        }}
      >
        {children}
      </Box>
      {!isMobile && !hideFooter && <Footer />}

      <DialogCentered
        open={openCategories}
        setOpen={setOpenCategories}
        customClass={`${
          isMobile
            ? style["custom-style-popup-mobile"]
            : style["custom-style-popup"]
        }`}
        title={null}
        subtitle={false}
        content={
          <CategoriesPopupcontent
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            setOpenCategories={setOpenCategories}
            openCategories={openCategories}
          />
        }
      />
      {/* {!mobileScreen && <ScrollToTop />} */}
    </div>
  );
}

export default Layout;
