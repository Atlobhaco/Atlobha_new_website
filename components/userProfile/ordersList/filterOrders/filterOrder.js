import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import { Image } from "react-bootstrap";
import { Box } from "@mui/material";
import SharedDropDown from "@/components/shared/SharedDropDown";
import SharedDatePicker from "@/components/shared/SharedDatePicker";
import useLocalization from "@/config/hooks/useLocalization";
import SharedBtn from "@/components/shared/SharedBtn";
import { statusArray } from "@/constants/helpers";
import { STATUS } from "@/constants/enums";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function FilterOrder({
  filters,
  setFilters,
  defaultFilters,
  callOrders,
  setPage,
  setLoadMoreClicked,
}) {
  const { isMobile } = useScreenSize();
  const { t, locale } = useLocalization();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [tempfilters, setTempFilters] = useState(filters);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setTempFilters(filters);
    setTempFilters(filters);
    setAnchorEl(null);
  };

  const title = {
    fontSize: isMobile ? "19px" : "24px",
    fontWeight: "700",
    mb: 2,
  };

  useEffect(() => {
    setTempFilters(filters);
  }, [filters]);

  const checkIfSelectFilter = () => {
    return (
      filters?.created_at_from || filters?.created_at_to || filters?.status
    );
  };
  return (
    <div>
      <Button
        id="filter-btn"
        aria-controls={open ? "filter-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Image
          loading="lazy"
          src={`/icons/${
            checkIfSelectFilter() ? "colored-filter.svg" : "filter.svg"
          }`}
          width={isMobile ? 24 : 30}
          height={isMobile ? 24 : 30}
          alt="filter"
        />
      </Button>
      <Menu
        id="filter-menu"
        MenuListProps={{
          "aria-labelledby": "filter-btn",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        TransitionComponent={Fade}
        sx={{
          "& .MuiPaper-root": {
            // backgroundColor: "lightblue", // Set background color
            padding: "20px",
            minWidth: isMobile ? "unset" : "300px",
            maxWidth: isMobile ? "99%" : "390px",
            boxShadow: "0px 24px 24px 0px rgba(0, 0, 0, 0.14)",
            borderRadius: "20px",
            ...(locale === "ar"
              ? { right: isMobile ? "auto !important" : "unset" }
              : { left: isMobile ? "auto !important" : "inherit" }),
          },
        }}
      >
        <Box sx={title}>{t.filtersOrders}</Box>
        <SharedDropDown
          value={tempfilters?.status}
          label={t.statusOrder}
          showAstrick
          items={statusArray()}
          handleChange={(e) => {
            setTempFilters({
              ...tempfilters,
              status: e?.target?.value,
            });
          }}
        />
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            // flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          <SharedDatePicker
            value={tempfilters?.created_at_from}
            showAstrick
            label={t.creatianDateFrom}
            handleChange={(value) => {
              setTempFilters({
                ...tempfilters,
                created_at_from: value,
              });
            }}
          />
          <SharedDatePicker
            value={tempfilters?.created_at_to}
            handleChange={(value) => {
              setTempFilters({
                ...tempfilters,
                created_at_to: value,
              });
            }}
            showAstrick
            label={t.creationDateTo}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: "10px",
            justifyContent: "space-between",
            mt: 4,
          }}
        >
          <SharedBtn
            className="big-main-btn"
            customClass="w-100"
            text="reset"
            onClick={() => {
              setLoadMoreClicked(false);
              setFilters(defaultFilters);
              setTempFilters(defaultFilters);
              setPage(1);
              setAnchorEl(null);
            }}
          />
          <SharedBtn
            className="outline-btn"
            customClass="w-100"
            text="showResults"
            onClick={() => {
              setLoadMoreClicked(false);
              setFilters(tempfilters);
              setTempFilters(tempfilters);
              setPage(1);
              setAnchorEl(null);
            }}
          />
        </Box>
      </Menu>
    </div>
  );
}

export default FilterOrder;
