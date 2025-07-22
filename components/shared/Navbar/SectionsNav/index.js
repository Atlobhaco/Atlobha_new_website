import { Box } from "@mui/material";
import React from "react";
import style from "../Navbar.module.scss";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { MARKETPLACE, SPAREPARTS } from "@/constants/enums";

function SectionsNav({
  selectedSection = false,
  setSelectedSection = () => {},
  fontSize = false,
  arrayData = false,
  handleClick = () => {},
  showLineBelow = false,
}) {
  const router = useRouter();
  const { secTitle } = router.query;
  const { isMobile } = useScreenSize();
  const { allGroups } = useSelector((state) => state.appGroups);

  // logic inside function to make marketplace default selection
  const activeDependOnUrl = (section) => {
    return section?.title === secTitle ||
      (section?.type === SPAREPARTS &&
        router.pathname?.includes("/spareParts")) ||
      (section?.type === MARKETPLACE && router.pathname === "/") ||
      (!secTitle &&
        section?.type === MARKETPLACE &&
        !router.pathname?.includes("/spareParts"))
      ? style["active"]
      : "";
  };

  return (
    <Box
      className={`${style["sections-parent"]}`}
      sx={{
        display: "flex",
        overflow: "auto hidden",
        // gap: "8px",
        fontSize: isMobile ? "12px" : fontSize ? fontSize : "24px",
        mb: 1,
        borderBottom: showLineBelow ? "1px solid #F0F0F0" : "unset",
      }}
    >
      {arrayData?.length
        ? arrayData?.map((data) => (
            <Box
              key={data?.id}
              onClick={(e) => {
                setSelectedSection(data?.id);
                handleClick(data?.id);
              }}
              className={`${
                (selectedSection === data?.id ||
                  (!selectedSection && data?.id === "all")) &&
                `${style["active"]}`
              }`}
              sx={{
                fontWeight: selectedSection === data?.id ? "700" : "500",
              }}
            >
              {data?.name}
            </Box>
          ))
        : allGroups
            ?.map((data) => data?.sections)
            ?.flat()
            ?.map((singleData) => (
              <Box
                key={singleData?.title}
                onClick={() => {
                  setSelectedSection(singleData?.title);
                  handleClick(singleData);
                }}
                className={`${activeDependOnUrl(singleData)}`}
              >
                {singleData?.title}
              </Box>
            ))}

      {}
    </Box>
  );
}

export default SectionsNav;
