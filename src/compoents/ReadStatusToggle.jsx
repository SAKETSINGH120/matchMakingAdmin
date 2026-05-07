// components/ReadStatusToggle.jsx
import React, { useState } from "react";
import toast from "react-hot-toast";

const ReadStatusToggle = ({
  id,               
  initialIsRead,    
  updateApiFunction, 
  onSuccess,        
}) => {
  const [isRead, setIsRead] = useState(!!initialIsRead);
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    if (loading) return;

    const newValue = !isRead;

    // Optimistic UI update
    setIsRead(newValue);
    setLoading(true);

    try {
     
      await updateApiFunction(id, newValue);

      toast.success(`Marked as ${newValue ? "Read" : "Unread"}`);

      
      if (onSuccess) onSuccess();
    } catch (error) {
      
      setIsRead(!newValue);
      console.error("Read status update failed:", error);
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
        className={`w-11 h-6 rounded-full transition-colors duration-200 ease-in-out
          after:content-[''] after:absolute after:top-0.5 after:left-0.5 
          after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:duration-200
          ${isRead ? "bg-green-600" : "bg-red-500"}
          ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
          peer-checked:after:translate-x-full peer-focus:outline-none`}
      />
      <span className="ml-3 text-sm font-medium text-gray-700 select-none">
        {isRead ? "Read" : "Unread"}
      </span>
    </label>
  );
};

export default ReadStatusToggle;