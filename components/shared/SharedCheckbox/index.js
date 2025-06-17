import { Checkbox } from "@mui/material";
import React from "react";

function SharedCheckbox({
  selectedId = "",
  handleCheckboxChange = () => {},
  data = {},
  showCircle = true,
}) {
  const isChecked = selectedId === data.id;

  return (
    <Checkbox
      checked={isChecked}
      onChange={() => handleCheckboxChange(data)}
      icon={
        showCircle ? (
          <span
            style={{
              display: "inline-block",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              border: "2px solid #B3B3B3",
            }}
          ></span>
        ) : undefined
      }
      checkedIcon={
        showCircle ? (
          <span
            style={{
              display: "inline-block",
              width: "20px",
              height: "20px",
              borderRadius: "50%",
              backgroundColor: "#FACC15",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="white"
              width="20px"
              height="20px"
            >
              <path d="M9 16.2l-3.5-3.5 1.4-1.4L9 13.4l6.6-6.6 1.4 1.4z" />
            </svg>
          </span>
        ) : undefined
      }
      sx={{
        padding: 0,
        ...(showCircle
          ? {}
          : {
              color: "#FACC15", // Yellow for default checkbox
              "&.Mui-checked": {
                color: "#FACC15", // Yellow for checked state
              },
            }),
      }}
    />
  );
}

export default SharedCheckbox;
