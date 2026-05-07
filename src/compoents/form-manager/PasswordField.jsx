import { useCallback, useState } from "react";
import { FiEye, FiEyeOff, FiLock } from "react-icons/fi";

export const PasswordField = ({
  id,
  className,
  placeholder,
  required,
  register,
  fieldName,
  isEditingDisable,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = useCallback(() => {
    setShowPassword((preValue) => !preValue);
  }, []);

  return (
    <div className="relative">
      <FiLock
        className={`absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500`}
      />
      <input
        id={id}
        type={showPassword ? "text" : "password"}
        className={`${className} w-full rounded-md py-2 pl-10 pr-10 dark:disabled:text-white`}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        disabled={isEditingDisable}
        {...register(fieldName)}
      />
      {showPassword ? (
        <FiEyeOff
          className={`absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-500`}
          onClick={toggleShowPassword}
        />
      ) : (
        <FiEye
          className={`absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 cursor-pointer text-gray-500`}
          onClick={toggleShowPassword}
        />
      )}
    </div>
  );
};
