// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
// import Select from "react-select";
// import { toast } from "react-hot-toast";
// import { getAllLocations } from "../../Services/locationServices";
// import { getAllCities } from "../../Services/CityApi";
// import { motion } from "framer-motion";

// export default function RouteMapForm({ onSubmit, defaultValues }) {
//   const navigate = useNavigate();
//   const formRef = useRef(null);

//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//     reset,
//     trigger,
//     setValue,
//     watch,
//   } = useForm({
//     defaultValues: defaultValues || {
//       name: "",
//       cityId: "",
//       locations: [{ location: "", order: 1, distanceToNext: 0 }],
//       fullPrice: "",
//       totalDistance: "",
//       convienienceFee: "",
//       isActive: false,
//     },
//     mode: "onChange",
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "locations",
//   });

//   const [locationOptions, setLocationOptions] = useState([]);
//   const [cityOptions, setCityOptions] = useState([]);

//   // Fetch locations
//   useEffect(() => {
//     getAllLocations({ page: 1, limit: 1000 })
//       .then((res) => {
//         setLocationOptions(
//           res.data.data.map((loc) => ({
//             value: loc._id,
//             label: loc.name,
//           }))
//         );
//       })
//       .catch((err) => console.error("Failed to load locations:", err));
//   }, []);

//   // Fetch cities
//   useEffect(() => {
//     getAllCities({ page: 1, limit: 1000 })
//       .then((res) => {
//         console.log("res.data", res);
//         setCityOptions(
//           res.data.map((city) => ({
//             value: city._id,
//             label: city.name,
//           }))
//         );
//       })
//       .catch((err) => console.error("Failed to load cities:", err));
//   }, []);

//   // Reset form on defaultValues change (edit mode)
//   useEffect(() => {
//     if (defaultValues) {
//       reset(defaultValues);
//     }
//   }, [defaultValues, reset]);

//   // Ensure at least one location
//   useEffect(() => {
//     if (fields.length === 0) {
//       append({ location: "", order: 1, distanceToNext: 0 });
//     }
//   }, [fields.length, append]);

//   // Auto-scroll to first error
//   useEffect(() => {
//     if (Object.keys(errors).length > 0) {
//       const firstError = document.querySelector(
//         '[data-error="true"], .react-select-error, .error-border'
//       );
//       if (firstError && formRef.current) {
//         firstError.scrollIntoView({ behavior: "smooth", block: "center" });
//       }
//     }
//   }, [errors]);

//   const onFormSubmit = async (data) => {
//     try {
//       await onSubmit(data);
//       toast.success("Route saved successfully!");
//     } catch (err) {
//       toast.error("Failed to save route. Please check the form.");
//     }
//   };

//   const handleInvalidSubmit = () => {
//     toast.error("Please fill all required fields correctly");
//     trigger();
//   };

//   return (
//     <motion.form
//       ref={formRef}
//       onSubmit={handleSubmit(onFormSubmit, handleInvalidSubmit)}
//       className="space-y-8 bg-white rounded-2xl shadow-xl p-8 max-w-8xl mx-auto"
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.4 }}
//       noValidate
//     >
//       {/* Route Name & City - in one row */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <div>
//           <label className="block mb-2 font-medium text-gray-700">
//             Route Name <span className="text-red-500">*</span>
//           </label>
//           <input
//             {...register("name", { required: "Route name is required" })}
//             placeholder="Enter route name"
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${errors.name ? "border-red-500" : "border-gray-300"
//               }`}
//             data-error={!!errors.name}
//           />
//           {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
//         </div>

//         <div>
//           <label className="block mb-2 font-medium text-gray-700">
//             City <span className="text-red-500">*</span>
//           </label>
//           <Controller
//             control={control}
//             name="cityId"
//             rules={{ required: "City is required" }}
//             render={({ field, fieldState: { error } }) => (
//               <Select
//                 {...field}
//                 options={cityOptions}
//                 placeholder="Select city"
//                 isSearchable
//                 value={cityOptions.find((opt) => opt.value === field.value)}
//                 onChange={(val) => field.onChange(val?.value || "")}
//                 className={`react-select ${error ? "border-red-500" : ""}`}
//                 classNamePrefix="react-select"
//                 styles={{
//                   control: (base) => ({
//                     ...base,
//                     borderColor: error ? "#ef4444" : "#d1d5db",
//                     "&:hover": { borderColor: "#FB721D" },
//                   }),
//                 }}
//               />
//             )}
//           />
//           {errors.cityId && <p className="text-red-500 text-sm mt-1">{errors.cityId.message}</p>}
//         </div>
//       </div>

//       {/* Route Stops */}
//       <div className="space-y-4">
//         <h3 className="font-semibold text-lg text-gray-800">Route Stops</h3>

//         {fields.map((item, index) => (
//           <motion.div
//             key={item.id}
//             initial={{ opacity: 0, y: 10 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: index * 0.1 }}
//             className="border border-gray-200 rounded-xl p-6 bg-gray-50 space-y-6 shadow-sm hover:shadow-md transition-shadow relative"
//           >
//             {/* Location, Order, Distance - now in single row */}
//             <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
//               {/* Location - takes more space */}
//               <div className="md:col-span-6">
//                 <label className="block mb-2 font-medium text-gray-700">
//                   Location {index + 1} <span className="text-red-500">*</span>
//                 </label>
//                 <Controller
//                   control={control}
//                   name={`locations.${index}.location`}
//                   rules={{ required: "Please select a location" }}
//                   render={({ field, fieldState: { error } }) => (
//                     <div>
//                       <Select
//                         {...field}
//                         options={locationOptions}
//                         placeholder="Select Location"
//                         isSearchable
//                         value={locationOptions.find((opt) => opt.value === field.value)}
//                         onChange={(val) => field.onChange(val?.value || "")}
//                         className={`react-select ${error ? "border-red-500" : ""}`}
//                         classNamePrefix="react-select"
//                         styles={{
//                           control: (base) => ({
//                             ...base,
//                             borderColor: error ? "#ef4444" : "#d1d5db",
//                             "&:hover": { borderColor: "#FB721D" },
//                           }),
//                         }}
//                       />
//                       {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
//                     </div>
//                   )}
//                 />
//               </div>

//               {/* Order */}
//               <div className="md:col-span-3">
//                 <label className="block mb-2 font-medium text-gray-700">
//                   Order <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="number"
//                   {...register(`locations.${index}.order`, {
//                     required: "Order is required",
//                     valueAsNumber: true,
//                     min: { value: 1, message: "Order must be at least 1" },
//                   })}
//                   placeholder="Order"
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] text-center ${errors.locations?.[index]?.order ? "border-red-500" : "border-gray-300"
//                     }`}
//                 />
//                 {errors.locations?.[index]?.order && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.locations[index].order.message}
//                   </p>
//                 )}
//               </div>

//               {/* Distance to Next */}
//               <div className="md:col-span-3">
//                 <label className="block mb-2 font-medium text-gray-700">
//                   Distance to next (km)
//                 </label>
//                 <input
//                   type="number"
//                   step="0.1"
//                   {...register(`locations.${index}.distanceToNext`, {
//                     valueAsNumber: true,
//                     min: { value: 0, message: "Distance cannot be negative" },
//                   })}
//                   placeholder="Distance to next"
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.locations?.[index]?.distanceToNext ? "border-red-500" : "border-gray-300"
//                     }`}
//                 />
//                 {errors.locations?.[index]?.distanceToNext && (
//                   <p className="text-red-500 text-sm mt-1">
//                     {errors.locations[index].distanceToNext.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {fields.length > 1 && (
//               <button
//                 type="button"
//                 onClick={() => remove(index)}
//                 className="absolute top-4 right-4 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
//               >
//                 Remove
//               </button>
//             )}
//           </motion.div>
//         ))}

//         <button
//           type="button"
//           onClick={() =>
//             append({
//               location: "",
//               order: fields.length + 1,
//               distanceToNext: 0,
//             })
//           }
//           className="w-30 py-3 px-4 bg-[#FB721D] text-white rounded-lg hover:bg-[#e0631b] transition font-medium flex items-center justify-center gap-2 shadow-md cursor-pointer"
//         >
//           + Add Stop
//         </button>
//       </div>

//       {/* Pricing & Status */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         <div>
//           <label className="block mb-2 font-medium text-gray-700">
//             Full Price <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="number"
//             {...register("fullPrice", {
//               required: "Full price is required",
//               min: { value: 0, message: "Price cannot be negative" },
//             })}
//             placeholder="Full Price"
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.fullPrice ? "border-red-500" : "border-gray-300"
//               }`}
//           />
//           {errors.fullPrice && <p className="text-red-500 text-sm mt-1">{errors.fullPrice.message}</p>}
//         </div>

//         <div>
//           <label className="block mb-2 font-medium text-gray-700">
//             Total Distance (km) <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="number"
//             step="0.1"
//             {...register("totalDistance", {
//               required: "Total distance is required",
//               min: { value: 0, message: "Distance cannot be negative" },
//             })}
//             placeholder="Total Distance (km)"
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.totalDistance ? "border-red-500" : "border-gray-300"
//               }`}
//           />
//           {errors.totalDistance && <p className="text-red-500 text-sm mt-1">{errors.totalDistance.message}</p>}
//         </div>

//         <div>
//           <label className="block mb-2 font-medium text-gray-700">
//             Convenience Fee
//           </label>
//           <input
//             type="number"
//             step="0.1"
//             {...register("convienienceFee", {
//               min: { value: 0, message: "Fee cannot be negative" },
//             })}
//             placeholder="Convenience Fee"
//             className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.convienienceFee ? "border-red-500" : "border-gray-300"
//               }`}
//           />
//           {errors.convienienceFee && <p className="text-red-500 text-sm mt-1">{errors.convienienceFee.message}</p>}
//         </div>
//       </div>

//       <div className="flex items-center gap-3">
//         <input
//           type="checkbox"
//           {...register("isActive")}
//           className="h-5 w-5 text-[#FB721D] rounded"
//         />
//         <label className="font-medium text-gray-700">Active</label>
//       </div>

//       <button
//         type="submit"
//         className="w-100 py-3 px-4 bg-[#FB721D] text-white rounded-lg hover:bg-[#e0631b] transition font-medium mt-6 shadow-md hover:shadow-lg"
//       >
//         Save Route
//       </button>
//     </motion.form>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Select from "react-select";
import { toast } from "react-hot-toast";
// import { getAllLocations } from "../../Services/locationServices"; // you can remove if not used anymore
import { getAllCities } from "../../Services/CityApi";
import { getLocationByCity } from "../../Services/routeMapServices"; // ? import the function you showed
import { motion } from "framer-motion";

export default function RouteMapForm({ onSubmit, defaultValues }) {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    trigger,
    setValue,
    watch,
  } = useForm({
    defaultValues: defaultValues || {
      name: "",
      cityId: "",
      locations: [{ location: "", order: 1, distanceToNext: 0 }],
      fullPrice: "",
      totalDistance: "",
      convienienceFee: "",
      isActive: false,
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "locations",
  });

  const [locationOptions, setLocationOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const selectedCityId = watch("cityId");

  // Fetch cities (unchanged)
  useEffect(() => {
    getAllCities({ page: 1, limit: 1000 })
      .then((res) => {
        console.log("res.data", res);
        setCityOptions(
          res.data.map((city) => ({
            value: city._id,
            label: city.name,
          }))
        );
      })
      .catch((err) => console.error("Failed to load cities:", err));
  }, []);

  // Fetch locations **based on selected city**
  useEffect(() => {
    if (!selectedCityId) {
      setLocationOptions([]);
      // Optional: clear all location values when city changes / removed
      fields.forEach((_, index) => {
        setValue(`locations.${index}.location`, "");
      });
      return;
    }

    setLoadingLocations(true);
    getLocationByCity(selectedCityId)
      .then((result) => {
        // Adjust according to your actual API response structure
        // Assuming result.data is array or result is array — change as needed
        const locations = Array.isArray(result) ? result : result.data || [];

        setLocationOptions(
          locations.map((loc) => ({
            value: loc._id,
            label: loc.name,
          }))
        );
      })
      .catch((err) => {
        console.error("Failed to load locations for city:", err);
        toast.error("Could not load locations for this city");
        setLocationOptions([]);
      })
      .finally(() => {
        setLoadingLocations(false);
      });
  }, [selectedCityId, setValue, fields]);

  // Reset form on defaultValues change (edit mode)
  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  // Ensure at least one location
  useEffect(() => {
    if (fields.length === 0) {
      append({ location: "", order: 1, distanceToNext: 0 });
    }
  }, [fields.length, append]);

  // Auto-scroll to first error
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      const firstError = document.querySelector(
        '[data-error="true"], .react-select-error, .error-border'
      );
      if (firstError && formRef.current) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [errors]);

  const onFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      // toast.success("Route saved successfully!");
    } catch (err) {
      toast.error("Failed to save route. Please check the form.");
    }
  };

  const handleInvalidSubmit = () => {
    toast.error("Please fill all required fields correctly");
    trigger();
  };

  return (
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit(onFormSubmit, handleInvalidSubmit)}
      className="space-y-8 bg-white rounded-2xl shadow-xl p-8 max-w-8xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      noValidate
    >
      {/* Route Name & City - in one row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Route Name <span className="text-red-500">*</span>
          </label>
          <input
            {...register("name", { required: "Route name is required" })}
            placeholder="Enter route name"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${errors.name ? "border-red-500" : "border-gray-300"}`}
            data-error={!!errors.name}
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            City <span className="text-red-500">*</span>
          </label>
          <Controller
            control={control}
            name="cityId"
            rules={{ required: "City is required" }}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                options={cityOptions}
                placeholder="Select city"
                isSearchable
                value={cityOptions.find((opt) => opt.value === field.value)}
                onChange={(val) => field.onChange(val?.value || "")}
                className={`react-select ${error ? "border-red-500" : ""}`}
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: error ? "#ef4444" : "#d1d5db",
                    "&:hover": { borderColor: "#FB721D" },
                  }),
                }}
              />
            )}
          />
          {errors.cityId && <p className="text-red-500 text-sm mt-1">{errors.cityId.message}</p>}
        </div>
      </div>

      {/* Route Stops */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg text-gray-800">Route Stops</h3>
        {fields.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 rounded-xl p-6 bg-gray-50 space-y-6 shadow-sm hover:shadow-md transition-shadow relative"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
              {/* Location - takes more space */}
              <div className="md:col-span-6">
                <label className="block mb-2 font-medium text-gray-700">
                  Location {index + 1} <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name={`locations.${index}.location`}
                  rules={{ required: "Please select a location" }}
                  render={({ field, fieldState: { error } }) => (
                    <div>
                      <Select
                        {...field}
                        options={locationOptions}
                        placeholder={
                          !selectedCityId
                            ? "Select a city first..."
                            : loadingLocations
                            ? "Loading locations..."
                            : "Select Location"
                        }
                        isSearchable
                        isDisabled={!selectedCityId || loadingLocations}
                        value={locationOptions.find((opt) => opt.value === field.value) || null}
                        onChange={(val) => field.onChange(val?.value || "")}
                        className={`react-select ${error ? "border-red-500" : ""}`}
                        classNamePrefix="react-select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderColor: error ? "#ef4444" : "#d1d5db",
                            backgroundColor: !selectedCityId ? "#f3f4f6" : "white",
                            cursor: !selectedCityId ? "not-allowed" : "pointer",
                            "&:hover": {
                              borderColor: selectedCityId ? "#FB721D" : "#d1d5db",
                            },
                          }),
                          placeholder: (base) => ({
                            ...base,
                            color: !selectedCityId ? "#9ca3af" : "#6b7280",
                          }),
                        }}
                      />
                      {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
                    </div>
                  )}
                />
              </div>

              {/* Order */}
              <div className="md:col-span-3">
                <label className="block mb-2 font-medium text-gray-700">
                  Order <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  {...register(`locations.${index}.order`, {
                    required: "Order is required",
                    valueAsNumber: true,
                    min: { value: 1, message: "Order must be at least 1" },
                  })}
                  placeholder="Order"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] text-center ${errors.locations?.[index]?.order ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.locations?.[index]?.order && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.locations[index].order.message}
                  </p>
                )}
              </div>

              {/* Distance to Next */}
              <div className="md:col-span-3">
                <label className="block mb-2 font-medium text-gray-700">
                  Distance to next (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register(`locations.${index}.distanceToNext`, {
                    valueAsNumber: true,
                    min: { value: 0, message: "Distance cannot be negative" },
                  })}
                  placeholder="Distance to next"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.locations?.[index]?.distanceToNext ? "border-red-500" : "border-gray-300"}`}
                />
                {errors.locations?.[index]?.distanceToNext && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.locations[index].distanceToNext.message}
                  </p>
                )}
              </div>
            </div>

            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
              >
                Remove
              </button>
            )}
          </motion.div>
        ))}

        <button
          type="button"
          onClick={() =>
            append({
              location: "",
              order: fields.length + 1,
              distanceToNext: 0,
            })
          }
          className="w-30 py-3 px-4 bg-[#FB721D] text-white rounded-lg hover:bg-[#e0631b] transition font-medium flex items-center justify-center gap-2 shadow-md cursor-pointer"
        >
          + Add Stop
        </button>
      </div>

      {/* Pricing & Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Full Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            {...register("fullPrice", {
              required: "Full price is required",
              min: { value: 0, message: "Price cannot be negative" },
            })}
            placeholder="Full Price"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.fullPrice ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.fullPrice && <p className="text-red-500 text-sm mt-1">{errors.fullPrice.message}</p>}
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Total Distance (km) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.1"
            {...register("totalDistance", {
              required: "Total distance is required",
              min: { value: 0, message: "Distance cannot be negative" },
            })}
            placeholder="Total Distance (km)"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.totalDistance ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.totalDistance && <p className="text-red-500 text-sm mt-1">{errors.totalDistance.message}</p>}
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Convenience Fee
          </label>
          <input
            type="number"
            step="0.1"
            {...register("convienienceFee", {
              min: { value: 0, message: "Fee cannot be negative" },
            })}
            placeholder="Convenience Fee"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.convienienceFee ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.convienienceFee && <p className="text-red-500 text-sm mt-1">{errors.convienienceFee.message}</p>}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          {...register("isActive")}
          className="h-5 w-5 text-[#FB721D] rounded"
        />
        <label className="font-medium text-gray-700">Active</label>
      </div>

      <button
        type="submit"
        className="w-100 py-3 px-4 bg-[#FB721D] text-white rounded-lg hover:bg-[#e0631b] transition font-medium mt-6 shadow-md hover:shadow-lg"
      >
        Save Route
      </button>
    </motion.form>
  );
}