import { FiLoader, FiX } from "react-icons/fi";
import { VariantType } from "../constants/btnVariantType";

export const Button = ({
  children,
  variant = VariantType.DEFAULT,
  isLoading = false,
  className,
  loadingText,
  ref,
  size = "md",
  ...rest
}) => {
  const baseStyles =
    "px-4 py-2 group text-white font-semibold rounded-lg shadow-md focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed dark:shadow-lg disabled:pointer-events-none";

  const variantStyles = {
    default:
      "bg-gradient-to-r from-theme-color/50 to-theme-color bg-clip-text !text-transparent !shadow-custom hover:!shadow-custom-light focus:ring-2 focus:ring-offset-2 focus:ring-theme-color/75",
    primary:
      "bg-theme-color/80 hover:bg-theme-color focus:ring-offset-2 focus:ring-2 focus:ring-light-theme-color",
    secondary:
      "bg-gradient-to-r from-light-theme-color/80 via-light-theme-color to-theme-color hover:from-theme-color hover:via-light-theme-color hover:to-light-theme-color/80 focus:ring-2 focus:ring-offset-2 focus:ring-light-theme-color",
    blue: "bg-blue-primary hover:bg-blue-400 focus:ring-2 focus:ring-blue-primary focus:ring-offset-2",
    green:
      "bg-custom-green hover:bg-custom-green/80 focus:ring-2 focus:ring-custom-green focus:ring-offset-2",
    gray: "bg-gray-300 dark:bg-gray-500 dark:!text-gray-100 hover:bg-gray-300 !text-gray-800 !shadow-sm focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:hover:bg-gray-600",
    outline:
      "border border-gray-300 bg-transparent !text-dark/90 hover:bg-gray-50 focus:ring-light-gray-90 dark:border-light-gray dark:!text-gray-200 dark:hover:bg-dark/90",
    ghost:
      "bg-transparent text-dark/80 hover:bg-gray-100 focus:ring-light-gray/90 dark:text-gray-200 dark:hover:bg-dark/90",
    danger:
      "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-800",
  };

  const sizeClasses = {
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${className} ${sizeClasses[size]}`}
      disabled={isLoading || rest.disabled}
      ref={ref}
      {...rest}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <FiLoader className="mr-2 h-5 w-5 animate-spin text-white" />
          {loadingText ?? "Loading..."}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export const ClearBtn = ({ handleClear }) => {
  return (
    <button
      onClick={handleClear}
      className="flex items-center cursor-pointer justify-center text-white bg-red-500  px-4 py-3 rounded-lg font-medium"
      aria-label="Clear all filters"
    >
      <FiX size={18} />
    </button>
  );
};
