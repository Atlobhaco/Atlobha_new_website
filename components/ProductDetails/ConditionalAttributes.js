import useLocalization from "@/config/hooks/useLocalization";
import { Box, Divider } from "@mui/material";
import React from "react";

function ConditionalAttributes({ prod }) {
  const { locale } = useLocalization();

  return prod?.conditional_attributes?.length ? (
    <div>
      <Divider
        sx={{
          background: "#EAECF0",
          my: 1,
          height: "5px",
          borderBottomWidth: "0px",
        }}
      />
      <ul
        style={{
          padding: "5px 22px",
        }}
      >
        {prod?.conditional_attributes?.map((attribute) => (
          <li key={attribute?.field} style={{ marginBottom: "5px" }}>
            <Box
              sx={{
                display: "inline-block",
                minWidth: "150px",
                fontWeight: "bold",
                color: "#374151",
              }}
            >
              {attribute?.label}
            </Box>
            <Box
              sx={{
                display: "inline-block",
                color: "#374151",
                fontWeight: "400",
              }}
            >
              {attribute?.value || "-"}
            </Box>
          </li>
        ))}
      </ul>
    </div>
  ) : null;
}

export default ConditionalAttributes;
