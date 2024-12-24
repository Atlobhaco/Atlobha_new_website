import React from "react";
import SharedTextField from "../shared/SharedTextField";

function InputAddRemove({ value, setValue, defaultValue }) {
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
        handleChange={(e) => {
          const inputValue = +e?.target?.value;
          setValue({
            ...value,
            quantity: inputValue,
          });
        }}
        handleBlur={(e) => {
          console.log("+e?.target?.value", +e?.target?.value);
          if (!+e?.target?.value || +e?.target?.value === 0) {
            setValue({
              ...value,
              quantity: 1,
              name: "",
            });
          }
        }}
        actionClickrightIcon={(e) => {
          // handle the zero to remove it
          if (+value?.quantity <= 1) {
            return setValue({
              ...value,
              quantity: 1,
              name: "",
            });
          }
          setValue({
            ...value,
            quantity: +value?.quantity - 1,
          });
        }}
        actionClickIcon={(e) => {
          setValue({
            ...value,
            quantity: +value?.quantity + 1,
          });
        }}
      />
    </div>
  );
}

export default InputAddRemove;
