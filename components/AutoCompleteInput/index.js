import React, { useEffect, useState } from "react";
import { Autocomplete, TextField, Box, CircularProgress } from "@mui/material";
import useLocalization from "@/config/hooks/useLocalization";
import { Image } from "react-bootstrap";
import useCustomQuery from "@/config/network/Apiconfig";
import { AUTOCOMPLETE, SEARCH } from "@/config/endPoints/endPoints";
import useDebounce from "@/config/hooks/useDebounce";
import { useRouter } from "next/router";
import useScreenSize from "@/constants/screenSize/useScreenSize";

function AutoCompleteInput() {
  const router = useRouter();
  const queryKeyword = router?.query?.keyword || "";
  const [inputValue, setInputValue] = useState(queryKeyword);
  const { isMobile } = useScreenSize();
  const [selectedOption, setSelectedOption] = useState(null);
  const debouncedInput = useDebounce(inputValue, 300);
  const [options, setOptions] = useState([]);
  const { locale, t } = useLocalization();
  const isRtl = locale === "ar";
  const [open, setOpen] = useState(false);
  const countOfLetters = 1;

  const { isFetching } = useCustomQuery({
    name: ["autoComplete", debouncedInput],
    url: `${SEARCH}${AUTOCOMPLETE}?keyword=${debouncedInput}`,
    enabled: debouncedInput.length >= countOfLetters,
    refetchOnWindowFocus: false,
    select: (res) => res?.data?.data,
    onSuccess: (res) => {
      if (!res?.length) {
        setOptions([debouncedInput]);
      } else {
        setOptions(res);
      }
    },
  });

  //   when clear the input clear also options appear
  useEffect(() => {
    if (!debouncedInput?.length) {
      setOptions([]);
    }
  }, [debouncedInput]);

  useEffect(() => {
    if (router.isReady) {
      const hasKeyword = !!router.query.keyword;
      if (hasKeyword) {
        setInputValue(router.query.keyword);
        setSelectedOption(router.query.keyword);
      } else {
        // Clear input and selection if keyword is not in URL
        setInputValue("");
        setSelectedOption(null);
      }
    }
  }, [router.isReady, router.query.keyword]);

  return (
    <Box
      dir={isRtl ? "rtl" : "ltr"}
      sx={{
        minWidth: isMobile ? "100%" : 600,
        backgroundColor: "white",
        borderRadius: 4,
        boxShadow: "0px 1px 2px 0px rgba(18, 26, 43, 0.05)",
      }}
    >
      <Autocomplete
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={options}
        loading={isFetching}
        loadingText={t.loading}
        value={selectedOption}
        getOptionLabel={(option) => option}
        onChange={(event, newValue) => {
          if (newValue) {
            router.push(`/search?keyword=${newValue}&type=MarketplaceProduct`);
            setSelectedOption(newValue);
          } else {
            setSelectedOption(null);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            if (inputValue?.trim()?.length >= countOfLetters) {
              router.push(
                `/search?keyword=${inputValue}&type=MarketplaceProduct`
              );
              setSelectedOption(inputValue);
              setOpen(false); // 👈 يغلق القائمة بعد الضغط
            }
          }
        }}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        noOptionsText={
          debouncedInput.length >= countOfLetters
            ? isFetching
              ? `${t.loading} "${debouncedInput}"`
              : `${t.noResultsFound}`
            : t.typeThreeCharacters
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={t.search}
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <Box
                  component="span"
                  sx={{ display: "flex", alignItems: "center", mb: 1 }}
                >
                  <Image
                    src="/icons/search-yellow.svg"
                    alt="search-icon-input"
                    width={isMobile ? 20 : 35}
                    height={isMobile ? 20 : 35}
                  />
                </Box>
              ),
              endAdornment: (
                <>
                  {isFetching ? (
                    <CircularProgress
                      sx={{
                        color: "#FFD400",
                      }}
                      size={isMobile ? 15 : 20}
                    />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
            sx={{
              backgroundColor: "white",
              borderRadius: 2,
              "& .MuiOutlinedInput-root": {
                height: isMobile ? 35 : 55,
                paddingRight: `10px !important`,
                fontSize: isMobile ? "17px" : "20px",
                "& input": {
                  color: "#9CA3AF",
                  fontWeight: "600",
                  "&::placeholder": {
                    color: "#9CA3AF",
                    opacity: 1,
                    fontWeight: "600",
                  },
                },
                "& fieldset": {
                  border: "1px solid #D1D5DB",
                },
                "&:hover fieldset": {
                  border: "1px solid #FFD400",
                },
                "&.Mui-focused fieldset": {
                  border: "1px solid #FFD400",
                },
              },
              "& .MuiAutocomplete-endAdornment": {
                right: isRtl ? "auto" : 0,
                left: isRtl ? 0 : "auto",
                display: "none",
              },
            }}
          />
        )}
        slotProps={{
          paper: {
            sx: {
              "& .MuiAutocomplete-listbox .MuiAutocomplete-option": {
                borderBottom: "1px solid #E5E7EB",
                paddingY: "10px",
                fontWeight: "500",
              },
              "& .MuiAutocomplete-option:last-child": {
                borderBottom: "none",
              },
            },
          },
        }}
      />
    </Box>
  );
}

export default AutoCompleteInput;
