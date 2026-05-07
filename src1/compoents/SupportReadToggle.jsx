import React, { useState } from "react";
import { updateSupportReadStatus } from "../Services/SupportApi";
import toast from "react-hot-toast";

const SupportReadToggle = ({ Id, initialIsRead, onSuccess }) => {
  const [isRead, setIsRead] = useState(initialIsRead);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;

    const newValue = !isRead;
    setLoading(true);
    setIsRead(newValue); // Optimistic update

    try {
      await updateSupportReadStatus(Id, newValue);
      toast.success(`Marked as ${newValue ? "Read" : "Unread"}`);
      if (onSuccess) onSuccess(); // Optional: refresh table
    } catch (error) {
      setIsRead(!newValue); // Revert on error
      toast.error("Failed to update read status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={isRead}
        onChange={handleToggle}
        disabled={loading}
        className="sr-only peer"
      />
      <div
        className={`w-11 h-6 rounded-full peer transition-colors
          after:content-[''] after:absolute after:top-0.5 after:left-0.5 
          after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
          ${isRead ? "bg-green-600" : "bg-red-500"}
          ${loading ? "opacity-70" : ""}
          peer-checked:after:translate-x-full`}
      ></div>
      <span className="ml-3 text-sm font-medium text-gray-700">
        {isRead ? "Read" : "Unread"}
      </span>
    </label>
  );
};

export default SupportReadToggle;