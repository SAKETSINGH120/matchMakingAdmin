import React, { useEffect, useRef, useState } from "react";
import { FaSortDown, FaSortUp } from "react-icons/fa";

export const defaultOptions = ["default", "asc", "desc"];

const SortingDropdown = ({
  title,
  options = [],
  onClick,
  defaultSelected = "default",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [selectedOption, setSelectedOption] = useState(defaultSelected);

  useEffect(() => {
    const handleClick = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setIsModalOpen(false);
      }
    };

    document.addEventListener("click", handleClick);

    return () => document.removeEventListener("click", handleClick);
  }, []);

  const handleOnClick = (option) => {
    setSelectedOption(option);
    setIsModalOpen(false);
    onClick(option);
  };

  return (
    <div className="flex gap-x-2" ref={dropdownRef}>
      <span>{title}</span>
      <div className="relative">
        <button
          className="border-none outline-none cursor-pointer w-full"
          role="button"
          onClick={() => setIsModalOpen(!isModalOpen)}
        >
          <FaSortDown />
        </button>
        {isModalOpen && (
          <div className="mt-1 z-50 absolute min-w-32 bg-white text-sm rounded-md border text-gray-600">
            <div className="flex flex-col">
              {options.map((option) => (
                <span
                  className={`py-1 px-2 inline-block hover:bg-gray-100 cursor-pointer ${
                    option === selectedOption && "bg-blue-200"
                  }`}
                  role="button"
                  onClick={() => handleOnClick(option)}
                >
                  {option}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SortingDropdown;
