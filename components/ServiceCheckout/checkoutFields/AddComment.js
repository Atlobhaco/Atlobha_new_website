import React, { useCallback } from "react";
import { Box, Typography, TextField } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import style from "../../../pages/spareParts/confirmation/confirmation.module.scss";
import debounce from "lodash.debounce";

function AddComment({ field, selectedFields, setSelectedFields }) {
  const { t, locale } = useLocalization();
  const { isMobile } = useScreenSize();

  // Debounced text handler to avoid lag when typing
  const handleTextChange = useCallback(
    debounce((checkoutFieldId, keyName, value) => {
      setSelectedFields((prev) => {
        const prevTexts = prev[keyName] || [];

        // Remove old entry for this field (if exists)
        const filtered = prevTexts.filter(
          (t) => t.checkoutFieldId !== checkoutFieldId
        );

        // If empty, just return without adding it back
        if (!value.trim()) {
          return {
            ...prev,
            [keyName]: filtered,
          };
        }

        // Add updated one
        const updated = [...filtered, { checkoutFieldId, value: value.trim() }];

        return {
          ...prev,
          [keyName]: updated,
        };
      });
    }, 200),
    [setSelectedFields]
  );

  // Event handler that triggers the debounced function
  const onTextChange = (checkoutFieldId, keyName, e) => {
    const { value } = e.target;
    handleTextChange(checkoutFieldId, keyName, value);
  };

  return (
    <>
      {field?.map((singleField) => {
        const fieldId = singleField?.checkout_field?.id;
        const keyName = singleField?.checkout_field?.type;

        // Get saved value if already typed
        const currentValue =
          selectedFields?.[keyName]?.find((f) => f.checkoutFieldId === fieldId)
            ?.value || "";

        return (
          <Box key={fieldId} className="mb-3">
            <Box
              className={`${style["deliverySec"]} gap-0 align-items-center mb-1 border-bottom-0`}
            >
              <InfoOutlinedIcon
                sx={{
                  width: "25px",
                  height: "25px",
                  color: "#FFD400",
                  ...(locale === "ar" ? { ml: 1 } : { mr: 1 }),
                }}
              />
              <Box
                sx={{ width: "95%" }}
                className={`${style["deliverySec_address"]}`}
              >
                <Box className={`${style["deliverySec_address-holder"]}`}>
                  {singleField?.checkout_field?.title}{" "}
                  <Typography component="span" sx={{ color: "#B0B0B0", mx: 1 }}>
                    {!singleField?.is_required && t.optional}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                padding: isMobile ? "10px" : "15px",
                borderRadius: "8px",
              }}
            >
              <TextField
                multiline
                fullWidth
                minRows={3}
                maxRows={5}
                defaultValue={currentValue}
                placeholder={t.writeHere || "اكتب هنا..."}
                onChange={(e) => onTextChange(fieldId, keyName, e)}
              />
            </Box>
          </Box>
        );
      })}
    </>
  );
}

export default AddComment;
