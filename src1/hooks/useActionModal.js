import { useState } from "react";

export function useActionModal() {
  const [action, setAction] = useState(null);
  const [data, setData] = useState(null);

  const openModal = (type, payload = null) => {
    setAction(type);
    setData(payload);
  };

  const closeModal = () => {
    setAction(null);
    setData(null);
  };

  return { action, data, openModal, closeModal };
}
