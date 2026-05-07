import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export default function MobileField({
  countryCode,
  phone,
  handleUpdateMobileField,
  disabled = false,
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (value, data) => {
    handleUpdateMobileField(
      `+${data.dialCode}`,
      value.replace(data.dialCode, "")
    );
  };

  return (
    <div style={{ maxWidth: "100%" }}>
      <PhoneInput
        country={"in"}
        value={`+${countryCode}${phone}`}
        onChange={handleChange}
        enableSearch={true}
        inputStyle={{
          width: "100%",
          paddingLeft: "50px",
          height: "40px",
          border: "1px solid #6a7282",
          borderRadius: "0.75rem",
        }}
        buttonStyle={{
          border: "1px solid #6a7282",
          background: "#fff",
          borderRadius: "0.75rem",
          borderTopRightRadius: "0",
          borderBottomRightRadius: "0",
        }}
        containerStyle={
          isFocused
            ? { border: "2px solid #2563eb", borderRadius: "0.75rem" }
            : {}
        }
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
      />
    </div>
  );
}
