import GenericModal from "./GenericModal";

export default function DeleteConfirmModal({
  open,
  onClose,
  onConfirm,
  title = "Confirm Delete",
  message = "Are you sure you want to delete this item?",
}) {
  return (
    <GenericModal
      open={open}
      title={title}
      onClose={onClose}
      onOk={onConfirm}
      okText="Delete"
      cancelText="Cancel"
      footer={true}
      okType="danger"
    >
      <p>{message}</p>
    </GenericModal>
  );
}
