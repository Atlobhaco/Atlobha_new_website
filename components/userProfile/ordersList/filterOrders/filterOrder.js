import React, { useState } from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import Fade from "@mui/material/Fade";
import { Image } from "react-bootstrap";
import { Box } from "@mui/material";
import SharedDropDown from "@/components/shared/SharedDropDown";
import SharedDatePicker from "@/components/shared/SharedDatePicker";

function FilterOrder() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const title = {
    fontSize: "24px",
    fontWeight: "700",
    mb: 2,
  };
  const [value, setValue] = useState(null);
  return (
    <div>
      <Button
        id="filter-btn"
        aria-controls={open ? "filter-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <Image src="/icons/filter.svg" width={30} height={30} alt="filter" />
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
            minWidth: "300px",
            boxShadow: "0px 24px 24px 0px rgba(0, 0, 0, 0.14)",
            borderRadius: "20px",
          },
        }}
      >
        <Box sx={title}>تصفية الطلبات</Box>
        <SharedDropDown label="حالة الطلب" showAstrick />
        <SharedDatePicker value={value} setValue={setValue} />
      </Menu>
    </div>
  );
}

export default FilterOrder;
