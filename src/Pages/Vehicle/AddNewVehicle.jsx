

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import Loader from "../../compoents/Loader";
// import Breaker from "../../compoents/Breaker";
// import CreateUpdateButton from "../../compoents/CreateButton";
// import { createVehicle } from "../../Services/vehicleServices";
// import VehicleTypeDropdown from "./components/VehicleTypeDropdown";
// import { getAllCities } from "../../Services/CityApi";   // ← import this

// const AddNewVehicle = () => {
//     const navigate = useNavigate();

//     const [formData, setFormData] = useState({
//         name: "",
//         description: "",
//         vehicleNumber: "",
//         status: "active",
//         color: "",
//         cityId: "",           // ← NEW
//     });

//     const [cities, setCities] = useState([]);
//     const [loadingCities, setLoadingCities] = useState(true);
//     const [loading, setLoading] = useState(false);
//     const [apiError, setApiError] = useState({});

//     const [selectedVehicleTypeOption, setSelectedVehicleTypeOption] = useState(null);

//     // Fetch cities once on mount
//     useEffect(() => {
//         const fetchCities = async () => {
//             try {
//                 setLoadingCities(true);
//                 const res = await getAllCities({
//                     page: 1,
//                     rowsPerPage: 1000,     // adjust if you have many cities
//                     searchQuery: "",
//                 });

//                 if (res.status && res.data) {
//                     setCities(res.data);   // assuming res.data is array of cities
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

//         fetchCities();
//     }, []);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));

//         // Clear error when user types/selects
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
//         if (!formData.cityId) errors.cityId = "City is required.";           // ← added

//         if (Object.keys(errors).length) {
//             setApiError(errors);
//             setLoading(false);
//             return;
//         }

//         const payload = {
//             ...formData,
//             vehicleNumber: formData.vehicleNumber.toUpperCase(),
//             vehicleTypeId: selectedVehicleTypeOption.value,
//             cityId: formData.cityId,                                 // ← added
//         };

//         try {
//             const res = await createVehicle(payload);
//             if (res?.status) {
//                 toast.success("Vehicle created successfully!");
//                 navigate(-1);
//             } else {
//                 toast.error(res?.message || "Something went wrong!");
//             }
//         } catch (err) {
//             toast.error(err?.message || "Server error occurred");
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
//                 <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Vehicle</h2>

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

//                     {/* City - NEW FIELD */}
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

//                     {/* City - NEW FIELD
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
//                     </div> */}

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
//                         <CreateUpdateButton loading={loading} text={loading ? "Creating..." : "Create Vehicle"} />
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddNewVehicle;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../compoents/Loader";
import Breaker from "../../compoents/Breaker";
import CreateUpdateButton from "../../compoents/CreateButton";
import { createVehicle } from "../../Services/vehicleServices";
import VehicleTypeDropdown from "./components/VehicleTypeDropdown";
import { getAllCities } from "../../Services/CityApi";
import { getVehicleTypes } from "../../Services/vehicleServices";

const AddNewVehicle = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        vehicleNumber: "",
        status: "active",
        color: "",
        cityId: "",
    });

    const [cities, setCities] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [loadingCities, setLoadingCities] = useState(true);
    const [loadingVehicleTypes, setLoadingVehicleTypes] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState({});

    const [selectedVehicleTypeOption, setSelectedVehicleTypeOption] = useState(null);

    // Fetch all cities once on mount
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

        fetchCities();
    }, []);

    // Fetch vehicle types when cityId changes
    useEffect(() => {
        if (!formData.cityId) {
            setVehicleTypes([]);
            setSelectedVehicleTypeOption(null);
            return;
        }

        const fetchVehicleTypesForCity = async () => {
            setLoadingVehicleTypes(true);
            setSelectedVehicleTypeOption(null);

            try {
                const res = await getVehicleTypes(formData.cityId);
                console.log(res.data);
                console.log(formData.cityId);

                if (res.status && Array.isArray(res.data)) {
                    const options = res.data.map((vt) => ({
                        value: vt._id,
                        label: vt.name,
                    }));

                    setVehicleTypes(options);
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

        if (Object.keys(errors).length > 0) {
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
            const res = await createVehicle(payload);
            if (res?.status) {
                toast.success("Vehicle created successfully!");
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
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Add New Vehicle</h2>

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

                    {/* Vehicle Type - disabled until city is selected */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Vehicle Type <span className="text-red-500">*</span>
                        </label>

                        {loadingVehicleTypes ? (
                            <div className="h-10 flex items-center pl-4 text-gray-500">
                                Loading vehicle types...
                            </div>
                        ) : !formData.cityId ? (
                            <div
                                className="
                                                h-10 flex items-center justify-between pl-4 pr-4 
                                                text-gray-400 bg-gray-50 
                                                border border-gray-300 rounded-xl 
                                                cursor-not-allowed group
                                                hover:bg-gray-100 hover:border-gray-400
                                                transition-colors duration-150
                                            "
                            >
                                Select city first

                                {/* Icon hidden by default, shown on hover */}
                                <svg
                                    className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-gray-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                                </svg>
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
                        <CreateUpdateButton loading={loading} text={loading ? "Creating..." : "Create Vehicle"} />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewVehicle;