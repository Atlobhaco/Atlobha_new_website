import InputAddRemove from "@/components/InputAddRemove";
import ImageUploader from "@/components/shared/ImageUploader";
import SharedBtn from "@/components/shared/SharedBtn";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { fetchPartDetails } from "@/redux/reducers/addSparePartsReducer";
import { Box, CircularProgress } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function AddPartDialogContent({
  setOpenPricingDialog,
  addedPart,
  setAddedPart,
  defaultValue,
}) {
  const { t } = useLocalization();
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();

  const { brands } = useSelector((state) => state.lookups);
  const { selectedParts, isLoading } = useSelector(
    (state) => state.addSpareParts
  );

  const [searchFor, setSearchFor] = useState("");

  const header = {
    fontSize: "24px",
    fontWeight: "700",
    color: "black",
    mb: 2,
  };
  const subTitle = {
    fontSize: isMobile ? "16px" : "20px",
    fontWeight: "500",
    color: "#374151",
    mb: 2,
  };

  const handleChange = (e, newValue) => {
    setSearchFor(newValue?.id || "");
  };

  const handleImageUpload = (event) => {
    const file = event.currentTarget.files[0];

    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file?.type)) {
        toast.error(t.fileNotSupported);
        return;
      }
    }

    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file?.size > maxSize) {
      toast.error(t.fileSizeLarge);
      return;
    }

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      //   setUploadedImage(imageUrl);
      setAddedPart({
        ...addedPart,
        imgSrc: imageUrl,
        imgName: file?.name,
        imgFile: file,
      });
    }
  };

  const handleClearImage = () => {
    setAddedPart({
      ...addedPart,
      imgSrc: "",
      imgFile: "",
    });
  };

  const handleChangeInput = (e) => {
    const inputValue = +e?.target?.value;
    setAddedPart({
      ...addedPart,
      quantity: inputValue,
    });
  };

  const handleBlurInput = (e) => {
    if (!+e?.target?.value || +e?.target?.value === 0) {
      setAddedPart({
        ...addedPart,
        quantity: 1,
        name: "",
      });
    }
  };

  const deleteMinus = (e) => {
    // handle the zero to remove it
    if (+addedPart?.quantity <= 1) {
      return setAddedPart({
        ...addedPart,
        quantity: 1,
        name: "",
      });
    }
    setAddedPart({
      ...addedPart,
      quantity: +addedPart?.quantity - 1,
    });
  };

  const increaseValue = (e) => {
    setAddedPart({
      ...addedPart,
      quantity: +addedPart?.quantity + 1,
    });
  };
  return (
    <Box>
      <Box sx={header}>{t.addPartForPricing}</Box>
      <Box sx={subTitle}>{t.nameNumPrice}</Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "70%" }}>
          {/* <SharedAutoComplete
            label={null}
            handleChange={handleChange}
            error={false}
            value={searchFor || ""}
            showAstrick={false}
            items={[]}
          /> */}
          <input
            style={{
              background: "white",
              color: "black",
            }}
            type="text"
            className="input-text"
            value={addedPart?.name}
            onChange={(e) => {
              if (!e?.target?.value) {
                return setAddedPart({
                  ...addedPart,
                  id: null,
                  name: "",
                  quantity: 1,
                });
              }
              setAddedPart({
                ...addedPart,
                id: selectedParts?.length + 1,
                name: e?.target?.value,
              });
            }}
          />
        </Box>
        <Box sx={{ width: "25%" }}>
          <Box
            sx={{
              position: "relative",
            }}
          >
            <InputAddRemove
              defaultValue={defaultValue}
              value={addedPart}
              setValue={setAddedPart}
              handleChange={handleChangeInput}
              handleBlur={handleBlurInput}
              actionClickrightIcon={deleteMinus}
              actionClickIcon={increaseValue}
            />
            {addedPart?.name?.length < 3 ? (
              <Box
                sx={{
                  position: "absolute",
                  top: "0px",
                  width: "100%",
                  height: "100%",
                }}
              ></Box>
            ) : null}
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          mt: 4,
          width: isMobile ? "100%" : "70%",
        }}
      >
        <ImageUploader
          uploadedImage={addedPart?.imgSrc}
          handleImageUpload={handleImageUpload}
          handleClearImage={handleClearImage}
          placeholder={t.optionalUploadImg}
        />
      </Box>
      <Box
        sx={{
          mt: 4,
          width: isMobile ? "100%" : "70%",
        }}
      >
        <SharedBtn
          className="big-main-btn"
          customClass="w-100"
          text="addPart"
          compBeforeText={isLoading && <CircularProgress size={10} />}
          disabled={addedPart?.name?.length < 3 || +addedPart?.quantity === 0}
          onClick={() => {
            dispatch(fetchPartDetails(addedPart));
            setAddedPart(defaultValue);
            setOpenPricingDialog(false);
          }}
        />
      </Box>
    </Box>
  );
}

export default AddPartDialogContent;
