import React, { useState, useEffect } from "react";
import { InputBase, InputAdornment } from "@mui/material";
import Image from "next/image";
import useLocalization from "@/config/hooks/useLocalization";

// Debounce function to limit how often a function can run
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timeout if the value changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const SharedInput = ({
  onSearch = () => {},
  placeholder = "search",
  className = "",
}) => {
  const { t } = useLocalization();
  const [inputValue, setInputValue] = useState("");
  const debouncedValue = useDebounce(inputValue, 300); // Debounce after 300ms

  useEffect(() => {
    // Call the search function only if the value has at least 3 characters
    if (debouncedValue.length >= 3) {
      onSearch(debouncedValue);
    }
    if (!debouncedValue.length) {
      onSearch("");
    }
  }, [debouncedValue, onSearch]);

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <InputBase
      className={className}
      value={inputValue}
      onChange={handleChange}
      placeholder={t[placeholder]}
      startAdornment={
        <InputAdornment
          position="start"
          sx={{
            margin: "0px 8px",
          }}
        >
          <Image
            src="/icons/search-yellow.svg"
            width={35}
            height={35}
            alt="search icon"
          />
        </InputAdornment>
      }
      sx={{
        // width: "320px",
        backgroundColor: "white", // Set background color to white
        borderRadius: "8px",
        padding: "0 10px", // Add padding inside input
        height: "65px", // Set height to 45px
        border: "1px solid #D1D5DB", // Add a border color
        boxShadow: " 0px 1px 2px 0px rgba(18, 26, 43, 0.05)",
        "&:hover": {
          borderColor: "#B0B0B0", // Change border color on hover
        },
        "&.Mui-focused": {
          borderColor: "#A0A0A0", // Set border color when focused
        },
        "& input": {
          color: "#9CA3AF",
          fontWeight: "600",
          "&::placeholder": {
            color: "#9CA3AF", // Set placeholder color
            opacity: 1, // Ensure placeholder color applies fully
            fontWeight: "600",
          },
        },
      }}
    />
  );
};

export default SharedInput;
