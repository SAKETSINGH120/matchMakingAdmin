// // src/Pages/VehicleType/UpdateVehicleType.jsx
// import React, { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import Breaker from "../../compoents/Breaker";
// import { getVehicleTypeById, updateVehicleType } from "../../Services/VehicleTypeApi";
// import { getAllCities } from "../../Services/CityApi";
// import Loader from "../../compoents/Loader";
// import toast from "react-hot-toast";

// const UpdateVehicleType = () => {
//   const { id } = useParams(); // Get vehicle type ID from URL
//   const [formData, setFormData] = useState({
//     name: "",
//     seatingCapacity: "",
//     cityId: "",
//   });
//   const [cities, setCities] = useState([]);
//   const [apiMessage, setApiMessage] = useState("");
//   const [loading, setLoading] = useState(false); // For submit button
//   const [fetchLoading, setFetchLoading] = useState(true); // For initial data fetch
//   const [loadingCities, setLoadingCities] = useState(true);
//   const [apiError, setApiError] = useState({});
//   const navigate = useNavigate();

//   // Fetch cities on mount
//   useEffect(() => {
//     const fetchCities = async () => {
//       try {
//         setLoadingCities(true);
//         const res = await getAllCities({
//           page: 1,
//           rowsPerPage: 100,
//           searchQuery: "",
//         });
//         if (res.status && res.data) {
//           setCities(res.data);
//         } else {
//           toast.error(res.message || "Failed to fetch cities");
//         }
//       } catch (error) {
//         toast.error(error.message || "Error fetching cities");
//       } finally {
//         setLoadingCities(false);
//       }
//     };
//     fetchCities();
//   }, []);

//   // Fetch existing vehicle type data when component mounts
//   useEffect(() => {
//     const fetchVehicleType = async () => {
//       if (!id) {
//         toast.error("Vehicle Type ID is missing");
//         navigate(-1);
//         return;
//       }

//       try {
//         setFetchLoading(true);
//         const res = await getVehicleTypeById(id);

//         // Assuming API returns { data: { _id, name, seatingCapacity, ... } }
//         const vehicleType = res.data || res;

//         if (vehicleType && vehicleType.name && vehicleType.seatingCapacity !== undefined) {
//           setFormData({
//             name: vehicleType.name || "",
//             seatingCapacity: vehicleType.seatingCapacity || "",
//             cityId: vehicleType.cityId?._id || vehicleType.cityId || "",
//           });
//         } else {
//           toast.error("Vehicle type data not found");
//           navigate(-1);
//         }
//       } catch (error) {
//         const errorMessage = error?.message || "Failed to fetch vehicle type";
//         toast.error(errorMessage);
//         setApiMessage(errorMessage);
//       } finally {
//         setFetchLoading(false);
//       }
//     };

//     fetchVehicleType();
//   }, [id, navigate]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });

//     // Clear field-specific error when user types
//     if (apiError[name]) {
//       setApiError({ ...apiError, [name]: undefined });
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setApiError({});
//     setApiMessage("");

//     const errors = {};

//     if (!formData.name.trim()) {
//       errors.name = "Vehicle type name is required.";
//     }

//     if (!formData.cityId) {
//       errors.cityId = "City is required.";
//     }

//     if (!formData.seatingCapacity) {
//       errors.seatingCapacity = "Seating capacity is required.";
//     } else if (isNaN(formData.seatingCapacity) || formData.seatingCapacity <= 0) {
//       errors.seatingCapacity = "Seating capacity must be a positive number.";
//     }

//     if (Object.keys(errors).length > 0) {
//       setApiError(errors);
//       setLoading(false);
//       return;
//     }

//     const payload = {
//       name: formData.name.trim(),
//       seatingCapacity: Number(formData.seatingCapacity),
//       cityId: formData.cityId
//     };

//     try {
//       await updateVehicleType(id, payload);

//       toast.success("Vehicle type updated successfully!");
//       navigate(-1); // Go back to the list page
//     } catch (error) {
//       const errorMessage = error?.message || "Failed to update vehicle type";
//       console.error("Error updating vehicle type:", error);
//       toast.error(errorMessage);
//       setApiMessage(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Show full-screen loader while fetching data
//   if (fetchLoading || loadingCities) return <Loader />;

//   return (
//     <div className="m-3">
//       <div className="mb-4">
//         <Breaker />
//       </div>

//       <div className="ml-5 mt-8 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
//         <h2 className="text-2xl font-semibold mb-6 ml-2">Update Vehicle Type</h2>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {/* Vehicle Type Name */}
//             <div>
//               <label className="ml-2 font-normal block">
//                 Vehicle Type Name:<span className="text-red-500 ml-1">*</span>
//               </label>
//               <input
//                 className="w-full h-11 border rounded-xl pl-4 border-gray-400 focus:ring-2 focus:ring-[#FB721D]"
//                 type="text"
//                 name="name"
//                 placeholder="e.g., Sedan, SUV, Minibus"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//               {apiError.name && (
//                 <p className="text-red-500 text-sm ml-2 mt-1">{apiError.name}</p>
//               )}
//             </div>

//             {/* Seating Capacity */}
//             <div>
//               <label className="ml-2 font-normal block">
//                 Seating Capacity:<span className="text-red-500 ml-1">*</span>
//               </label>
//               <input
//                 className="w-full h-11 border rounded-xl pl-4 border-gray-400 focus:ring-2 focus:ring-[#FB721D]"
//                 type="number"
//                 name="seatingCapacity"
//                 placeholder="e.g., 4"
//                 min="1"
//                 value={formData.seatingCapacity}
//                 onChange={handleChange}
//               />
//               {apiError.seatingCapacity && (
//                 <p className="text-red-500 text-sm ml-2 mt-1">{apiError.seatingCapacity}</p>
//               )}
//             </div>

//             {/* Select City */}
//             <div>
//               <label className="ml-2 font-normal block">
//                 Select City:<span className="text-red-500 ml-1">*</span>
//               </label>
//               <select
//                 name="cityId"
//                 value={formData.cityId}
//                 onChange={handleChange}
//                 className="w-full h-11 border rounded-xl pl-4 border-gray-400 focus:ring-2 focus:ring-[#FB721D]"
//               >
//                 <option value="" disabled>Select a city</option>
//                 {cities.map((city) => (
//                   <option key={city._id} value={city._id}>
//                     {city.name}
//                   </option>
//                 ))}
//               </select>
//               {apiError.cityId && (
//                 <p className="text-red-500 text-sm ml-2 mt-1">{apiError.cityId}</p>
//               )}
//             </div>
//           </div>

//           {/* General API Error */}
//           {apiMessage && (
//             <p className="text-red-500 text-sm ml-2 mt-4">{apiMessage}</p>
//           )}

//           {/* Submit Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full bg-[#FB721D] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl font-medium"
//           >
//             {loading ? "Updating..." : "Update Vehicle Type"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateVehicleType;

// src/Pages/VehicleType/UpdateVehicleType.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import { getVehicleTypeById, updateVehicleType } from "../../Services/VehicleTypeApi";
import { getAllCities } from "../../Services/CityApi";
import Loader from "../../compoents/Loader";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const UpdateVehicleType = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    seatingCapacity: "",
    cityId: "",
  });
  const [cities, setCities] = useState([]);
  const [apiMessage, setApiMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loadingCities, setLoadingCities] = useState(true);
  const [apiError, setApiError] = useState({});
  const navigate = useNavigate();

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const res = await getAllCities({
          page: 1,
          rowsPerPage: 100,
          searchQuery: "",
        });
        if (res.status && res.data) {
          setCities(res.data);
        } else {
          toast.error(res.message || "Failed to fetch cities");
        }
      } catch (error) {
        toast.error(error.message || "Error fetching cities");
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  // Fetch vehicle type data
  useEffect(() => {
    const fetchVehicleType = async () => {
      if (!id) {
        toast.error("Vehicle Type ID is missing");
        navigate(-1);
        return;
      }

      try {
        setFetchLoading(true);
        const res = await getVehicleTypeById(id);
        const vehicleType = res.data || res;

        if (vehicleType && vehicleType.name !== undefined) {
          setFormData({
            name: vehicleType.name || "",
            seatingCapacity: vehicleType.seatingCapacity?.toString() || "",
            cityId: vehicleType.cityId?._id || vehicleType.cityId || "",
          });
        } else {
          toast.error("Vehicle type data not found");
          navigate(-1);
        }
      } catch (error) {
        const errorMessage = error?.message || "Failed to fetch vehicle type";
        toast.error(errorMessage);
        setApiMessage(errorMessage);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchVehicleType();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (apiError[name]) {
      const newErrors = { ...apiError };
      delete newErrors[name];
      setApiError(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError({});
    setApiMessage("");

    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Vehicle type name is required.";
    }

    if (!formData.cityId) {
      errors.cityId = "City is required.";
    }

    if (!formData.seatingCapacity) {
      errors.seatingCapacity = "Seating capacity is required.";
    } else if (isNaN(formData.seatingCapacity) || Number(formData.seatingCapacity) <= 0) {
      errors.seatingCapacity = "Seating capacity must be a positive number.";
    }

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      seatingCapacity: Number(formData.seatingCapacity),
      cityId: formData.cityId,
    };

    setLoading(true);

    try {
      await updateVehicleType(id, payload);
      toast.success("Vehicle type updated successfully!");
      navigate(-1);
    } catch (error) {
      const errorMessage = error?.message || "Failed to update vehicle type.";
      console.error("Error updating vehicle type:", error);
      toast.error(errorMessage);
      setApiMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading || loadingCities) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <Breaker title="Vehicle Management" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="p-3 md:p-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Update Vehicle Type
            </h1>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Name, Seating Capacity & City - in one row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* City Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select City <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="cityId"
                    value={formData.cityId}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${
                      apiError.cityId ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="" disabled>
                      Select a city
                    </option>
                    {cities.map((city) => (
                      <option key={city._id} value={city._id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {apiError.cityId && (
                    <p className="text-red-500 text-sm mt-1">{apiError.cityId}</p>
                  )}
                </div>

                {/* Vehicle Type Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Sedan, SUV, Minibus"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${
                      apiError.name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {apiError.name && (
                    <p className="text-red-500 text-sm mt-1">{apiError.name}</p>
                  )}
                </div>

                {/* Seating Capacity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Seating Capacity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="seatingCapacity"
                    value={formData.seatingCapacity}
                    onChange={handleChange}
                    placeholder="e.g., 4"
                    min="1"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${
                      apiError.seatingCapacity ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {apiError.seatingCapacity && (
                    <p className="text-red-500 text-sm mt-1">{apiError.seatingCapacity}</p>
                  )}
                </div>
              </div>

              {/* API Error Message */}
              {apiMessage && (
                <p className="text-red-500 text-sm text-center">{apiMessage}</p>
              )}

              {/* Submit Button */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-60 py-3 px-3 rounded-xl text-white font-bold text-md transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg cursor-pointer ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-[#FB721D] hover:bg-[#e0631b]"
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Vehicle Type"
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UpdateVehicleType;