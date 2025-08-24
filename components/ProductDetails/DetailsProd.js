import useLocalization from "@/config/hooks/useLocalization";
import { Box, Divider } from "@mui/material";
import React from "react";

function DetailsProd({ prod }) {
  const { t } = useLocalization();
  const textDescription = prod?.desc || prod?.description;

  const isHTML = () =>
    /<\/?[a-z][\s\S]*>/i.test(textDescription) ? (
      <div dangerouslySetInnerHTML={{ __html: textDescription }} />
    ) : (
      <div>{textDescription}</div>
    );

  return (
    textDescription && (
      <Box>
        <Divider
          sx={{
            background: "#EAECF0",
            my: 1,
            height: "5px",
            borderBottomWidth: "0px",
          }}
        />
        <Box
          sx={{
            fontSize: "18px",
            fontWeight: "700",
            mb: 1,
          }}
        >
          {prod?.desc ? t.prodDetails : t.serviceDetails}
        </Box>
        <Box
          sx={{
            fontSize: "16px",
            fontWeight: "400",
            color: "#374151",
          }}
        >
          {isHTML()}
        </Box>
      </Box>
    )
  );
}

export default DetailsProd;
