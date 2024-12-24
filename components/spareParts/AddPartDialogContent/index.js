import InputAddRemove from "@/components/InputAddRemove";
import SharedAutoComplete from "@/components/SharedAutoComplete";
import ImageUploader from "@/components/shared/ImageUploader";
import SharedBtn from "@/components/shared/SharedBtn";
import SharedDropDown from "@/components/shared/SharedDropDown";
import SharedTextField from "@/components/shared/SharedTextField";
import useLocalization from "@/config/hooks/useLocalization";
import useScreenSize from "@/constants/screenSize/useScreenSize";
import { setSelectedSparePart } from "@/redux/reducers/addSparePartsReducer";
import { Autocomplete, Box, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

function AddPartDialogContent() {
  const { t } = useLocalization();
  const dispatch = useDispatch();
  const { isMobile } = useScreenSize();

  const { brands } = useSelector((state) => state.lookups);
  const { selectedParts } = useSelector((state) => state.addSpareParts);

  const defaultValue = {
    quantity: 1,
    imgSrc: "",
    id: null,
    name: "",
  };
  const [searchFor, setSearchFor] = useState("");
  const [addedPart, setAddedPart] = useState(defaultValue);

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
    console.log("newValue", newValue);
    setSearchFor(newValue?.id || "");
  };

  const handleImageUpload = (event) => {
    const file = event.currentTarget.files[0];

    if (file) {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error(t.fileNotSupported);
        return;
      }
    }

    const maxSize = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > maxSize) {
      toast.error(t.fileSizeLarge);
      return;
    }

    if (file) {
      const imageUrl = URL.createObjectURL(file);
      //   setUploadedImage(imageUrl);
      setAddedPart({
        ...addedPart,
        imgSrc: imageUrl,
      });
      console.log("Uploaded Image:", file);
    }
  };

  const handleClearImage = () => {
    setAddedPart({
      ...addedPart,
      imgSrc: "",
    });
  };

  console.log("selectedParts", selectedParts);

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
          {addedPart?.name?.length >= 3 ? (
            <InputAddRemove
              defaultValue={defaultValue}
              value={addedPart}
              setValue={setAddedPart}
              handleChange={handleChangeInput}
              handleBlur={handleBlurInput}
              actionClickrightIcon={deleteMinus}
              actionClickIcon={increaseValue}
            />
          ) : null}
        </Box>
      </Box>
      <Box sx={{ mt: 4 }}>
        <ImageUploader
          uploadedImage={addedPart?.imgSrc}
          handleImageUpload={handleImageUpload}
          handleClearImage={handleClearImage}
          placeholder={t.optionalUploadImg}
        />
      </Box>
      <Box sx={{ mt: 4 }}>
        <SharedBtn
          className="big-main-btn"
          customClass="w-100"
          text="addPart"
          disabled={addedPart?.name?.length < 3 || +addedPart?.quantity === 0}
          onClick={() => {
            dispatch(
              setSelectedSparePart({
                data: addedPart,
              })
            );
            setAddedPart(defaultValue);
          }}
        />
      </Box>
    </Box>
  );
}

export default AddPartDialogContent;
