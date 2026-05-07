

// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { getPackageById, updatePackage } from "../../Services/PackageApi";
// import { getAllCities } from "../../Services/CityApi";
// import { getLocationByCity } from "../../Services/LocationByCity";
// import toast from "react-hot-toast";
// import Breaker from "../../compoents/Breaker";
// import { motion } from "framer-motion";
// import Loader from "../../compoents/Loader";
// import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
// import Select from "react-select";
// import { getAllLocations } from "../../Services/locationServices";
// import { Upload, X, ImagePlus } from "lucide-react";

// const BASE_URL = import.meta.env.VITE_BASE_URL;

// const tagOptions = [
//   { value: "popular", label: "Popular" },
//   { value: "new", label: "New" },
//   { value: "family", label: "Family" },
//   { value: "adventure", label: "Adventure" },
//   { value: "budget", label: "Budget" },
//   { value: "luxury", label: "Luxury" },
// ];

// export default function UpdatePackage() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [defaultValues, setDefaultValues] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [fetchError, setFetchError] = useState(null);
//   const [cities, setCities] = useState([]);
//   const [locationOptions, setLocationOptions] = useState([]);
//   const [accumulatedBannerFiles, setAccumulatedBannerFiles] = useState([]);
//   const [bannerPreviews, setBannerPreviews] = useState([]);
//   const [primaryPreview, setPrimaryPreview] = useState(null);
//   const [packageLoaded, setPackageLoaded] = useState(false);

//   const methods = useForm({
//     defaultValues: {
//       primaryBanner: null,
//       bannerImages: null,
//       name: "",
//       packageDetails: "",
//       baseFair: "",
//       totalDistance: "",
//       convienienceFee: "",
//       maxMember: "",
//       status: "active",
//       timeDuration: "",
//       tag: [],
//       locations: [{ location: "", order: 1, distanceToNext: 0 }],
//       cityId: "",
//     },
//     mode: "onChange",
//   });

//   const {
//     register,
//     handleSubmit,
//     control,
//     setValue,
//     watch,
//     formState: { errors, isSubmitting },
//   } = methods;

//   const reset = methods.reset;

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "locations",
//   });

//   const primaryFile = watch("primaryBanner");
//   const bannerFiles = watch("bannerImages");
//   const selectedCityId = useWatch({ control, name: "cityId" });

//   // Fetch cities
//   useEffect(() => {
//     const fetchCities = async () => {
//       try {
//         const res = await getAllCities({
//           page: 1,
//           rowsPerPage: 999,
//           searchQuery: "",
//         });
//         if (res.status && res.data) {
//           setCities(res.data);
//         } else {
//           toast.error("Failed to load cities");
//         }
//       } catch (err) {
//         toast.error("Error loading cities");
//       }
//     };
//     fetchCities();
//   }, []);

//   // Fetch locations based on selected city
//   useEffect(() => {
//     if (!selectedCityId) {
//       setLocationOptions([]);
//       fields.forEach((_, idx) => {
//         setValue(`locations.${idx}.location`, "");
//       });
//       return;
//     }

//     const fetchLocations = async () => {
//       try {
//         const res = await getLocationByCity(selectedCityId._id);
//         const locations = res.data || res || [];

//         setLocationOptions(
//           locations.map((loc) => ({
//             value: loc._id,
//             label: loc.name,
//           }))
//         );
//       } catch (err) {
//         toast.error("Failed to load locations for this city");
//         setLocationOptions([]);
//       }
//     };

//     fetchLocations();
//   }, [selectedCityId, setValue, fields]);

//   // Fetch package data
//   useEffect(() => {
//     const fetchPackage = async () => {
//       try {
//         setLoading(true);
//         const res = await getPackageById(id);
//         if (!res?.data) throw new Error("Package not found");

//         const pkg = res.data;
//         console.log(pkg);


//         const imageBase = `${BASE_URL}/`;

//         const formDefault = {
//           name: pkg.name || "",
//           packageDetails: pkg.packageDetails || "",
//           baseFair: pkg.baseFair || "",
//           totalDistance: pkg.totalDistance || "",
//           convienienceFee: pkg.convienienceFee || "",
//           maxMember: pkg.maxMember || "",
//           status: pkg.status || "active",
//           timeDuration: pkg.timeDuration || "",
//           tag: pkg.tag ? pkg.tag.split(",").map((t) => t.trim()) : [],
//           cityId: pkg.cityId?._id || "",
//           locations:
//             pkg.locations?.length > 0
//               ? pkg.locations.map((loc) => ({
//                 location: loc.location?._id || "",
//                 order: loc.order || 1,
//                 distanceToNext: loc.distanceToNext || 0,
//               }))
//               : [{ location: "", order: 1, distanceToNext: 0 }],
//           // We don't need these in form values anymore
//         };

//         setDefaultValues(formDefault);
//         setPackageLoaded(true);

//         Object.keys(formDefault).forEach((key) => {
//           setValue(key, formDefault[key]);
//         });

//         reset(formDefault);


//         setPrimaryPreview(pkg.primaryBanner ? `${imageBase}/${pkg.primaryBanner}` : null);

//         setBannerPreviews(
//           pkg.bannerImages?.map((filename) => `${imageBase}/${filename}`) || []
//         );

//       } catch (err) {
//         console.error(err);
//         setFetchError(err.message || "Could not load package");
//         toast.error("Failed to load package details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) fetchPackage();
//   }, [id, setValue, reset]);

//   // Primary preview for new upload (unchanged)
//   useEffect(() => {
//     if (primaryFile?.[0] instanceof File) {
//       const url = URL.createObjectURL(primaryFile[0]);
//       setPrimaryPreview(url);
//       return () => URL.revokeObjectURL(url);
//     }
//   }, [primaryFile]);

//   // New banners preview (unchanged)
//   useEffect(() => {
//     const newUrls = accumulatedBannerFiles.map((file) => URL.createObjectURL(file));
//     setBannerPreviews((prev) => [...prev, ...newUrls]);
//     return () => newUrls.forEach(URL.revokeObjectURL);
//   }, [accumulatedBannerFiles]);

//   const handleBannerChange = (e) => {
//     const newFiles = Array.from(e.target.files || []);
//     setAccumulatedBannerFiles((prev) => [...prev, ...newFiles]);

//     const dt = new DataTransfer();
//     [...accumulatedBannerFiles, ...newFiles].forEach((file) => dt.items.add(file));
//     setValue("bannerImages", dt.files, { shouldValidate: true });
//     e.target.value = "";
//   };

//   const removePrimary = () => {
//     setValue("primaryBanner", null);
//     setPrimaryPreview(null);
//   };

//   const removeBanner = (index) => {
//     const updated = accumulatedBannerFiles.filter((_, i) => i !== index);
//     setAccumulatedBannerFiles(updated);

//     const dt = new DataTransfer();
//     updated.forEach((f) => dt.items.add(f));
//     setValue("bannerImages", dt.files.length ? dt.files : null);

//     setBannerPreviews((prev) => prev.filter((_, i) => i !== index));
//   };

//   const onSubmit = async (data) => {
//     try {
//       const formData = new FormData();

//       formData.append("name", data.name?.trim() || "");
//       formData.append("packageDetails", data.packageDetails || "");
//       formData.append("convienienceFee", data.convienienceFee || 0);
//       formData.append("maxMember", data.maxMember || 0);
//       formData.append("status", data.status);
//       formData.append("timeDuration", data.timeDuration || "");
//       formData.append("cityId", data.cityId || "");

//       if (data.tag?.length) formData.append("tag", data.tag.join(","));
//       if (data.locations?.length) formData.append("locations", JSON.stringify(data.locations));

//       if (data.baseFair !== "" && !isNaN(data.baseFair)) formData.append("baseFair", data.baseFair);
//       if (data.totalDistance !== "" && !isNaN(data.totalDistance)) formData.append("totalDistance", data.totalDistance);

//       if (data.primaryBanner?.[0] instanceof File) {
//         formData.append("primaryBanner", data.primaryBanner[0]);
//       }

//       if (data.bannerImages) {
//         Array.from(data.bannerImages).forEach((file) => {
//           if (file instanceof File) formData.append("bannerImages", file);
//         });
//       }

//       await updatePackage(id, formData);
//       toast.success("Package updated successfully!");
//       navigate("/home/packagelist");
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to update package");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50/70">
//         <Loader />
//       </div>
//     );
//   }

//   if (fetchError) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50/70 px-4">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.95 }}
//           animate={{ opacity: 1, scale: 1 }}
//           className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100"
//         >
//           <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
//           <p className="text-gray-600 mb-8">{fetchError}</p>
//           <button
//             onClick={() => navigate("/home/packagelist")}
//             className="bg-[#FB721D] text-white px-8 py-3 rounded-xl hover:bg-[#e0631b] transition shadow-md font-medium"
//           >
//             Back to Packages
//           </button>
//         </motion.div>
//       </div>
//     );
//   }
//   if (!packageLoaded) {
//     return null;   // or another loader if you want
//   }

//   return (
//     <div className="min-h-screen bg-gray-50/70 py-8 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-8xl mx-auto">
//         <Breaker title="Package Management" />

//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
//         >
//           <div className="p-6 md:p-10">
//             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
//               <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
//                 Update Package
//               </h1>
//               <button
//                 onClick={() => navigate("/home/packagelist")}
//                 className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition font-medium text-sm shadow-sm"
//               >
//                 Cancel & Back
//               </button>
//             </div>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
//               {/* Basic Info */}
//               <div className="space-y-6">
//                 <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-200">
//                   Basic Information
//                 </h2>

//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Package Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       {...register("name", { required: "Package name is required" })}
//                       placeholder="e.g. Golden Triangle Tour"
//                       className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${errors.name ? "border-red-500" : "border-gray-300"}`}
//                     />
//                     {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Duration <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       {...register("timeDuration", { required: "Duration is required" })}
//                       placeholder="e.g. 5 Days 4 Nights"
//                       className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${errors.timeDuration ? "border-red-500" : "border-gray-300"}`}
//                     />
//                     {errors.timeDuration && <p className="text-red-500 text-sm mt-1">{errors.timeDuration.message}</p>}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       City <span className="text-red-500">*</span>
//                     </label>
//                     <Controller
//                       name="cityId"
//                       control={control}
//                       rules={{ required: "Please select a city" }}
//                       render={({ field }) => (
//                         <select
//                           {...field}
//                           value={field.value ?? ""}
//                           onChange={e => field.onChange(e.target.value)}
//                           className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] transition-all ${errors.cityId ? "border-red-500" : "border-gray-300"}`}
//                         >
//                           <option value="">Select a city</option>
//                           {cities.map((city) => (
//                             <option key={city._id} value={city._id}>
//                               {city.name}
//                             </option>
//                           ))}
//                         </select>
//                       )}
//                     />
//                     {errors.cityId && <p className="text-red-500 text-sm mt-1">{errors.cityId.message}</p>}
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Package Description <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     {...register("packageDetails", {
//                       required: "Description is required",
//                       minLength: { value: 20, message: "Minimum 20 characters" },
//                     })}
//                     rows={5}
//                     placeholder="Describe itinerary, inclusions, exclusions, highlights..."
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all resize-y ${errors.packageDetails ? "border-red-500" : "border-gray-300"}`}
//                   />
//                   {errors.packageDetails && <p className="text-red-500 text-sm mt-1">{errors.packageDetails.message}</p>}
//                 </div>
//               </div>

//               {/* Images Section */}
//               <div className="space-y-6">
//                 <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-200">
//                   Package Images
//                 </h2>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                   {/* Primary Banner */}
//                   <div className="space-y-3">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Primary Banner <span className="text-red-500">*</span>
//                     </label>
//                     <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#FB721D] transition-colors cursor-pointer bg-gray-50">
//                       <input
//                         type="file"
//                         accept="image/*"
//                         {...register("primaryBanner")}
//                         className="hidden"
//                         id="primaryBannerUpdate"
//                       />
//                       <label htmlFor="primaryBannerUpdate" className="cursor-pointer">
//                         <ImagePlus className="mx-auto h-10 w-10 text-gray-400" />
//                         <p className="mt-2 text-sm font-medium text-gray-700">
//                           Click to replace primary banner
//                         </p>
//                       </label>
//                     </div>

//                     {primaryPreview && (
//                       <div className="relative inline-block">
//                         <img
//                           src={primaryPreview}
//                           alt="Primary Banner"
//                           className="w-full max-w-xs h-48 object-cover rounded-lg shadow-sm border"
//                         />
//                         {primaryPreview && !primaryFile?.[0] && (   // only show remove on existing (not new blob)
//                           <button
//                             type="button"
//                             onClick={removePrimary}
//                             className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
//                           >
//                             <X size={16} />
//                           </button>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* Additional Banners */}
//                   <div className="space-y-3">
//                     <label className="block text-sm font-medium text-gray-700">
//                       Additional Banners
//                     </label>
//                     <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#FB721D] transition-colors cursor-pointer bg-gray-50">
//                       <input
//                         type="file"
//                         multiple
//                         accept="image/*"
//                         onChange={handleBannerChange}
//                         className="hidden"
//                         id="bannerImagesUpdate"
//                       />
//                       <label htmlFor="bannerImagesUpdate" className="cursor-pointer">
//                         <ImagePlus className="mx-auto h-10 w-10 text-gray-400" />
//                         <p className="mt-2 text-sm font-medium text-gray-700">
//                           Add / replace more images
//                         </p>
//                       </label>
//                     </div>

//                     {bannerPreviews.length > 0 ? (
//                       <div className="grid grid-cols-3 gap-4 mt-4">
//                         {bannerPreviews.map((preview, idx) => (
//                           <div key={idx} className="relative group">
//                             <img
//                               src={preview}
//                               alt={`Banner ${idx + 1}`}
//                               className="w-full h-28 object-cover rounded-lg shadow-sm border"
//                             />
//                             <button
//                               type="button"
//                               onClick={() => removeBanner(idx)}
//                               className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
//                             >
//                               <X size={14} />
//                             </button>
//                           </div>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-500 text-sm mt-3 text-center">
//                         No additional banners yet
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Pricing & Capacity */}
//               <div className="space-y-6">
//                 <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-200">
//                   Pricing & Capacity
//                 </h2>

//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Base Fare (₹) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       {...register("baseFair", {
//                         required: "Base fare is required",
//                         min: { value: 0, message: "Cannot be negative" },
//                       })}
//                       placeholder="15000"
//                       className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.baseFair ? "border-red-500" : "border-gray-300"}`}
//                     />
//                     {errors.baseFair && <p className="text-red-500 text-sm mt-1">{errors.baseFair.message}</p>}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Total Distance (km) <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       step="0.1"
//                       {...register("totalDistance", {
//                         required: "Total distance is required",
//                         min: { value: 0, message: "Cannot be negative" },
//                       })}
//                       placeholder="800"
//                       className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.totalDistance ? "border-red-500" : "border-gray-300"}`}
//                     />
//                     {errors.totalDistance && <p className="text-red-500 text-sm mt-1">{errors.totalDistance.message}</p>}
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Convenience Fee (₹)
//                     </label>
//                     <input
//                       type="number"
//                       {...register("convienienceFee", { min: 0 })}
//                       placeholder="500"
//                       className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] border-gray-300"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Max Members <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="number"
//                       {...register("maxMember", {
//                         required: "Max members required",
//                         min: { value: 1, message: "At least 1 member" },
//                       })}
//                       placeholder="4"
//                       className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.maxMember ? "border-red-500" : "border-gray-300"}`}
//                     />
//                     {errors.maxMember && <p className="text-red-500 text-sm mt-1">{errors.maxMember.message}</p>}
//                   </div>
//                 </div>
//               </div>

//               {/* Locations */}
//               <div className="space-y-6">
//                 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//                   <h2 className="text-xl font-semibold text-gray-800">
//                     Locations / Itinerary
//                   </h2>
//                   <button
//                     type="button"
//                     onClick={() =>
//                       append({
//                         location: "",
//                         order: fields.length + 1,
//                         distanceToNext: 0,
//                       })
//                     }
//                     className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg transition flex items-center gap-2 text-sm font-medium shadow-sm"
//                   >
//                     <span>+ Add Location</span>
//                   </button>
//                 </div>

//                 {fields.length === 0 ? (
//                   <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-xl border border-dashed">
//                     No locations added yet.
//                   </div>
//                 ) : (
//                   <div className="space-y-5">
//                     {fields.map((field, index) => (
//                       <motion.div
//                         key={field.id}
//                         initial={{ opacity: 0, y: 10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
//                       >
//                         <div className="px-5 py-3 bg-gray-50/80 border-b flex justify-between items-center">
//                           <h3 className="font-medium text-gray-800">
//                             Stop {index + 1}
//                           </h3>
//                           {index > 0 && (
//                             <button
//                               type="button"
//                               onClick={() => remove(index)}
//                               className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded text-sm font-medium transition flex items-center gap-1"
//                             >
//                               <X size={14} /> Remove
//                             </button>
//                           )}
//                         </div>

//                         <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
//                           <div className="md:col-span-6">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                               Location <span className="text-red-500">*</span>
//                             </label>
//                             <Controller
//                               control={control}
//                               name={`locations.${index}.location`}
//                               rules={{ required: "Location is required" }}
//                               render={({ field }) => (
//                                 <Select
//                                   {...field}
//                                   options={locationOptions}
//                                   placeholder={selectedCityId ? "Search & select location" : "Select city first"}
//                                   isSearchable
//                                   isDisabled={!selectedCityId}
//                                   menuPortalTarget={document.body}
//                                   value={locationOptions.find((opt) => opt.value === field.value) || null}
//                                   onChange={(opt) => field.onChange(opt?.value || "")}
//                                   classNamePrefix="react-select"
//                                   styles={{
//                                     control: (base) => ({
//                                       ...base,
//                                       borderColor: errors.locations?.[index]?.location ? "#ef4444" : "#d1d5db",
//                                       borderRadius: "0.5rem",
//                                       minHeight: "44px",
//                                       backgroundColor: !selectedCityId ? "#f3f4f6" : "white",
//                                       cursor: !selectedCityId ? "not-allowed" : "default",
//                                       "&:hover": { borderColor: selectedCityId ? "#FB721D" : "#d1d5db" },
//                                     }),
//                                     menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//                                   }}
//                                 />
//                               )}
//                             />
//                             {errors.locations?.[index]?.location && (
//                               <p className="text-red-500 text-xs mt-1.5">
//                                 {errors.locations[index].location.message}
//                               </p>
//                             )}
//                           </div>

//                           <div className="md:col-span-3">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                               Order <span className="text-red-500">*</span>
//                             </label>
//                             <input
//                               type="number"
//                               {...register(`locations.${index}.order`, {
//                                 required: true,
//                                 valueAsNumber: true,
//                                 min: { value: 1, message: "Order must be ≥ 1" },
//                               })}
//                               placeholder="1"
//                               className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#FB721D] text-center ${errors.locations?.[index]?.order ? "border-red-500" : "border-gray-300"}`}
//                             />
//                             {errors.locations?.[index]?.order && (
//                               <p className="text-red-500 text-xs mt-1.5">
//                                 {errors.locations[index].order.message}
//                               </p>
//                             )}
//                           </div>

//                           <div className="md:col-span-3">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                               Distance to Next (km)
//                             </label>
//                             <input
//                               type="number"
//                               step="0.1"
//                               {...register(`locations.${index}.distanceToNext`, { valueAsNumber: true })}
//                               placeholder="120.5"
//                               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB721D]"
//                             />
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* Tags & Status */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Tags <span className="text-red-500">*</span>
//                   </label>
//                   <Controller
//                     control={control}
//                     name="tag"
//                     rules={{ required: "Select at least one tag" }}
//                     render={({ field }) => (
//                       <Select
//                         {...field}
//                         isMulti
//                         options={tagOptions}
//                         placeholder="Select tags"
//                         menuPortalTarget={document.body}
//                         value={tagOptions.filter((opt) => field.value?.includes(opt.value))}
//                         onChange={(opts) => field.onChange(opts.map((o) => o.value))}
//                         classNamePrefix="react-select"
//                         styles={{
//                           control: (base) => ({
//                             ...base,
//                             borderColor: errors.tag ? "#ef4444" : base.borderColor,
//                           }),
//                           menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//                         }}
//                       />
//                     )}
//                   />
//                   {errors.tag && <p className="text-red-500 text-sm mt-1">{errors.tag.message}</p>}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Status <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     {...register("status", { required: true })}
//                     className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] border-gray-300"
//                   >
//                     <option value="active">Active</option>
//                     <option value="inactive">Inactive</option>
//                   </select>
//                 </div>
//               </div>

//               {/* Submit */}
//               <div className="pt-6 border-t border-gray-200">
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3 ${isSubmitting
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-[#FB721D] hover:bg-[#e0631b] shadow-lg hover:shadow-xl"
//                     }`}
//                 >
//                   {isSubmitting ? (
//                     <>
//                       <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       Updating Package...
//                     </>
//                   ) : (
//                     "Update Package"
//                   )}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </motion.div>
//       </div>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPackageById, updatePackage } from "../../Services/PackageApi";
import { getAllCities } from "../../Services/CityApi";
import { getLocationByCity } from "../../Services/LocationByCity";
import toast from "react-hot-toast";
import Breaker from "../../compoents/Breaker";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import Select from "react-select";
import { getAllLocations } from "../../Services/locationServices";
import { Upload, X, ImagePlus } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const tagOptions = [
  { value: "popular", label: "Popular" },
  { value: "new", label: "New" },
  { value: "family", label: "Family" },
  { value: "adventure", label: "Adventure" },
  { value: "budget", label: "Budget" },
  { value: "luxury", label: "Luxury" },
];

export default function UpdatePackage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [defaultValues, setDefaultValues] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [cities, setCities] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [accumulatedBannerFiles, setAccumulatedBannerFiles] = useState([]);
  const [bannerPreviews, setBannerPreviews] = useState([]);
  const [primaryPreview, setPrimaryPreview] = useState(null);
  const [packageLoaded, setPackageLoaded] = useState(false);

  const methods = useForm({
    defaultValues: {
      primaryBanner: null,
      bannerImages: null,
      name: "",
      packageDetails: "",
      baseFair: "",
      totalDistance: "",
      convienienceFee: "",
      maxMember: "",
      status: "active",
      timeDuration: "",
      tag: [],
      locations: [{ location: "", order: 1, distanceToNext: 0 }],
      cityId: "",
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const reset = methods.reset;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "locations",
  });

  const primaryFile = watch("primaryBanner");
  const bannerFiles = watch("bannerImages");
  const selectedCityId = useWatch({ control, name: "cityId" });

  // Fetch cities
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getAllCities({
          page: 1,
          rowsPerPage: 999,
          searchQuery: "",
        });
        if (res.status && res.data) {
          setCities(res.data);
        } else {
          toast.error("Failed to load cities");
        }
      } catch (err) {
        toast.error("Error loading cities");
      }
    };
    fetchCities();
  }, []);

  // Fetch locations based on selected city
  useEffect(() => {
    if (!selectedCityId) {
      setLocationOptions([]);
      fields.forEach((_, idx) => {
        setValue(`locations.${idx}.location`, "");
      });
      return;
    }

    const fetchLocations = async () => {
      try {
        const res = await getLocationByCity(selectedCityId);
        const locations = res.data || res || [];

        setLocationOptions(
          locations.map((loc) => ({
            value: loc._id,
            label: loc.name,
          }))
        );
      } catch (err) {
        toast.error("Failed to load locations for this city");
        setLocationOptions([]);
      }
    };

    fetchLocations();
  }, [selectedCityId, setValue, fields]);

  // Fetch package data
  useEffect(() => {
    const fetchPackage = async () => {
      try {
        setLoading(true);
        const res = await getPackageById(id);
        if (!res?.data) throw new Error("Package not found");

        const pkg = res.data;
        console.log(pkg);

        const imageBase = `${BASE_URL}/`;

        const formDefault = {
          name: pkg.name || "",
          packageDetails: pkg.packageDetails || "",
          baseFair: pkg.baseFair || "",
          totalDistance: pkg.totalDistance || "",
          convienienceFee: pkg.convienienceFee || "",
          maxMember: pkg.maxMember || "",
          status: pkg.status || "active",
          timeDuration: pkg.timeDuration || "",
          tag: pkg.tag ? pkg.tag.split(",").map((t) => t.trim()) : [],
          cityId: pkg.cityId?._id || "",
          locations:
            pkg.locations?.length > 0
              ? pkg.locations.map((loc) => ({
                  location: loc.location?._id || "",
                  order: loc.order || 1,
                  distanceToNext: loc.distanceToNext || 0,
                }))
              : [{ location: "", order: 1, distanceToNext: 0 }],
        };

        setDefaultValues(formDefault);
        setPackageLoaded(true);

        // Reset form with defaults
        reset(formDefault);

        // Force set cityId (helps with timing / select sync issues)
        setValue("cityId", pkg.cityId?._id || "", {
          shouldValidate: true,
          shouldDirty: true,
        });

        setPrimaryPreview(pkg.primaryBanner ? `${imageBase}/${pkg.primaryBanner}` : null);

        setBannerPreviews(
          pkg.bannerImages?.map((filename) => `${imageBase}/${filename}`) || []
        );
      } catch (err) {
        console.error(err);
        setFetchError(err.message || "Could not load package");
        toast.error("Failed to load package details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPackage();
  }, [id, setValue, reset]);

  // Primary preview for new upload
  useEffect(() => {
    if (primaryFile?.[0] instanceof File) {
      const url = URL.createObjectURL(primaryFile[0]);
      setPrimaryPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [primaryFile]);

  // New banners preview
  useEffect(() => {
    const newUrls = accumulatedBannerFiles.map((file) => URL.createObjectURL(file));
    setBannerPreviews((prev) => [...prev, ...newUrls]);
    return () => newUrls.forEach(URL.revokeObjectURL);
  }, [accumulatedBannerFiles]);

  const handleBannerChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    setAccumulatedBannerFiles((prev) => [...prev, ...newFiles]);

    const dt = new DataTransfer();
    [...accumulatedBannerFiles, ...newFiles].forEach((file) => dt.items.add(file));
    setValue("bannerImages", dt.files, { shouldValidate: true });
    e.target.value = "";
  };

  const removePrimary = () => {
    setValue("primaryBanner", null);
    setPrimaryPreview(null);
  };

  const removeBanner = (index) => {
    const updated = accumulatedBannerFiles.filter((_, i) => i !== index);
    setAccumulatedBannerFiles(updated);

    const dt = new DataTransfer();
    updated.forEach((f) => dt.items.add(f));
    setValue("bannerImages", dt.files.length ? dt.files : null);

    setBannerPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name?.trim() || "");
      formData.append("packageDetails", data.packageDetails || "");
      formData.append("convienienceFee", data.convienienceFee || 0);
      formData.append("maxMember", data.maxMember || 0);
      formData.append("status", data.status);
      formData.append("timeDuration", data.timeDuration || "");
      formData.append("cityId", data.cityId || "");

      if (data.tag?.length) formData.append("tag", data.tag.join(","));
      if (data.locations?.length) formData.append("locations", JSON.stringify(data.locations));

      if (data.baseFair !== "" && !isNaN(data.baseFair)) formData.append("baseFair", data.baseFair);
      if (data.totalDistance !== "" && !isNaN(data.totalDistance)) formData.append("totalDistance", data.totalDistance);

      if (data.primaryBanner?.[0] instanceof File) {
        formData.append("primaryBanner", data.primaryBanner[0]);
      }

      if (data.bannerImages) {
        Array.from(data.bannerImages).forEach((file) => {
          if (file instanceof File) formData.append("bannerImages", file);
        });
      }

      await updatePackage(id, formData);
      toast.success("Package updated successfully!");
      navigate("/home/packagelist");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update package");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/70">
        <Loader />
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/70 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100"
        >
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-8">{fetchError}</p>
          <button
            onClick={() => navigate("/home/packagelist")}
            className="bg-[#FB721D] text-white px-8 py-3 rounded-xl hover:bg-[#e0631b] transition shadow-md font-medium"
          >
            Back to Packages
          </button>
        </motion.div>
      </div>
    );
  }

  if (!packageLoaded) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50/70 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-8xl mx-auto">
        <Breaker title="Package Management" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden"
        >
          <div className="p-6 md:p-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Update Package
              </h1>
              <button
                onClick={() => navigate("/home/packagelist")}
                className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-300 transition font-medium text-sm shadow-sm"
              >
                Cancel & Back
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* Basic Info */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-200">
                  Basic Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Package Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("name", { required: "Package name is required" })}
                      placeholder="e.g. Golden Triangle Tour"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${errors.name ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duration <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("timeDuration", { required: "Duration is required" })}
                      placeholder="e.g. 5 Days 4 Nights"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${errors.timeDuration ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.timeDuration && <p className="text-red-500 text-sm mt-1">{errors.timeDuration.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      name="cityId"
                      control={control}
                      rules={{ required: "Please select a city" }}
                      render={({ field }) => (
                        <select
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) => field.onChange(e.target.value)}
                          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] transition-all ${errors.cityId ? "border-red-500" : "border-gray-300"}`}
                        >
                          <option value="">Select a city</option>
                          {cities.map((city) => (
                            <option key={city._id} value={city._id}>
                              {city.name}
                            </option>
                          ))}
                        </select>
                      )}
                    />
                    {errors.cityId && <p className="text-red-500 text-sm mt-1">{errors.cityId.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Package Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    {...register("packageDetails", {
                      required: "Description is required",
                      minLength: { value: 20, message: "Minimum 20 characters" },
                    })}
                    rows={5}
                    placeholder="Describe itinerary, inclusions, exclusions, highlights..."
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all resize-y ${errors.packageDetails ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.packageDetails && <p className="text-red-500 text-sm mt-1">{errors.packageDetails.message}</p>}
                </div>
              </div>

              {/* Images Section */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-200">
                  Package Images
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Primary Banner */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Primary Banner <span className="text-red-500">*</span>
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#FB721D] transition-colors cursor-pointer bg-gray-50">
                      <input
                        type="file"
                        accept="image/*"
                        {...register("primaryBanner")}
                        className="hidden"
                        id="primaryBannerUpdate"
                      />
                      <label htmlFor="primaryBannerUpdate" className="cursor-pointer">
                        <ImagePlus className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm font-medium text-gray-700">
                          Click to replace primary banner
                        </p>
                      </label>
                    </div>

                    {primaryPreview && (
                      <div className="relative inline-block">
                        <img
                          src={primaryPreview}
                          alt="Primary Banner"
                          className="w-full max-w-xs h-48 object-cover rounded-lg shadow-sm border"
                        />
                        {primaryPreview && !primaryFile?.[0] && (
                          <button
                            type="button"
                            onClick={removePrimary}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Additional Banners */}
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Banners
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#FB721D] transition-colors cursor-pointer bg-gray-50">
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleBannerChange}
                        className="hidden"
                        id="bannerImagesUpdate"
                      />
                      <label htmlFor="bannerImagesUpdate" className="cursor-pointer">
                        <ImagePlus className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm font-medium text-gray-700">
                          Add / replace more images
                        </p>
                      </label>
                    </div>

                    {bannerPreviews.length > 0 ? (
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        {bannerPreviews.map((preview, idx) => (
                          <div key={idx} className="relative group">
                            <img
                              src={preview}
                              alt={`Banner ${idx + 1}`}
                              className="w-full h-28 object-cover rounded-lg shadow-sm border"
                            />
                            <button
                              type="button"
                              onClick={() => removeBanner(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm mt-3 text-center">
                        No additional banners yet
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing & Capacity */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800 pb-2 border-b border-gray-200">
                  Pricing & Capacity
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Base Fare (₹) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register("baseFair", {
                        required: "Base fare is required",
                        min: { value: 0, message: "Cannot be negative" },
                      })}
                      placeholder="15000"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.baseFair ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.baseFair && <p className="text-red-500 text-sm mt-1">{errors.baseFair.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Distance (km) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      {...register("totalDistance", {
                        required: "Total distance is required",
                        min: { value: 0, message: "Cannot be negative" },
                      })}
                      placeholder="800"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.totalDistance ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.totalDistance && <p className="text-red-500 text-sm mt-1">{errors.totalDistance.message}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Convenience Fee (₹)
                    </label>
                    <input
                      type="number"
                      {...register("convienienceFee", { min: 0 })}
                      placeholder="500"
                      className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] border-gray-300"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Members <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      {...register("maxMember", {
                        required: "Max members required",
                        min: { value: 1, message: "At least 1 member" },
                      })}
                      placeholder="4"
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.maxMember ? "border-red-500" : "border-gray-300"}`}
                    />
                    {errors.maxMember && <p className="text-red-500 text-sm mt-1">{errors.maxMember.message}</p>}
                  </div>
                </div>
              </div>

              {/* Locations */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Locations / Itinerary
                  </h2>
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        location: "",
                        order: fields.length + 1,
                        distanceToNext: 0,
                      })
                    }
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg transition flex items-center gap-2 text-sm font-medium shadow-sm"
                  >
                    <span>+ Add Location</span>
                  </button>
                </div>

                {fields.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-xl border border-dashed">
                    No locations added yet.
                  </div>
                ) : (
                  <div className="space-y-5">
                    {fields.map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                      >
                        <div className="px-5 py-3 bg-gray-50/80 border-b flex justify-between items-center">
                          <h3 className="font-medium text-gray-800">
                            Stop {index + 1}
                          </h3>
                          {index > 0 && (
                            <button
                              type="button"
                              onClick={() => remove(index)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded text-sm font-medium transition flex items-center gap-1"
                            >
                              <X size={14} /> Remove
                            </button>
                          )}
                        </div>

                        <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
                          <div className="md:col-span-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Location <span className="text-red-500">*</span>
                            </label>
                            <Controller
                              control={control}
                              name={`locations.${index}.location`}
                              rules={{ required: "Location is required" }}
                              render={({ field }) => (
                                <Select
                                  {...field}
                                  options={locationOptions}
                                  placeholder={selectedCityId ? "Search & select location" : "Select city first"}
                                  isSearchable
                                  isDisabled={!selectedCityId}
                                  menuPortalTarget={document.body}
                                  value={locationOptions.find((opt) => opt.value === field.value) || null}
                                  onChange={(opt) => field.onChange(opt?.value || "")}
                                  classNamePrefix="react-select"
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      borderColor: errors.locations?.[index]?.location ? "#ef4444" : "#d1d5db",
                                      borderRadius: "0.5rem",
                                      minHeight: "44px",
                                      backgroundColor: !selectedCityId ? "#f3f4f6" : "white",
                                      cursor: !selectedCityId ? "not-allowed" : "default",
                                      "&:hover": { borderColor: selectedCityId ? "#FB721D" : "#d1d5db" },
                                    }),
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                  }}
                                />
                              )}
                            />
                            {errors.locations?.[index]?.location && (
                              <p className="text-red-500 text-xs mt-1.5">
                                {errors.locations[index].location.message}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Order <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              {...register(`locations.${index}.order`, {
                                required: true,
                                valueAsNumber: true,
                                min: { value: 1, message: "Order must be ≥ 1" },
                              })}
                              placeholder="1"
                              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#FB721D] text-center ${errors.locations?.[index]?.order ? "border-red-500" : "border-gray-300"}`}
                            />
                            {errors.locations?.[index]?.order && (
                              <p className="text-red-500 text-xs mt-1.5">
                                {errors.locations[index].order.message}
                              </p>
                            )}
                          </div>

                          <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Distance to Next (km)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              {...register(`locations.${index}.distanceToNext`, { valueAsNumber: true })}
                              placeholder="120.5"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB721D]"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name="tag"
                    rules={{ required: "Select at least one tag" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={tagOptions}
                        placeholder="Select tags"
                        menuPortalTarget={document.body}
                        value={tagOptions.filter((opt) => field.value?.includes(opt.value))}
                        onChange={(opts) => field.onChange(opts.map((o) => o.value))}
                        classNamePrefix="react-select"
                        styles={{
                          control: (base) => ({
                            ...base,
                            borderColor: errors.tag ? "#ef4444" : base.borderColor,
                          }),
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    )}
                  />
                  {errors.tag && <p className="text-red-500 text-sm mt-1">{errors.tag.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("status", { required: true })}
                    className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] border-gray-300"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg transition-all flex items-center justify-center gap-3 ${isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#FB721D] hover:bg-[#e0631b] shadow-lg hover:shadow-xl"
                    }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating Package...
                    </>
                  ) : (
                    "Update Package"
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}