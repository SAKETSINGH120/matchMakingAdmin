import React from "react";
import { MenuItem, Select } from "@mui/material";

const PaginationChanger = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-700 text-sm sm:text-base">Rows per page:</span>
      <Select
        value={value}
        onChange={onChange}
        className="w-20 sm:w-24 text-sm sm:text-base"
        sx={{
          height: "32px",
          fontSize: "0.85rem",
          "& .MuiSelect-select": {
            padding: "6px 24px 6px 8px",
          },
        }}
        aria-label="Select rows per page"
      >
        {[7, 10, 20, 50].map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

export default PaginationChanger;
