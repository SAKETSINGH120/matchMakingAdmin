import React from "react";
import UpdateRole from "../UpdateRole";

const UpdateRoleModal = ({ onClose, onSubmit }) => {
  return (
    <GenericModal open title={"Update Role"} onClose={onClose} onOk={onSubmit}>
      <UpdateRole />
    </GenericModal>
  );
};

export default UpdateRoleModal;
