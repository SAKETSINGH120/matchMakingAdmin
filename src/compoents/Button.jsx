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
    "px-4 py-2 group font-semibold rounded-lg shadow-md focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

  const variantStyles = {
    default:
      "bg-theme-light-primaryButton text-white hover:bg-theme-light-primaryHover focus:ring-2 focus:ring-theme-light-primaryButton/30 dark:bg-theme-dark-primaryButton dark:hover:bg-theme-dark-primaryHover dark:focus:ring-theme-dark-primaryButton/30",
    primary:
      "bg-theme-light-primaryButton text-white hover:bg-theme-light-primaryHover focus:ring-2 focus:ring-theme-light-primaryButton/30 dark:bg-theme-dark-primaryButton dark:hover:bg-theme-dark-primaryHover dark:focus:ring-theme-dark-primaryButton/30",
    secondary:
      "border border-theme-light-border bg-theme-light-surface text-theme-light-textPrimary hover:bg-theme-light-surfaceAlt focus:ring-2 focus:ring-theme-light-primaryButton/20 dark:border-theme-dark-border dark:bg-theme-dark-surface dark:text-theme-dark-textPrimary dark:hover:bg-theme-dark-inputBg dark:focus:ring-theme-dark-primaryButton/20",
    blue: "bg-blue-primary hover:bg-blue-400 focus:ring-2 focus:ring-blue-primary focus:ring-offset-2",
    green:
      "bg-custom-green hover:bg-custom-green/80 focus:ring-2 focus:ring-custom-green focus:ring-offset-2",
    gray: "bg-theme-light-surfaceAlt text-theme-light-textPrimary hover:bg-theme-light-border !shadow-sm focus:ring-2 focus:ring-theme-light-primaryButton/20 dark:bg-theme-dark-inputBg dark:!text-theme-dark-textPrimary dark:hover:bg-theme-dark-border dark:focus:ring-theme-dark-primaryButton/20",
    outline:
      "border border-theme-light-border bg-transparent !text-theme-light-textPrimary hover:bg-theme-light-surfaceAlt focus:ring-theme-light-primaryButton/20 dark:border-theme-dark-border dark:!text-theme-dark-textPrimary dark:hover:bg-theme-dark-inputBg",
    ghost:
      "bg-transparent text-theme-light-textPrimary hover:bg-theme-light-surfaceAlt focus:ring-theme-light-primaryButton/20 dark:text-theme-dark-textPrimary dark:hover:bg-theme-dark-inputBg",
    danger:
      "bg-theme-light-danger text-white hover:brightness-95 focus:ring-theme-light-danger/30 dark:bg-theme-dark-danger",
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
      className="theme-btn-danger flex cursor-pointer items-center justify-center px-4 py-3 font-medium"
      aria-label="Clear all filters"
    >
      <FiX size={18} />
    </button>
  );
};
