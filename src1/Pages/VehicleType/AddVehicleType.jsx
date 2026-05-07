// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Breaker from "../../compoents/Breaker"; // Fix typo if needed in your project
// import { createVehicleType } from "../../Services/VehicleTypeApi"; // Adjust path if needed
// import Loader from "../../compoents/Loader";
// import toast from "react-hot-toast";

// const AddVehicleType = () => {
//     const [formData, setFormData] = useState({
//         name: "",
//         seatingCapacity: "",
//     });
//     const [apiMessage, setApiMessage] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [apiError, setApiError] = useState({});
//     const navigate = useNavigate();

//     const handleChange = (e) => {
//         const { name, value } = e.target;

//         setFormData({ ...formData, [name]: value });

//         // Clear the error for this field as soon as user starts typing
//         if (apiError[name]) {
//             setApiError({ ...apiError, [name]: undefined }); // or delete it
//             // Better: create a new object without the error
//             const newErrors = { ...apiError };
//             delete newErrors[name];
//             setApiError(newErrors);
//         }
//     };
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setApiError({});
//         setApiMessage("");

//         const errors = {};

//         if (!formData.name.trim()) {
//             errors.name = "Vehicle type name is required.";
//         }

//         if (!formData.seatingCapacity) {
//             errors.seatingCapacity = "Seating capacity is required.";
//         } else if (isNaN(formData.seatingCapacity) || formData.seatingCapacity <= 0) {
//             errors.seatingCapacity = "Seating capacity must be a positive number.";
//         }

//         if (Object.keys(errors).length > 0) {
//             setApiError(errors);
//             setLoading(false);
//             return;
//         }

//         const payload = {
//             name: formData.name.trim(),
//             seatingCapacity: Number(formData.seatingCapacity),
//         };

//         console.log("Payload prepared:", payload);

//         try {
//             await createVehicleType(payload);

//             toast.success("Vehicle type created successfully!");
//             navigate(-1); // Go back to the vehicle type list page
//         } catch (error) {
//             const errorMessage = error?.message || "Failed to create vehicle type.";
//             console.error("Error creating vehicle type:", error);
//             toast.error(errorMessage);
//             setApiMessage(errorMessage);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) return <Loader />;

//     return (
//         <div className="m-3">
//             <div className="mb-4">
//                 <Breaker />
//             </div>
//             <div className="ml-5 mt-8 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
//                 <h2 className="text-2xl font-semibold mb-6 ml-2">Add New Vehicle Type</h2>
//                 <form onSubmit={handleSubmit}>
//                     {/* Vehicle Type Name */}
//                     <label className="ml-2 font-normal block">
//                         Vehicle Type Name:<span className="text-red-500 ml-1">*</span>
//                     </label>
//                     <input
//                         className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
//                         type="text"
//                         name="name"
//                         placeholder="e.g., Sedan, SUV, Minibus"
//                         value={formData.name}
//                         onChange={handleChange}
//                     />
//                     {apiError.name && (
//                         <p className="text-red-500 text-sm ml-2">{apiError.name}</p>
//                     )}

//                     {/* Seating Capacity */}
//                     <label className="ml-2 font-normal block mt-4">
//                         Seating Capacity:<span className="text-red-500 ml-1">*</span>
//                     </label>
//                     <input
//                         className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
//                         type="number"
//                         name="seatingCapacity"
//                         placeholder="e.g., 4"
//                         min="1"
//                         value={formData.seatingCapacity}
//                         onChange={handleChange}
//                     />
//                     {apiError.seatingCapacity && (
//                         <p className="text-red-500 text-sm ml-2">{apiError.seatingCapacity}</p>
//                     )}

//                     {/* API Error Message */}
//                     {apiMessage && (
//                         <p className="text-red-500 text-sm ml-2 mt-4">{apiMessage}</p>
//                     )}

//                     {/* Submit Button */}
//                     <button
//                         type="submit"
//                         disabled={loading}
//                         className="w-full bg-[#FB721D] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl font-medium"
//                     >
//                         {loading ? "Creating..." : "Create Vehicle Type"}
//                     </button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddVehicleType;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import { createVehicleType } from "../../Services/VehicleTypeApi";
import { getAllCities } from "../../Services/CityApi";
import Loader from "../../compoents/Loader";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const AddVehicleType = () => {
    const [formData, setFormData] = useState({
        name: "",
        seatingCapacity: "",
        cityId: "",
    });
    const [cities, setCities] = useState([]);
    const [apiMessage, setApiMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [loadingCities, setLoadingCities] = useState(true);
    const [apiError, setApiError] = useState({});
    const navigate = useNavigate();

    // Fetch cities on mount
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error on change
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
            cityId: formData.cityId
        };

        setLoading(true);

        try {
            await createVehicleType(payload);
            toast.success("Vehicle type created successfully!");
            navigate(-1);
        } catch (error) {
            const errorMessage = error?.message || "Failed to create vehicle type.";
            console.error("Error creating vehicle type:", error);
            toast.error(errorMessage);
            setApiMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading || loadingCities) return <Loader />;

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
                            Add New Vehicle Type
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
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${apiError.cityId ? "border-red-500" : "border-gray-300"
                                            }`}
                                    >
                                        <option value="" disabled>Select a city</option>
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
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${apiError.name ? "border-red-500" : "border-gray-300"
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
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${apiError.seatingCapacity ? "border-red-500" : "border-gray-300"
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

                            {/* Submit Button - full width, small height */}
                            <div className="pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-60 py-3 px-3 rounded-xl text-white font-bold text-md transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg cursor-pointer ${loading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-[#FB721D] hover:bg-[#e0631b]"
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create Vehicle Type"
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

export default AddVehicleType;