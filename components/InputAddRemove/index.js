import React from "react";
import SharedTextField from "../shared/SharedTextField";

function InputAddRemove({
  value = {},
  setValue = () => {},
  defaultValue = {},
  handleChange = () => {},
  handleBlur = () => {},
  actionClickrightIcon = () => {},
  actionClickIcon = () => {},
  disabled = false,
  customHeight = false,
}) {
  return (
    <div>
      <SharedTextField
        id="addRemoveField"
        label={false}
        hasMargin={false}
        plusMinusInput={true}
        imgIcon="/icons/plus.svg"
        toolTipTitle={false}
        value={+value?.quantity}
        rightIcon="/icons/minus.svg"
        handleChange={handleChange}
        handleBlur={handleBlur}
        actionClickrightIcon={actionClickrightIcon}
        actionClickIcon={actionClickIcon}
        customPadding="0px 3px"
        disabled={disabled}
        customHeight={customHeight}
      />
    </div>
  );
}

export default InputAddRemove;
