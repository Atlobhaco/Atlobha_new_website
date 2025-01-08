import BreadCrumb from "@/components/BreadCrumb";
import React from "react";
import UserProfile from "..";

function EditInfo() {
  return (
    <div className="container-fluid">
      <div className="row mb-2">
        <div className="col-md-4">
          <UserProfile />
        </div>
        <div className="col-md-8 col-12 pt-4">
          <div className="row">
            <BreadCrumb />
          </div>

          <h1 className="text-center pt-5 mt-5">in progress</h1>
        </div>
        <div></div>
      </div>
    </div>
  );
}

export default EditInfo;
