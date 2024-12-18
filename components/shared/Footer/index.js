import React from "react";
import style from "./Footer.module.scss";

function Footer() {
  return (
    <footer className={`${style["footer"]}`}>
      <div className="row">
        <div className={`${style["footer-links"]} "col-3"`}>first</div>
        <div className={`${style["footer-links"]} "col-3"`}>second</div>
        <div className={`${style["footer-links"]} "col-3"`}>third</div>
        <div className={`${style["footer-links"]} "col-3"`}>last</div>
      </div>
      <div className="row">
        <div className="col-6">first</div>
        <div className="col-6">second</div>
      </div>
    </footer>
  );
}

export default Footer;
