import React from "react";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { Box, Typography } from "@mui/material";
import style from "../../../pages/spareParts/confirmation/confirmation.module.scss";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import Image from "next/image";

function Selections({ field, selectedFields, setSelectedFields }) {
  const { isMobile } = useScreenSize();
  const { locale, t } = useLocalization();

  const navbar =
    typeof window !== "undefined" && document.getElementById("navbar");
  const bgColor = navbar
    ? window.getComputedStyle(navbar).backgroundColor
    : "#E7F5FF";

  // Store selection per field by its type or ID
  const handleSelect = ({ checkoutFieldId, keyName, option }) => {
    setSelectedFields((prev) => {
      const prevSelections = prev[keyName] || [];

      // Check if this option is already selected for this checkoutFieldId
      const alreadySelected = prevSelections.some(
        (sel) => sel.checkoutFieldId === checkoutFieldId && sel.id === option.id
      );

      if (alreadySelected) {
        // Remove it (toggle off)
        return {
          ...prev,
          [keyName]: prevSelections.filter(
            (sel) =>
              !(sel.checkoutFieldId === checkoutFieldId && sel.id === option.id)
          ),
        };
      }

      // Otherwise: remove old selection for this field, then add new one
      const otherSelections = prevSelections.filter(
        (sel) => sel.checkoutFieldId !== checkoutFieldId
      );

      return {
        ...prev,
        [keyName]: [...otherSelections, { checkoutFieldId, ...option }],
      };
    });
  };

  return (
    <>
      {field?.map((singleField) => {
        return (
          <Box key={singleField?.id}>
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
                  <Typography
                    component="span"
                    sx={{
                      color: "#B0B0B0",
                      mx: 1,
                    }}
                  >
                    {!singleField?.is_required && t.optional}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "nowrap",
                    gap: isMobile ? "5px" : "10px",
                    overflowX: "auto",
                    overflowY: "hidden",
                    width: "100%",
                  }}
                >
                  {singleField?.checkout_field?.options?.map((option) => {
                    const fieldId = option.id; // unique per field

                    const isSelected = selectedFields?.[
                      singleField?.checkout_field?.type
                    ]?.some((sel) => sel.id === fieldId);

                    return (
                      <Box
                        sx={{
                          mb: 1,
                          width: "105px",
                          minWidth: "105px",
                          height: "120px",
                          background: bgColor,
                          display: "flex",
                          flexDirection: "column",
                          borderRadius: "8px",
                          padding: "10px 7px 11px 8px",
                          cursor: "pointer",
                          justifyContent: "space-between",
                          flexShrink: 0, // 👈 this is the fix
                          border: isSelected
                            ? "2px solid #FFD400"
                            : "1px solid transparent",
                          "&:hover": { opacity: "0.8" },
                        }}
                        key={option.id}
                        onClick={() =>
                          handleSelect({
                            checkoutFieldId: singleField?.checkout_field?.id,
                            keyName: singleField?.checkout_field?.type,
                            option,
                          })
                        }
                      >
                        <Box
                          sx={{
                            fontSize: "15px",
                            fontWeight: "500",
                            color: "#232323",
                          }}
                        >
                          {option.title}
                        </Box>
                        {option.image?.url && (
                          <Image
                            alt={option.id}
                            src={option.image.url}
                            width={100}
                            height={60}
                            style={{
                              height: "auto",
                              maxHeight: "80px",
                              width: "auto",
                              maxWidth: "90%",
                            }}
                          />
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          </Box>
        );
      })}
    </>
  );
}

export default Selections;

// {
// 	id: 260,
// 	checkout_field: {
// 	  id: 13,
// 	  type: "multi-select",
// 	  title: "نوع السطحه ٢",
// 	  title_ar: "نوع السطحه ٢",
// 	  title_en: "نوع السطحه ٢",
// 	  position: 2,
// 	  options: [
// 		{
// 		  id: 61,
// 		  title: "سطحه عاديه",
// 		  title_ar: "سطحه عاديه",
// 		  title_en: "سطحه عاديه",
// 		  image: {
// 			id: 1774,
// 			type: "image",
// 			name: "ca7bfd85c52dc33ae0642bfbebfd28a69df956bc.png",
// 			mime_type: "image/png",
// 			url: "https://atlobha-staging.s3.me-south-1.amazonaws.com/images/2025-Sep/sxsbqBZYDx365ZkkWU6ukP1AJh2qOJ4OYOl6DDXi.png",
// 		  },
// 		},
// 		{
// 		  id: 37,
// 		  title: "سطحه كبيره",
// 		  title_ar: "سطحه كبيره",
// 		  title_en: "سطحه كبيره",
// 		  image: {
// 			id: 1775,
// 			type: "image",
// 			name: "d45809aab9b78ed6f2814bdbeca4f0139799266e.png",
// 			mime_type: "image/png",
// 			url: "https://atlobha-staging.s3.me-south-1.amazonaws.com/images/2025-Sep/qLK345vxoypp0NsVpMRL8XIJuzNDqDCEpeZpfrfD.png",
// 		  },
// 		},
// 		{
// 		  id: 48,
// 		  title: "سطحه وسط",
// 		  title_ar: "سطحه وسط",
// 		  title_en: "سطحه وسط",
// 		  image: {
// 			id: 1776,
// 			type: "image",
// 			name: "f76048504bc287822cd286d65e47a11a8025a2e6.png",
// 			mime_type: "image/png",
// 			url: "https://atlobha-staging.s3.me-south-1.amazonaws.com/images/2025-Sep/hUxQfQownLjEqlkcw3aDX6wavRfSdrQDUv4wyR2U.png",
// 		  },
// 		},
// 		{
// 		  id: 130,
// 		  title: "سطحه هيدروليك",
// 		  title_ar: "سطحه هيدروليك",
// 		  title_en: "سطحه هيدروليك",
// 		  image: {
// 			id: 1778,
// 			type: "image",
// 			name: "f76048504bc287822cd286d65e47a11a8025a2e6.png",
// 			mime_type: "image/png",
// 			url: "https://atlobha-staging.s3.me-south-1.amazonaws.com/images/2025-Sep/q7Kx6yJbAWYyXYwKwapWNPd2kZMK2nnEfI4bAZda.png",
// 		  },
// 		},
// 	  ],
// 	},
// 	is_required: true,
//   },
