import { Modal } from "antd";

export default function GenericModal({
  open,
  title,
  onClose,
  onOk,
  okText = "Save",
  cancelText = "Cancel",
  width = 600,
  loading = false,
  children,
  footer = true,
  okType = "danger",
}) {
  return (
    <Modal
      open={open}
      title={title}
      onCancel={onClose}
      onOk={onOk}
      okText={okText}
      cancelText={cancelText}
      confirmLoading={loading}
      width={width}
      footer={footer}
      okType={okType}
    >
      {children}
    </Modal>
  );
}
