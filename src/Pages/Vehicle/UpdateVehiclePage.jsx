

// import { useState, useEffect } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import toast from "react-hot-toast";
// import Loader from "../../compoents/Loader";
// import Breaker from "../../compoents/Breaker";
// import CreateUpdateButton from "../../compoents/CreateButton";
// import { getVehicle, updateVehicle } from "../../Services/vehicleServices";
// import VehicleTypeDropdown from "./components/VehicleTypeDropdown";
// import { getAllCities } from "../../Services/CityApi";

// const UpdateVehiclePage = () => {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [loading, setLoading] = useState(false);
//     const [apiError, setApiError] = useState({});

//     const [formData, setFormData] = useState({
//         name: "",
//         description: "",
//         vehicleNumber: "",
//         status: "active",
//         color: "",
//         cityId: "",
//     });

//     const [cities, setCities] = useState([]);
//     const [loadingCities, setLoadingCities] = useState(true);

//     const [selectedVehicleTypeOption, setSelectedVehicleTypeOption] = useState(null);

//     // Fetch cities + vehicle data
//     useEffect(() => {
//         const fetchCities = async () => {
//             try {
//                 setLoadingCities(true);
//                 const res = await getAllCities({
//                     page: 1,
//                     rowsPerPage: 1000,
//                     searchQuery: "",
//                 });

//                 if (res.status && res.data) {
//                     setCities(res.data);
//                 } else {
//                     toast.error(res.message || "Failed to load cities");
//                 }
//             } catch (err) {
//                 toast.error("Error loading cities");
//                 console.error(err);
//             } finally {
//                 setLoadingCities(false);
//             }
//         };

//         const fetchVehicle = async () => {
//             try {
//                 setLoading(true);
//                 const res = await getVehicle(id);

//                 if (res?.status && res?.data) {
//                     const data = res.data;

//                     setFormData({
//                         name: data.name || "",
//                         description: data.description || "",
//                         vehicleNumber: data.vehicleNumber || "",
//                         status: data.status || "active",
//                         color: data.color || "",
//                         cityId: data.cityId || "",          // ← FIXED HERE (use cityId, not city)
//                     });

//                     // Pre-select vehicle type
//                     if (data.vehicleType) {
//                         setSelectedVehicleTypeOption({
//                             value: data.vehicleTypeId || data.vehicleType,  // prefer ID if available
//                             label: data.vehicleType || "Unknown",
//                         });
//                     }
//                 } else {
//                     toast.error("Failed to fetch vehicle details.");
//                     navigate("/home/vehicle");
//                 }
//             } catch (error) {
//                 console.error("Error fetching vehicle:", error);
//                 toast.error("Error fetching vehicle details.");
//                 navigate("/home/vehicle");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchCities();
//         fetchVehicle();
//     }, [id, navigate]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));

//         if (apiError[name]) {
//             setApiError((prev) => {
//                 const newErrors = { ...prev };
//                 delete newErrors[name];
//                 return newErrors;
//             });
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setApiError({});

//         const errors = {};
//         if (!formData.vehicleNumber.trim()) errors.vehicleNumber = "Vehicle Number is required.";
//         if (!selectedVehicleTypeOption) errors.vehicleType = "Vehicle Type is required.";
//         if (!formData.cityId) errors.cityId = "City is required.";

//         if (Object.keys(errors).length) {
//             setApiError(errors);
//             setLoading(false);
//             return;
//         }

//         const payload = {
//             ...formData,
//             vehicleNumber: formData.vehicleNumber.toUpperCase(),
//             vehicleTypeId: selectedVehicleTypeOption.value,
//             cityId: formData.cityId,
//         };

//         try {
//             const res = await updateVehicle({ id, data: payload });
//             if (res?.status) {
//                 toast.success("Vehicle updated successfully!");
//                 navigate(-1);
//             } else {
//                 const msg = res?.message || "Something went wrong!";
//                 toast.error(msg);
//             }
//         } catch (err) {
//             const msg = err?.message || "Server error occurred";
//             toast.error(msg);
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loadingCities) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <p className="text-lg font-medium text-gray-600">Loading cities...</p>
//             </div>
//         );
//     }

//     if (loading) return <Loader />;

//     return (
//         <div className="m-3">
//             <div className="mb-4">
//                 <Breaker />
//             </div>

//             <div className="ml-5 mt-10 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
//                 <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Vehicle</h2>

//                 <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Vehicle Name */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
//                         <input
//                             className="w-full h-10 border rounded-xl pl-4 border-gray-300 focus:outline-none focus:border-[#c1ab87] focus:ring-1 focus:ring-[#c1ab87]"
//                             type="text"
//                             name="name"
//                             placeholder="e.g. Toyota Innova"
//                             value={formData.name}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     {/* Vehicle Number */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Vehicle Number <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                             className={`w-full h-10 border rounded-xl pl-4 border-gray-300 focus:outline-none focus:border-[#c1ab87] focus:ring-1 focus:ring-[#c1ab87] ${apiError.vehicleNumber ? "border-red-500" : ""}`}
//                             type="text"
//                             name="vehicleNumber"
//                             placeholder="e.g. KA01AB1234"
//                             value={formData.vehicleNumber}
//                             onChange={handleChange}
//                             style={{ textTransform: 'uppercase' }}
//                         />
//                         {apiError.vehicleNumber && (
//                             <p className="text-red-500 text-xs mt-1">{apiError.vehicleNumber}</p>
//                         )}
//                     </div>

//                     {/* City */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             City <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                             name="cityId"
//                             value={formData.cityId}
//                             onChange={handleChange}
//                             className={`w-full h-10 border rounded-xl pl-4 border-gray-300 focus:outline-none focus:border-[#c1ab87] focus:ring-1 focus:ring-[#c1ab87] bg-white ${apiError.cityId ? "border-red-500" : ""}`}
//                         >
//                             <option value="">Select City</option>
//                             {cities.map((city) => (
//                                 <option key={city._id} value={city._id}>
//                                     {city.name}
//                                 </option>
//                             ))}
//                         </select>
//                         {apiError.cityId && (
//                             <p className="text-red-500 text-xs mt-1">{apiError.cityId}</p>
//                         )}
//                     </div>

//                     {/* Vehicle Type */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                             Vehicle Type <span className="text-red-500">*</span>
//                         </label>
//                         <VehicleTypeDropdown
//                             selectedOption={selectedVehicleTypeOption}
//                             setSelectedOption={setSelectedVehicleTypeOption}
//                         />
//                         {apiError.vehicleType && (
//                             <p className="text-red-500 text-xs mt-1">{apiError.vehicleType}</p>
//                         )}
//                     </div>

//                     {/* Color */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
//                         <input
//                             className="w-full h-10 border rounded-xl pl-4 border-gray-300 focus:outline-none focus:border-[#c1ab87] focus:ring-1 focus:ring-[#c1ab87]"
//                             type="text"
//                             name="color"
//                             placeholder="e.g. White"
//                             value={formData.color}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     {/* Status */}
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                         <select
//                             className="w-full h-10 border rounded-xl pl-4 border-gray-300 focus:outline-none focus:border-[#c1ab87] focus:ring-1 focus:ring-[#c1ab87] bg-white"
//                             name="status"
//                             value={formData.status}
//                             onChange={handleChange}
//                         >
//                             <option value="active">Active</option>
//                             <option value="inactive">Inactive</option>
//                         </select>
//                     </div>

//                     {/* Description */}
//                     <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                         <textarea
//                             className="w-full border rounded-xl p-4 border-gray-300 focus:outline-none focus:border-[#c1ab87] focus:ring-1 focus:ring-[#c1ab87] h-24 resize-none"
//                             name="description"
//                             placeholder="Enter vehicle description..."
//                             value={formData.description}
//                             onChange={handleChange}
//                         />
//                     </div>

//                     <div className="md:col-span-2">
//                         <CreateUpdateButton loading={loading} text={loading ? "Updating..." : "Update Vehicle"} />
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default UpdateVehiclePage;


import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../compoents/Loader";
import Breaker from "../../compoents/Breaker";
import CreateUpdateButton from "../../compoents/CreateButton";
import { getVehicle, updateVehicle, getVehicleTypes } from "../../Services/vehicleServices";
import VehicleTypeDropdown from "./components/VehicleTypeDropdown";
import { getAllCities } from "../../Services/CityApi";

const UpdateVehiclePage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState({});

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        vehicleNumber: "",
        status: "active",
        color: "",
        cityId: "",
        vehicleTypeId: "",   // ← added so we can keep the original type ID
    });

    const [cities, setCities] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [loadingCities, setLoadingCities] = useState(true);
    const [loadingVehicleTypes, setLoadingVehicleTypes] = useState(false);

    const [selectedVehicleTypeOption, setSelectedVehicleTypeOption] = useState(null);

    
    useEffect(() => {
        const fetchCities = async () => {
            try {
                setLoadingCities(true);
                const res = await getAllCities({
                    page: 1,
                    rowsPerPage: 1000,
                    searchQuery: "",
                });

                if (res.status && res.data) {
                    setCities(res.data);
                } else {
                    toast.error(res.message || "Failed to load cities");
                }
            } catch (err) {
                toast.error("Error loading cities");
                console.error(err);
            } finally {
                setLoadingCities(false);
            }
        };

        const fetchVehicle = async () => {
            try {
                setLoading(true);
                const res = await getVehicle(id);

                if (res?.status && res?.data) {
                    const data = res.data;
                    console.log(data.vehicleTypeId)

                    setFormData({
                        name: data.name || "",
                        description: data.description || "",
                        vehicleNumber: data.vehicleNumber || "",
                        status: data.status || "active",
                        color: data.color || "",
                        cityId: data.cityId?._id || data.cityId || "",
                        vehicleTypeId: data.vehicleTypeId || data.vehicleType?._id || "",  // ← 
                    });

                    // We will match it in the second useEffect after types are loaded
                } else {
                    toast.error("Failed to fetch vehicle details.");
                    navigate("/home/vehicle");
                }
            } catch (error) {
                console.error("Error fetching vehicle:", error);
                toast.error("Error fetching vehicle details.");
                navigate("/home/vehicle");
            } finally {
                setLoading(false);
            }
        };

        fetchCities();
        fetchVehicle();
    }, [id, navigate]);

   
    useEffect(() => {
        if (!formData.cityId) {
            setVehicleTypes([]);
            setSelectedVehicleTypeOption(null);
            return;
        }

        const fetchVehicleTypesForCity = async () => {
            setLoadingVehicleTypes(true);

            try {
                const res = await getVehicleTypes(formData.cityId);

                if (res.status && Array.isArray(res.data)) {
                    const options = res.data.map((vt) => ({
                        value: vt._id,
                        label: vt.name,
                    }));

                    setVehicleTypes(options);

                    // Use the original vehicleTypeId we loaded at mount
                    if (formData.vehicleTypeId) {
                        const matchingOption = options.find(
                            (opt) => opt.value === formData.vehicleTypeId
                        );
                        if (matchingOption) {
                            setSelectedVehicleTypeOption(matchingOption);
                        } else {
                            
                            setSelectedVehicleTypeOption(null);
                        }
                    }
                } else {
                    toast.error(res.message || "Failed to load vehicle types");
                    setVehicleTypes([]);
                }
            } catch (err) {
                toast.error(err.message || "Error loading vehicle types");
                setVehicleTypes([]);
                console.error(err);
            } finally {
                setLoadingVehicleTypes(false);
            }
        };

        fetchVehicleTypesForCity();
    }, [formData.cityId]);   

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (apiError[name]) {
            setApiError((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setApiError({});

        const errors = {};
        if (!formData.vehicleNumber.trim()) errors.vehicleNumber = "Vehicle Number is required.";
        if (!selectedVehicleTypeOption) errors.vehicleType = "Vehicle Type is required.";
        if (!formData.cityId) errors.cityId = "City is required.";

        if (Object.keys(errors).length) {
            setApiError(errors);
            setLoading(false);
            return;
        }

        const payload = {
            ...formData,
            vehicleNumber: formData.vehicleNumber.toUpperCase(),
            vehicleTypeId: selectedVehicleTypeOption.value,
            cityId: formData.cityId,
        };

        try {
            const res = await updateVehicle({ id, data: payload });
            if (res?.status) {
                toast.success("Vehicle updated successfully!");
                navigate(-1);
            } else {
                toast.error(res?.message || "Something went wrong!");
            }
        } catch (err) {
            toast.error(err?.message || "Server error occurred");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loadingCities) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg font-medium text-gray-600">Loading cities...</p>
            </div>
        );
    }

    if (loading) return <Loader />;

    return (
        <div className="m-3">
            <div className="mb-4">
                <Breaker />
            </div>

            <div className="ml-5 mt-10 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Update Vehicle</h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vehicle Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Name</label>
                        <input
                            className="w-full h-10 border rounded-xl pl-4 border-gray-300 focus:outline-none focus:border-[#c1ab87] focus:ring-1 focus:ring-[#c1ab87]"
                            type="text"
                            name="name"
                            placeholder="e.g. Toyota Innova"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Vehicle Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vehicle Number <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={`w-full h-10 border rounded-xl pl-4 border-gray-300 focus:outline-none focus:border-[#c1ab87] focus:ring-1 focus:ring-[#c1ab87] ${apiError.vehicleNumber ? "border-red-500" : ""}`}
                            type="text"
                            name="vehicleNumber"
                            placeholder="e.g. KA01AB1234"
                            value={formData.vehicleNumber}
                            onChange={handleChange}
                            style={{ textTransform: 'uppercase' }}
                        />
                        {apiError.vehicleNumber && (
                            <p className="text-red-500 text-xs mt-1">{apiError.vehicleNumber}</p>
                        )}
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            City <span className="text-red-500">*</span>
                        </label>
                        <select
                            name="cityId"
                            value={formData.cityId}
                            onChange={handleChange}
                            className={`w-full h-10 border rounded-xl pl-4 border-gray-300 focus:outline-none focus:border-[#c1ab87] focus:ring-1 focus:ring-[#c1ab87] bg-white ${apiError.cityId ? "border-red-500" : ""}`}
                        >
                            <option value="">Select City</option>
                            {cities.map((city) => (
                                <option key={city._id} value={city._id}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                        {apiError.cityId && (
                            <p className="text-red-500 text-xs mt-1">{apiError.cityId}</p>
                        )}
                    </div>

                    {/* Vehicle Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vehicle Type <span className="text-red-500">*</span>
                        </label>

                        {loadingVehicleTypes ? (
                            <div className="h-10 flex items-center pl-4 text-gray-500">
                                ...
                            </div>
                        ) : !formData.cityId ? (
                            <div className="h-10 flex items-center pl-4 text-gray-400 bg-gray-50 border border-gray-300 rounded-xl">
                                Select city first
                            </div>
                        ) : (
                            <VehicleTypeDropdown
                                selectedOption={selectedVehicleTypeOption}
                                setSelectedOption={setSelectedVehicleTypeOption}
                                options={vehicleTypes}
                                isDisabled={loadingVehicleTypes || !formData.cityId}
                                apiError={apiError}
                            />
                        )}

                        {apiError.vehicleType && (
                            <p className="text-red-500 text-xs mt-1">{apiError.vehicleType}</p>
                        )}
                    </div>

                    {/* Color */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
                        <input
                            className="w-full h-10 border rounded-xl pl-4 border-gray-300 focus:outline-none focus:border-[#c1ab87] focus:ring-1 focus:ring-[#c1ab87]"
                            type="text"
                            name="color"
                            placeholder="e.g. White"
                            value={formData.color}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            className="w-full h-10 border rounded-xl pl-4 border-gray-300 focus:outline-none focus:border-[#c1ab87] focus:ring-1 focus:ring-[#c1ab87] bg-white"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            className="w-full border rounded-xl p-4 border-gray-300 focus:outline-none focus:border-[#c1ab87] focus:ring-1 focus:ring-[#c1ab87] h-24 resize-none"
                            name="description"
                            placeholder="Enter vehicle description..."
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="md:col-span-2">
                        <CreateUpdateButton loading={loading} text={loading ? "Updating..." : "Update Vehicle"} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateVehiclePage;