import React from "react";
import { MenuItem, Select } from "@mui/material";
import { useThemeMode } from "../context/ThemeContext";

const PaginationChanger = ({ value, onChange }) => {
  const { theme } = useThemeMode();
  const isDark = theme === "dark";

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-theme-light-textPrimary transition-colors duration-200 dark:text-theme-dark-textPrimary sm:text-base">
        Rows per page:
      </span>
      <Select
        value={value}
        onChange={onChange}
        className="w-20 text-sm transition-colors duration-200 sm:w-24 sm:text-base"
        sx={{
          height: "32px",
          fontSize: "0.85rem",
          color: "var(--color-text-primary)",
          backgroundColor: "var(--color-bg-secondary)",
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-border)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-focus-border)",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--color-focus-border)",
          },
          "& .MuiSvgIcon-root": {
            color: "var(--color-text-secondary)",
          },
          "& .MuiSelect-select": {
            padding: "6px 24px 6px 8px",
          },
        }}
        MenuProps={{
          PaperProps: {
            sx: {
              backgroundColor: "var(--color-bg-secondary)",
              color: "var(--color-text-primary)",
              border: `1px solid ${isDark ? "#3A3A3A" : "#E5E7EB"}`,
            },
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
