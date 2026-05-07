import React from "react";
import Select from "react-select";

export default function MultiSelector({
  placeholder,
  selectedOptions,
  setSelectedOptions,
  options,
}) {
  return (
    <div style={{ width: "100%" }}>
      <Select
        options={options}
        isMulti
        isSearchable
        value={selectedOptions}
        onChange={setSelectedOptions}
        placeholder={placeholder ?? "Select options"}
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "0.75rem",
            borderColor: "#6a7282",
            padding: "2px",
          }),
        }}
      />
    </div>
  );
}
