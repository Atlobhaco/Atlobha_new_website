import style from "./SharedBtn.module.scss";
import React from "react";
import useLocalization from "@/config/hooks/useLocalization";

function resolveNestedKey(obj, key) {
  return key.split(".").reduce((acc, part) => acc && acc[part], obj);
}

function SharedBtn({
  className = "primary",
  text = "info",
  onClick = () => {},
  customClass = "",
  disabled = false,
  compBeforeText,
  comAfterText,
  type = "button",
  customStyle = null,
  id = "",
  replaceText = false,
}) {
  const { t } = useLocalization();
  const localizedText = text && (resolveNestedKey(t, text) || text);

  return (
    <button
      id={id}
      style={customStyle}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`btn ${style[className]} ${customClass}`}
    >
      {compBeforeText} {replaceText || localizedText} {comAfterText}
    </button>
  );
}

export default SharedBtn;
