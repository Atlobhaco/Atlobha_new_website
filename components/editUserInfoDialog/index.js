import React from "react";
import DialogCentered from "../DialogCentered";
import EditInfo from "@/pages/userProfile/editInfo";
import useLocalization from "@/config/hooks/useLocalization";

function EditUserInfoDialog({ openEditUserModal, setOpenEditUserModal }) {
  const { t } = useLocalization();

  return (
    <DialogCentered
      title={t.editInfo}
      subtitle={false}
      open={openEditUserModal}
      setOpen={setOpenEditUserModal}
      hasCloseIcon
      content={
        <EditInfo
          hideSomeComponent={true}
          setOpenEditUserModal={setOpenEditUserModal}
        />
      }
    />
  );
}

export default EditUserInfoDialog;
