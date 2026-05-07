// import React, { useEffect, useState } from "react";
// import Select from "react-select";
// import { getAllVehicleTypes } from "../../../Services/VehicleTypeApi";
// import LoaderBtn from "../../../compoents/LoderBtn";

// const VehicleTypeDropdown = ({ setSelectedOption, selectedOption, apiError = {}, vehicleType = "" }) => {
//     const [loading, setLoading] = useState(false);
//     const [options, setOptions] = useState([]);

//     useEffect(() => {
//         if (vehicleType) {
//             const selectedOption = options.find((option) => option.label === vehicleType)
//             setSelectedOption(selectedOption)
//         }
//     }, [vehicleType])

//     useEffect(() => {
//         const fetchVehicleType = async () => {
//             try {
//                 setLoading(true);
//                 const result = await getAllVehicleTypes({});
//                 if (result?.status) {
//                     const data = result.data ?? [];
//                     setOptions(data.map((item) => ({
//                         value: item._id,
//                         label: item.name,
//                     })));
//                 }
//             } catch (error) {
//                 console.log(error);
//             } finally {
//                 setLoading(false);
//             }

//         }
//         fetchVehicleType();
//     }, [])

//     return (<div style={{ width: "100%" }}> {loading ? <LoaderBtn />
//         : <Select
//             options={options}
//             isSearchable
//             value={selectedOption}
//             onChange={setSelectedOption}
//             placeholder="Select Vehicle-Type"
//             styles={{
//                 control: (base) => ({
//                     ...base,
//                     borderRadius: "0.75rem",
//                     borderColor: apiError.vehicleType ? "#ff6105ff" : "#c7c8c8ff",
//                     padding: "2px",
//                     height: "40px",
//                     fontSize: "14px",
//                     width: "100%",
//                     ":focus": {
//                         borderColor: "#c1ab87",
//                         boxShadow: "0 0 0 2px #c1ab87",
//                     },
//                 }),
//             }}
//         />
//     }

//     </div>)
// }

// export default VehicleTypeDropdown;

// VehicleTypeDropdown.jsx
import React from "react";
import Select from "react-select";

const VehicleTypeDropdown = ({
  selectedOption,
  setSelectedOption,
  options = [],           
  isDisabled = false,
  apiError = {},
  placeholder = "Select Vehicle Type",
  vehicleType = "",        
}) => {
  
  React.useEffect(() => {
    if (vehicleType && options.length > 0) {
      const found = options.find(opt => opt.label === vehicleType || opt.value === vehicleType);
      if (found) {
        setSelectedOption(found);
      }
    }
  }, [vehicleType, options, setSelectedOption]);

  return (
    <div style={{ width: "100%" }}>
      <Select
        options={options}
        isSearchable
        value={selectedOption}
        onChange={setSelectedOption}
        placeholder={placeholder}
        isDisabled={isDisabled}
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: "0.75rem",
            borderColor: apiError.vehicleType ? "#ff6105ff" : "#c7c8c8ff",
            padding: "2px",
            height: "40px",
            fontSize: "14px",
            width: "100%",
            ":focus": {
              borderColor: "#c1ab87",
              boxShadow: "0 0 0 2px #c1ab87",
            },
          }),
        }}
      />
    </div>
  );
};

export default VehicleTypeDropdown;