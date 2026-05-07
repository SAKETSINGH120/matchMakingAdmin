import React, { useState } from "react";

const SectionNameDropdowns = ({
  onSelect,
  sectionNames,
  initialSelectedValue = "",
}) => {
  const [selected, setSelected] = useState(initialSelectedValue);

  const handleSelect = (name) => {
    setSelected(name);
    onSelect(name);
  };

  return (
    <div className="absolute left-0 right-0 mt-1 bg-white border rounded shadow-lg z-50 animate-fade">
      {/* List */}
      <div className="max-h-56 overflow-y-auto">
        {sectionNames.length > 0 ? (
          sectionNames.map((name) => (
            <div
              key={name}
              onClick={() => handleSelect(name)}
              className={`p-2 cursor-pointer hover:bg-blue-100 ${
                selected === name ? "bg-blue-200" : ""
              }`}
            >
              {name}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-800 p-3">No results</p>
        )}
      </div>
    </div>
  );
};

export default SectionNameDropdowns;
