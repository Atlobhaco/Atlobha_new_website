import { Checkbox } from "@mui/material";
import React from "react";

function SharedCheckbox({
  selectedId = "",
  handleCheckboxChange = () => {},
  data = {},
}) {
  return (
    <Checkbox
      checked={selectedId === data.id}
      onChange={() => handleCheckboxChange(data)}
      icon={
        <span
          style={{
            display: "inline-block",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            border: "2px solid #B3B3B3", // Gray border when unchecked
          }}
        ></span>
      }
      checkedIcon={
        <span
          style={{
            display: "inline-block",
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "#FACC15", // Yellow background when checked
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
      }
      sx={{
        padding: 0, // Removes default padding
      }}
    />
  );
}

export default SharedCheckbox;
