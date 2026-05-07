import React from "react";
import { motion } from "framer-motion";

const AddButton = ({
  onClick,
  isLoading = false,
  btnName = "Add",
  className = "cursor-pointer",
}) => {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      data-aos="fade-left"
      className={`bg-[var(--primary-color)] text-white px-6 py-2.5 rounded-lg font-medium ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <LoderBtn />
          {btnName}
        </span>
      ) : (
        btnName
      )}
    </motion.button>
  );
};

export default AddButton;
