
// import { useEffect, useState } from "react";
// import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
// import Select from "react-select";
// import { getAllLocations } from "../../Services/locationServices";
// import { createPackage } from "../../Services/PackageApi";
// import Breaker from "../../compoents/Breaker";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { motion } from "framer-motion";
// import { Upload, X, ImagePlus } from "lucide-react"; // Optional: install lucide-react
// import { getAllCities } from "../../Services/CityApi";

// export default function AddPackageForm() {
//   const navigate = useNavigate();
//   const {
//     register,
//     handleSubmit,
//     control,
//     setValue,
//     watch,
//     formState: { errors, isSubmitting },
//   } = useForm({
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
//     },
//     mode: "onChange",
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "locations",
//   });

//   const [cities, setCities] = useState([]);
//   const [locationOptions, setLocationOptions] = useState([]);
//   const [primaryPreview, setPrimaryPreview] = useState(null);
//   const [bannerPreviews, setBannerPreviews] = useState([]);
//   const [accumulatedBannerFiles, setAccumulatedBannerFiles] = useState([]);

//   const primaryFile = watch("primaryBanner");
//   const bannerFiles = watch("bannerImages");

//   // Fetch cities on mount (once)
//   useEffect(() => {
//     const fetchCities = async () => {
//       try {
//         setLoadingCities(true);
//         const res = await getAllCities({
//           page: 1,
//           rowsPerPage: 10,
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
//       .catch(() => toast.error("Failed to load locations"));
//   }, []);

//   // Primary banner preview
//   useEffect(() => {
//     if (primaryFile?.[0] instanceof File) {
//       const url = URL.createObjectURL(primaryFile[0]);
//       setPrimaryPreview(url);
//       return () => URL.revokeObjectURL(url);
//     }
//   }, [primaryFile]);

//   // Banner previews
//   useEffect(() => {
//     const urls = accumulatedBannerFiles.map((file) => URL.createObjectURL(file));
//     setBannerPreviews(urls);
//     return () => urls.forEach(URL.revokeObjectURL);
//   }, [accumulatedBannerFiles]);

//   const handleBannerChange = (e) => {
//     const newFiles = Array.from(e.target.files || []);
//     const updated = [...accumulatedBannerFiles, ...newFiles];
//     setAccumulatedBannerFiles(updated);

//     const dt = new DataTransfer();
//     updated.forEach((file) => dt.items.add(file));
//     setValue("bannerImages", dt.files, { shouldValidate: true });
//     e.target.value = ""; // Reset input
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
//   };

//   const tagOptions = [
//     { value: "popular", label: "Popular" },
//     { value: "new", label: "New" },
//     { value: "family", label: "Family" },
//     { value: "adventure", label: "Adventure" },
//     { value: "budget", label: "Budget" },
//     { value: "luxury", label: "Luxury" },
//   ];

//   const onSubmit = async (data) => {
//     try {
//       const formData = new FormData();
//       formData.append("name", data.name?.trim() || "");
//       formData.append("packageDetails", data.packageDetails || "");
//       formData.append("convienienceFee", data.convienienceFee || 0);
//       formData.append("maxMember", data.maxMember || 0);
//       formData.append("status", data.status);
//       formData.append("timeDuration", data.timeDuration || "");
//       if (data.tag?.length) formData.append("tag", data.tag.join(","));
//       if (data.locations?.length) formData.append("locations", JSON.stringify(data.locations));
//       if (data.totalDistance) formData.append("totalDistance", data.totalDistance);
//       if (data.baseFair) formData.append("baseFair", data.baseFair);
//       if (data.primaryBanner?.[0]) formData.append("primaryBanner", data.primaryBanner[0]);
//       if (data.bannerImages) {
//         Array.from(data.bannerImages).forEach((file) => formData.append("bannerImages", file));
//       }

//       await createPackage(formData);
//       toast.success("Package created successfully!");
//       navigate("/home/packagelist");
//     } catch (err) {
//       toast.error(err?.response?.data?.message || "Failed to create package");
//     }
//   };

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
//             <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
//               Create New Package
//             </h1>

//             <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
//               {/* Basic Info Section */}
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
//                       className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${errors.name ? "border-red-500" : "border-gray-300"
//                         }`}
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
//                       className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${errors.timeDuration ? "border-red-500" : "border-gray-300"
//                         }`}
//                     />
//                     {errors.timeDuration && (
//                       <p className="text-red-500 text-sm mt-1">{errors.timeDuration.message}</p>
//                     )}
//                   </div>

//                   {/* City */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       City <span className="text-red-500">*</span>
//                     </label>
//                     <select
//                       name="cityId"
//                       value={formData.cityId}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
//                     >
//                       <option value="" selected disabled>Select a city</option>
//                       {cities.map((city) => (
//                         <option key={city._id} value={city._id}>
//                           {city.name}
//                         </option>
//                       ))}
//                     </select>
//                     {apiError.cityId && <p className="mt-1 text-sm text-red-600">{apiError.cityId}</p>}
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
//                     className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all resize-y ${errors.packageDetails ? "border-red-500" : "border-gray-300"
//                       }`}
//                   />
//                   {errors.packageDetails && (
//                     <p className="text-red-500 text-sm mt-1">{errors.packageDetails.message}</p>
//                   )}
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
//                         {...register("primaryBanner", { required: "Primary banner is required" })}
//                         className="hidden"
//                         id="primaryBanner"
//                       />
//                       <label htmlFor="primaryBanner" className="cursor-pointer">
//                         <ImagePlus className="mx-auto h-10 w-10 text-gray-400" />
//                         <p className="mt-2 text-sm font-medium text-gray-700">
//                           Click to upload primary banner
//                         </p>
//                         <p className="text-xs text-gray-500 mt-1">PNG, JPG, max 5MB</p>
//                       </label>
//                     </div>
//                     {primaryPreview && (
//                       <div className="relative inline-block">
//                         <img
//                           src={primaryPreview}
//                           alt="Primary Preview"
//                           className="w-full h-48 object-cover rounded-lg shadow-sm border"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => {
//                             setValue("primaryBanner", null);
//                             setPrimaryPreview(null);
//                           }}
//                           className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
//                         >
//                           <X size={16} />
//                         </button>
//                       </div>
//                     )}
//                     {errors.primaryBanner && (
//                       <p className="text-red-500 text-sm">{errors.primaryBanner.message}</p>
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
//                         id="bannerImages"
//                       />
//                       <label htmlFor="bannerImages" className="cursor-pointer">
//                         <ImagePlus className="mx-auto h-10 w-10 text-gray-400" />
//                         <p className="mt-2 text-sm font-medium text-gray-700">
//                           Add more images (multiple allowed)
//                         </p>
//                       </label>
//                     </div>

//                     {bannerPreviews.length > 0 && (
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
//                       className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.baseFair ? "border-red-500" : "border-gray-300"
//                         }`}
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
//                       className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.totalDistance ? "border-red-500" : "border-gray-300"
//                         }`}
//                     />
//                     {errors.totalDistance && (
//                       <p className="text-red-500 text-sm mt-1">{errors.totalDistance.message}</p>
//                     )}
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
//                       className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.maxMember ? "border-red-500" : "border-gray-300"
//                         }`}
//                     />
//                     {errors.maxMember && <p className="text-red-500 text-sm mt-1">{errors.maxMember.message}</p>}
//                   </div>
//                 </div>
//               </div>

//               {/* Locations - Dynamic */}
//               {/* <div className="space-y-6">
//                 <div className="flex justify-between items-center">
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
//                     className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg transition flex items-center gap-2"
//                   >
//                     <span>+ Add Location</span>
//                   </button>
//                 </div>

//                 {fields.map((field, index) => (
//                   <motion.div
//                     key={field.id}
//                     initial={{ opacity: 0, y: 10 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     className="border border-gray-200 rounded-xl p-6 bg-gray-50/50 space-y-6"
//                   >
//                     <div className="flex justify-between items-center">
//                       <h3 className="font-medium text-gray-800">
//                         Stop {index + 1}
//                       </h3>
//                       {index > 0 && (
//                         <button
//                           type="button"
//                           onClick={() => remove(index)}
//                           className="text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
//                         >
//                           <X size={16} /> Remove
//                         </button>
//                       )}
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                       <div className="md:col-span-2">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Location <span className="text-red-500">*</span>
//                         </label>
//                         <Controller
//                           control={control}
//                           name={`locations.${index}.location`}
//                           rules={{ required: "Location required" }}
//                           render={({ field }) => (
//                             <Select
//                               {...field}
//                               options={locationOptions}
//                               placeholder="Search & select location"
//                               isSearchable
//                               value={locationOptions.find((opt) => opt.value === field.value)}
//                               onChange={(opt) => field.onChange(opt?.value || "")}
//                               classNamePrefix="react-select"
//                               styles={{
//                                 control: (base) => ({
//                                   ...base,
//                                   borderColor: errors.locations?.[index]?.location ? "#ef4444" : base.borderColor,
//                                   "&:hover": { borderColor: "#FB721D" },
//                                 }),
//                               }}
//                             />
//                           )}
//                         />
//                         {errors.locations?.[index]?.location && (
//                           <p className="text-red-500 text-sm mt-1">
//                             {errors.locations[index].location.message}
//                           </p>
//                         )}
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Order <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="number"
//                           {...register(`locations.${index}.order`, {
//                             required: true,
//                             valueAsNumber: true,
//                             min: 1,
//                           })}
//                           className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.locations?.[index]?.order ? "border-red-500" : "border-gray-300"
//                             }`}
//                         />
//                       </div>

//                       <div className="md:col-span-3">
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           Distance to Next (km)
//                         </label>
//                         <input
//                           type="number"
//                           step="0.1"
//                           {...register(`locations.${index}.distanceToNext`, { valueAsNumber: true })}
//                           placeholder="Distance in km"
//                           className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] border-gray-300"
//                         />
//                       </div>
//                     </div>
//                   </motion.div>
//                 ))}
//               </div> */}

//               {/* Locations - Dynamic */}
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
//                     No locations added yet. Click "Add Location" to start building the itinerary.
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

//                         {/* All fields in one row on larger screens */}
//                         <div className="p-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-end">
//                           {/* Location - takes more space */}
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
//                                   placeholder="Search & select location"
//                                   isSearchable
//                                   menuPortalTarget={document.body}
//                                   value={locationOptions.find((opt) => opt.value === field.value)}
//                                   onChange={(opt) => field.onChange(opt?.value || "")}
//                                   classNamePrefix="react-select"
//                                   styles={{
//                                     control: (base) => ({
//                                       ...base,
//                                       borderColor: errors.locations?.[index]?.location ? "#ef4444" : "#d1d5db",
//                                       borderRadius: "0.5rem",
//                                       minHeight: "44px",
//                                       "&:hover": { borderColor: "#FB721D" },
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

//                           {/* Order */}
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
//                               className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all text-center ${errors.locations?.[index]?.order ? "border-red-500" : "border-gray-300"
//                                 }`}
//                             />
//                             {errors.locations?.[index]?.order && (
//                               <p className="text-red-500 text-xs mt-1.5">
//                                 {errors.locations[index].order.message}
//                               </p>
//                             )}
//                           </div>

//                           {/* Distance to Next */}
//                           <div className="md:col-span-3">
//                             <label className="block text-sm font-medium text-gray-700 mb-2">
//                               Distance to Next (km)
//                             </label>
//                             <input
//                               type="number"
//                               step="0.1"
//                               {...register(`locations.${index}.distanceToNext`, { valueAsNumber: true })}
//                               placeholder="120.5"
//                               className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all"
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
//                       Creating Package...
//                     </>
//                   ) : (
//                     "Create Package"
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
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import Select from "react-select";
import { getAllLocations } from "../../Services/locationServices";
import { createPackage } from "../../Services/PackageApi";
import Breaker from "../../compoents/Breaker";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Upload, X, ImagePlus } from "lucide-react";
import { getAllCities } from "../../Services/CityApi";
// Import your getLocationByCity API function (adjust path as needed)
import { getLocationByCity } from "../../Services/LocationByCity"; // ← change to correct path

export default function AddPackageForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
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
      cityId: "", // ← added for city selection
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "locations",
  });

  const [cities, setCities] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const [primaryPreview, setPrimaryPreview] = useState(null);
  const [bannerPreviews, setBannerPreviews] = useState([]);
  const [accumulatedBannerFiles, setAccumulatedBannerFiles] = useState([]);

  const primaryFile = watch("primaryBanner");
  const bannerFiles = watch("bannerImages");
  const selectedCityId = useWatch({ control, name: "cityId" }); // ← watch city selection

  // Fetch cities on mount (your original code)
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await getAllCities({
          page: 1,
          rowsPerPage: 10,
          searchQuery: "",
        });
        if (res.status && res.data) {
          setCities(res.data);
        } else {
          toast.error(res.message || "Failed to fetch cities");
        }
      } catch (error) {
        toast.error(error.message || "Error fetching cities");
      }
    };
    fetchCities();
  }, []);

  // Fetch locations based on selected city (NEW LOGIC)
  useEffect(() => {
    if (!selectedCityId) {
      setLocationOptions([]); // Clear options when no city selected
      // Optional: clear existing location selections
      fields.forEach((_, index) => {
        setValue(`locations.${index}.location`, "");
      });
      return;
    }

    const fetchLocations = async () => {
      try {
        const res = await getLocationByCity(selectedCityId);
        // Adjust this line based on your API response structure
        const locations = res.data || res || []; // ← change if your response has different structure

        const options = locations.map((loc) => ({
          value: loc._id,
          label: loc.name,
        }));

        setLocationOptions(options);

        if (options.length === 0) {
          toast("No locations available for this city", { icon: "⚠️" });
        }
      } catch (err) {
        toast.error("Failed to load locations for this city");
        setLocationOptions([]);
      }
    };

    fetchLocations();
  }, [selectedCityId, setValue, fields]);

  // Primary banner preview (unchanged)
  useEffect(() => {
    if (primaryFile?.[0] instanceof File) {
      const url = URL.createObjectURL(primaryFile[0]);
      setPrimaryPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [primaryFile]);

  // Banner previews (unchanged)
  useEffect(() => {
    const urls = accumulatedBannerFiles.map((file) => URL.createObjectURL(file));
    setBannerPreviews(urls);
    return () => urls.forEach(URL.revokeObjectURL);
  }, [accumulatedBannerFiles]);

  const handleBannerChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    const updated = [...accumulatedBannerFiles, ...newFiles];
    setAccumulatedBannerFiles(updated);

    const dt = new DataTransfer();
    updated.forEach((file) => dt.items.add(file));
    setValue("bannerImages", dt.files, { shouldValidate: true });
    e.target.value = ""; // Reset input
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
  };

  const tagOptions = [
    { value: "popular", label: "Popular" },
    { value: "new", label: "New" },
    { value: "family", label: "Family" },
    
  ];

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name?.trim() || "");
      formData.append("packageDetails", data.packageDetails || "");
      formData.append("convienienceFee", data.convienienceFee || 0);
      formData.append("maxMember", data.maxMember || 0);
      formData.append("status", data.status);
      formData.append("timeDuration", data.timeDuration || "");
      if (data.tag?.length) formData.append("tag", data.tag.join(","));
      if (data.locations?.length) formData.append("locations", JSON.stringify(data.locations));
      if (data.totalDistance) formData.append("totalDistance", data.totalDistance);
      if (data.baseFair) formData.append("baseFair", data.baseFair);
      if (data.cityId) formData.append("cityId", data.cityId); // ← added to send cityId
      if (data.primaryBanner?.[0]) formData.append("primaryBanner", data.primaryBanner[0]);
      if (data.bannerImages) {
        Array.from(data.bannerImages).forEach((file) => formData.append("bannerImages", file));
      }

      await createPackage(formData);
      toast.success("Package created successfully!");
      navigate("/home/packagelist");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to create package");
    }
  };

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
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              Create New Package
            </h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
              {/* Basic Info Section */}
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${errors.name ? "border-red-500" : "border-gray-300"
                        }`}
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${errors.timeDuration ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors.timeDuration && (
                      <p className="text-red-500 text-sm mt-1">{errors.timeDuration.message}</p>
                    )}
                  </div>

                  {/* City - FIXED with react-hook-form */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      City <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...register("cityId", { required: "Please select a city" })}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all ${errors.cityId ? "border-red-500" : "border-gray-300"
                        }`}
                    >
                      <option value="">Select a city</option>
                      {cities.map((city) => (
                        <option key={city._id} value={city._id}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                    {errors.cityId && <p className="mt-1 text-sm text-red-500">{errors.cityId.message}</p>}
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
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all resize-y ${errors.packageDetails ? "border-red-500" : "border-gray-300"
                      }`}
                  />
                  {errors.packageDetails && (
                    <p className="text-red-500 text-sm mt-1">{errors.packageDetails.message}</p>
                  )}
                </div>
              </div>

              {/* Images Section - unchanged */}
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
                        {...register("primaryBanner", { required: "Primary banner is required" })}
                        className="hidden"
                        id="primaryBanner"
                      />
                      <label htmlFor="primaryBanner" className="cursor-pointer">
                        <ImagePlus className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm font-medium text-gray-700">
                          Click to upload primary banner
                        </p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, max 5MB</p>
                      </label>
                    </div>
                    {primaryPreview && (
                      <div className="relative inline-block">
                        <img
                          src={primaryPreview}
                          alt="Primary Preview"
                          className="w-full h-48 object-cover rounded-lg shadow-sm border"
                        />
                        <button
                          type="button"
                          onClick={removePrimary}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                    {errors.primaryBanner && (
                      <p className="text-red-500 text-sm">{errors.primaryBanner.message}</p>
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
                        id="bannerImages"
                      />
                      <label htmlFor="bannerImages" className="cursor-pointer">
                        <ImagePlus className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm font-medium text-gray-700">
                          Add more images (multiple allowed)
                        </p>
                      </label>
                    </div>

                    {bannerPreviews.length > 0 && (
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
                    )}
                  </div>
                </div>
              </div>

              {/* Pricing & Capacity - unchanged */}
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.baseFair ? "border-red-500" : "border-gray-300"
                        }`}
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.totalDistance ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors.totalDistance && (
                      <p className="text-red-500 text-sm mt-1">{errors.totalDistance.message}</p>
                    )}
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
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#FB721D] ${errors.maxMember ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {errors.maxMember && <p className="text-red-500 text-sm mt-1">{errors.maxMember.message}</p>}
                  </div>
                </div>
              </div>

              {/* Locations - Dynamic (only this section updated for city filtering) */}
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
                    No locations added yet. Click "Add Location" to start building the itinerary.
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
                          {/* Location - now city-dependent */}
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
                                  placeholder={
                                    selectedCityId ? "Search & select location" : "Select city first"
                                  }
                                  isSearchable
                                  isDisabled={!selectedCityId} // ← disabled until city selected
                                  menuPortalTarget={document.body}
                                  value={locationOptions.find((opt) => opt.value === field.value) || null}
                                  onChange={(opt) => field.onChange(opt?.value || "")}
                                  classNamePrefix="react-select"
                                  styles={{
                                    control: (base) => ({
                                      ...base,
                                      borderColor: errors.locations?.[index]?.location ? "#ef4444" : "#d1d5db",
                                      backgroundColor: !selectedCityId ? "#f3f4f6" : "white",
                                      borderRadius: "0.5rem",
                                      minHeight: "44px",
                                      cursor: !selectedCityId ? "not-allowed" : "pointer",
                                      "&:hover": { borderColor: selectedCityId ? "#FB721D" : undefined },
                                    }),
                                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    placeholder: (base) => ({
                                      ...base,
                                      color: !selectedCityId ? "#9ca3af" : "#6b7280",
                                    }),
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

                          {/* Order */}
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
                              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all text-center ${errors.locations?.[index]?.order ? "border-red-500" : "border-gray-300"
                                }`}
                            />
                            {errors.locations?.[index]?.order && (
                              <p className="text-red-500 text-xs mt-1.5">
                                {errors.locations[index].order.message}
                              </p>
                            )}
                          </div>

                          {/* Distance to Next */}
                          <div className="md:col-span-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Distance to Next (km)
                            </label>
                            <input
                              type="number"
                              step="0.1"
                              {...register(`locations.${index}.distanceToNext`, { valueAsNumber: true })}
                              placeholder="120.5"
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FB721D] focus:border-[#FB721D] transition-all"
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tags & Status - unchanged */}
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

              {/* Submit - unchanged */}
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
                      Creating Package...
                    </>
                  ) : (
                    "Create Package"
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


