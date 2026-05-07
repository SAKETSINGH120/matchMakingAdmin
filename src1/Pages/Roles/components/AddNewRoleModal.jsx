import React from "react";
import GenericModal from "../../../compoents/GenericModal";
import CreateRole from "../CreateRole";

const AddNewRoleModal = ({ onClose, onSubmit }) => {
  return (
    <GenericModal open title={"Add Role"} onClose={onClose} onOk={onSubmit}>
      <CreateRole />
    </GenericModal>
  );
};

export default AddNewRoleModal;
