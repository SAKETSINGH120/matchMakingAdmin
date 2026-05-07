import React from "react";

const ToggleSwitchWithLabel = ({
  isActive,
  onToggle,
  disabled = false,
}) => {
  return (
    <div className="flex items-center gap-3">
      
      <label
        className={`relative inline-flex items-center ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
      >
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isActive}
          onChange={onToggle}
          disabled={disabled}
        />

        {/* Track */}
        <div
          className={`
            w-11 h-6 rounded-full
            transition-all duration-300 ease-in-out
            ${isActive ? "bg-green-600" : "bg-gray-300"}
            peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-300
            after:content-['']
            after:absolute after:top-[2px] after:left-[2px]
            after:h-5 after:w-5
            after:bg-white after:border after:border-gray-300
            after:rounded-full after:transition-all
            peer-checked:after:translate-x-5
            ${disabled ? "opacity-60" : ""}
          `}
        />
      </label>

     
      <span
        className={`
          text-sm font-medium whitespace-nowrap
          ${isActive ? "text-green-700" : "text-gray-600"}
          ${disabled ? "opacity-60" : ""}
        `}
      >
        {isActive ? "active" : "inactive"}
      </span>
    </div>
  );
};

export default ToggleSwitchWithLabel;
