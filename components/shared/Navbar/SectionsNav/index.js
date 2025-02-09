import { Box } from "@mui/material";
import React from "react";
import style from "../Navbar.module.scss";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { useSelector } from "react-redux";

function SectionsNav({
  selectedSection = false,
  setSelectedSection = () => {},
  fontSize = false,
  arrayData = false,
  handleClick = () => {},
  showLineBelow = false,
}) {
  const { isMobile } = useScreenSize();
  const { allGroups } = useSelector((state) => state.appGroups);

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
                selectedSection === data?.id && `${style["active"]}`
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
                  handleClick(singleData?.title);
                }}
                className={`${
                  selectedSection === singleData?.title && style["active"]
                }`}
              >
                {singleData?.title}
              </Box>
            ))}

      {}
    </Box>
  );
}

export default SectionsNav;
