// // src/components/Toggle.jsx
// import React from "react";
// import PropTypes from "prop-types";

// const Toggle = ({
//   checked,              // boolean – current value
//   onChange,             // function – called when toggled (newValue) => {}
//   disabled = false,
//   size = "default",     // "small" | "default"
//   labelTrue = "Active", // text shown when checked=true
//   labelFalse = "Inactive",
//   colorTrue = "green",  // "green" | "red" | "blue" etc.
//   colorFalse = "gray",
//   showLabel = true,     // whether to show text label next to toggle
//   className = "",
//   loading = false,      // optional – shows spinner/lower opacity when true
// }) => {
//   const trackColor = checked
//     ? `bg-${colorTrue}-600`
//     : `bg-${colorFalse}-400`;

//   const thumbTranslate = checked ? "translate-x-5" : "translate-x-0";

//   const sizeClasses = {
//     small: "w-9 h-5 after:h-4 after:w-4 after:translate-x-4",
//     default: "w-11 h-6 after:h-5 after:w-5 after:translate-x-5",
//   }[size];

//   return (
//     <div className={`flex items-center gap-2.5 ${className}`}>
//       <label
//         className={`relative inline-flex items-center cursor-pointer ${
//           disabled || loading ? "cursor-not-allowed opacity-70" : ""
//         }`}
//       >
//         <input
//           type="checkbox"
//           className="sr-only peer"
//           checked={checked}
//           onChange={(e) => onChange?.(e.target.checked)}
//           disabled={disabled || loading}
//         />

//         {/* Track */}
//         <div
//           className={`
//             ${sizeClasses}
//             rounded-full transition-all duration-300 ease-in-out
//             peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-offset-1 peer-focus:ring-orange-300
//             after:content-[''] after:absolute after:top-[2px] after:left-[2px]
//             after:bg-white after:border after:border-gray-300 after:rounded-full
//             after:transition-all after:duration-200
//             peer-checked:after:${thumbTranslate}
//             ${trackColor}
//           `}
//         />
//       </label>

//       {showLabel && (
//         <span
//           className={`
//             text-sm font-medium whitespace-nowrap select-none
//             ${checked ? `text-${colorTrue}-700` : `text-${colorFalse}-700`}
//           `}
//         >
//           {checked ? labelTrue : labelFalse}
//         </span>
//       )}

//       {loading && (
//         <span className="text-xs text-gray-500 ml-1">updating...</span>
//       )}
//     </div>
//   );
// };

// Toggle.propTypes = {
//   checked: PropTypes.bool.isRequired,
//   onChange: PropTypes.func.isRequired,
//   disabled: PropTypes.bool,
//   loading: PropTypes.bool,
//   size: PropTypes.oneOf(["small", "default"]),
//   labelTrue: PropTypes.string,
//   labelFalse: PropTypes.string,
//   colorTrue: PropTypes.string,
//   colorFalse: PropTypes.string,
//   showLabel: PropTypes.bool,
//   className: PropTypes.string,
// };

// export default Toggle;


// src/components/Toggle.jsx
import React from "react";
import PropTypes from "prop-types";

const Toggle = ({
  checked,
  onChange,
  disabled = false,
  size = "default",
  labelTrue = "Active",
  labelFalse = "Inactive",
  colorTrue = "green",
  colorFalse = "gray",
  showLabel = true,
  className = "",
  loading = false,
}) => {

  /* ✅ Tailwind-safe color maps (UI only) */
  const trackMap = {
    green: "bg-green-600",
    red: "bg-red-600",
    blue: "bg-blue-600",
    gray: "bg-gray-300",
  };

  const textMap = {
    green: "text-green-700",
    red: "text-red-700",
    blue: "text-blue-700",
    gray: "text-gray-600",
  };

  const trackColor = checked
    ? trackMap[colorTrue]
    : trackMap[colorFalse];

  const textColor = checked
    ? textMap[colorTrue]
    : textMap[colorFalse];

  const sizeClasses = {
    small: "w-9 h-5 after:h-4 after:w-4",
    default: "w-11 h-6 after:h-5 after:w-5",
  }[size];

  const thumbTranslate =
    size === "small"
      ? checked
        ? "after:translate-x-4"
        : "after:translate-x-0"
      : checked
      ? "after:translate-x-5"
      : "after:translate-x-0";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <label
        className={`relative inline-flex items-center ${
          disabled || loading ? "cursor-not-allowed opacity-70" : "cursor-pointer"
        }`}
      >
        <input
          type="checkbox"
          className="sr-only peer"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          disabled={disabled || loading}
        />

        {/* Track */}
        <div
          className={`
            ${sizeClasses}
            ${trackColor}
            relative rounded-full
            transition-all duration-300 ease-in-out

            peer-focus:ring-2 peer-focus:ring-orange-300 peer-focus:ring-offset-1

            after:content-['']
            after:absolute after:top-[2px] after:left-[2px]
            after:rounded-full
            after:bg-white
            after:shadow-md
            after:transition-all after:duration-300

            ${thumbTranslate}
          `}
        />
      </label>

      {showLabel && (
        <span
          className={`
            text-sm font-medium whitespace-nowrap select-none
            ${textColor}
          `}
        >
          {checked ? labelTrue : labelFalse}
        </span>
      )}

      {loading && (
        <span className="text-xs text-gray-500 ml-1">updating...</span>
      )}
    </div>
  );
};

Toggle.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  size: PropTypes.oneOf(["small", "default"]),
  labelTrue: PropTypes.string,
  labelFalse: PropTypes.string,
  colorTrue: PropTypes.string,
  colorFalse: PropTypes.string,
  showLabel: PropTypes.bool,
  className: PropTypes.string,
};

export default Toggle;
