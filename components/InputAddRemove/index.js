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
}) {
  return (
    <div>
      <SharedTextField
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
      />
    </div>
  );
}

export default InputAddRemove;
