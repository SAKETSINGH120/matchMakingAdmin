import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { countriesCodeAndNameDetails } from "../../constants/countriesCodeAndNameDetails";

const usePhoneInput = (countryAndMobileNumberRef) => {
  const [countryAndMobileCode, setCountryAndMobileCode] = useState({
    countryCode: "91",
    countryFlag: "IN",
  });
  const [isCountriesDropdownOpen, setIsCountriesDropdownOpen] = useState(false);

  const handleOnCountryChange = (country) => {
    setCountryAndMobileCode({
      countryFlag: country.isoCode2,
      countryCode: country.countryCodes[0],
    });
    setIsCountriesDropdownOpen(false);
    countryAndMobileNumberRef.current = {
      countryCode: country.isoCode2,
      mobileNumberCode: country.countryCodes[0],
    };
  };

  return {
    handleOnCountryChange,
    isCountriesDropdownOpen,
    countryAndMobileCode,
    setIsCountriesDropdownOpen,
  };
};

const PhoneInput = ({
  countryAndMobileNumberRef,
  fieldName,
  register,
  id,
  placeholder,
  className,
  required,
  isEditingDisable,
}) => {
  const {
    handleOnCountryChange,
    isCountriesDropdownOpen,
    countryAndMobileCode,
    setIsCountriesDropdownOpen,
  } = usePhoneInput(countryAndMobileNumberRef);

  return (
    <div className="w-full">
      <div className="dark:focus-within::shadow-lg group flex w-full items-center">
        <div className="relative w-28">
          <button
            type="button"
            onClick={() => setIsCountriesDropdownOpen((preValue) => !preValue)}
            className={`flex w-full items-center justify-center rounded-l-md border border-r-0 border-solid border-gray-sm bg-gray-50 px-3 py-2.5 text-gray-500 transition-all duration-200 hover:bg-gray-100 focus:outline-none disabled:pointer-events-none group-focus-within:ring-2 group-focus-within:ring-blue-primary`}
            disabled={isEditingDisable}
          >
            <img
              src={`/dashboard/assets/flags/${countryAndMobileCode.countryFlag}.svg`}
              alt="country flag"
              loading="lazy"
              className="mr-1.5 h-4 w-full"
            />
            <span className="mr-0.5 font-medium">
              +{countryAndMobileCode.countryCode}
            </span>
            <span>
              {isCountriesDropdownOpen ? (
                <FiChevronUp className="h-4 w-4" />
              ) : (
                <FiChevronDown className="h-4 w-4" />
              )}
            </span>
          </button>
          {isCountriesDropdownOpen && (
            <div className="absolute left-0 z-10 mt-1 max-h-60 w-56 overflow-auto rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
              {countriesCodeAndNameDetails.map((country) => (
                <button
                  type="button"
                  key={country.country}
                  className="flex w-full items-center gap-x-2 px-2 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => handleOnCountryChange(country)}
                >
                  <img
                    src={`/dashboard/assets/images/flags/${country.isoCode2}.svg`}
                    alt="country flag"
                    loading="lazy"
                    className="h-3"
                  />
                  <span>+{country.countryCodes[0]}</span>
                  <span>{country.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <input
          id={id}
          type="number"
          min={1}
          className={`${className} w-[calc(100%-112px)] flex-shrink-0 flex-grow rounded-r-md border border-gray-sm px-4 py-2.5 text-dark outline-none transition-all duration-200 focus:outline-none group-focus-within:ring-2 group-focus-within:ring-blue-primary dark:disabled:text-white`}
          placeholder={placeholder}
          {...register(fieldName)}
          maxLength={15}
          required={required}
          autoComplete="off"
          disabled={isEditingDisable}
        />
      </div>
    </div>
  );
};

export default PhoneInput;
