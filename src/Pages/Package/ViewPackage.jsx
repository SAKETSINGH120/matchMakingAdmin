// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { getPackageById } from "../../Services/PackageApi";
// import { getAllCities } from "../../Services/CityApi";
// const BASE_URL = import.meta.env.VITE_BASE_URL;
// import Breaker from "../../compoents/Breaker";

// export default function ViewPackage() {
//   const { id } = useParams();
//   const [packageData, setPackageData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [currentSlide, setCurrentSlide] = useState(0);

//   useEffect(() => {
//     getPackageById(id)
//       .then((res) => {
//         setPackageData(res.data);
//         setLoading(false);
//       })
//       .catch(() => setLoading(false));
//   }, [id]);

//   // Auto-slide for gallery
//   useEffect(() => {
//     if (!packageData?.bannerImages || packageData.bannerImages.length <= 1) return;

//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % packageData.bannerImages.length);
//     }, 4000);

//     return () => clearInterval(interval);
//   }, [packageData?.bannerImages]);

//   if (loading)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//         <p className="text-xl text-gray-600">Loading package details...</p>
//       </div>
//     );

//   if (!packageData)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
//         <p className="text-xl text-red-600">Package not found</p>
//       </div>
//     );

//   const imageBaseUrl = `${BASE_URL}/`;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
//       <div className="max-w-7xl mx-auto space-y-4">
//         <div className="mb-10">
//           <Breaker />
//         </div>

//         {/* 1. Header Section */}
//         <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-white/60">
//           <div className="bg-[#f74500] text-white p-6">
//             <h1 className="text-3xl font-bold">{packageData.name}</h1>
//             <div className="flex items-center gap-3 mt-3">
//               <span
//                 className={`px-4 py-1.5 rounded-full text-sm font-bold ${packageData.status === "active"
//                   ? "bg-green-600 text-white"
//                   : "bg-gray-600 text-white"
//                   }`}
//               >
//                 {packageData.status.charAt(0).toUpperCase() + packageData.status.slice(1)}
//               </span>
//               {packageData.tag && (
//                 <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-yellow-400/30 text-yellow-100">
//                   {packageData.tag.toUpperCase()}
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Overview */}
//           {/* <div className="p-5 bg-gradient-to-r from-gray-50 to-gray-100">
//             <h2 className="text-lg font-bold text-gray-800 mb-2">Overview</h2>
//             <p className="text-sm text-gray-700">
//               {packageData.packageDetails || "No details provided."}
//             </p>
//           </div> */}
//         </div>

//         {/* 2. Pricing Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
//           <PricingCard icon="💰" label="Base Fare" value={`₹ ${packageData.baseFair}`} gradient="from-emerald-500 to-teal-600" />
//           <PricingCard icon="➕" label="Convenience Fee" value={`₹ ${packageData.convienienceFee || 0}`} gradient="from-blue-500 to-indigo-600" />
//           <PricingCard icon="🛣️" label="Total Distance" value={`${packageData.totalDistance} km`} gradient="from-purple-500 to-pink-600" />
//           <PricingCard icon="⏳" label="Duration" value={`${packageData.timeDuration} Days`} gradient="from-orange-500 to-red-600" />
//           <PricingCard icon="👥" label="Max Members" value={packageData.maxMember} gradient="from-cyan-500 to-blue-600" />
//         </div>

//         {/* 3. Itinerary Stops */}
//         <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-white/60">
//           <div className="bg-[#f74500] text-white p-4">
//             <h2 className="text-xl font-bold">Itinerary Stops</h2>
//           </div>
//           <div className="p-4 overflow-x-auto">
//             <table className="w-full text-left text-sm">
//               <thead>
//                 <tr className="text-gray-600 uppercase tracking-wider border-b">
//                   <th className="pb-3">#</th>
//                   <th className="pb-3">Location</th>
//                   <th className="pb-3">Order</th>
//                   <th className="pb-3">Distance to Next</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {packageData.locations
//                   .sort((a, b) => a.order - b.order)
//                   .map((stop, index) => (
//                     <tr key={stop._id} className="border-b hover:bg-indigo-50 transition">
//                       <td className="py-3 font-bold text-indigo-700">{index + 1}</td>
//                       <td className="py-3 text-gray-800">{stop.location?.name || "N/A"}</td>
//                       <td className="py-3 text-gray-700">{stop.order}</td>
//                       <td className="py-3 text-gray-700">
//                         {stop.distanceToNext ? `${stop.distanceToNext} km` : "-"}
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* 4. Package Details - Full Description (moved here as separate section) */}
//         <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/60">
//           <h2 className="text-xl font-bold text-gray-800 mb-4">Package Details</h2>
//           <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
//             {packageData.packageDetails || "No additional details provided."}
//           </p>
//         </div>

//         {/* 5. Images Section - Primary + Gallery Carousel */}
//         <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-white/60">
//           <div className="bg-[#f74500] text-white p-4">
//             <h2 className="text-xl font-bold">Image</h2> {/* New Name */}
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
//             {/* Primary Image */}
//             <div className="rounded-xl overflow-hidden shadow-lg">
//               <img
//                 src={`${imageBaseUrl}${packageData.primaryBanner}`}
//                 alt={`${packageData.name} - Primary`}
//                 className="w-full h-40 md:h-48 object-cover"
//               />
//               <p className="text-center text-sm text-gray-600 mt-2">Primary Banner Image</p>
//             </div>

//             {/* Gallery Carousel */}
//             {packageData.bannerImages && packageData.bannerImages.length > 0 && (
//               <div className="relative rounded-xl overflow-hidden shadow-lg">
//                 <div className="overflow-hidden rounded-xl">
//                   <div
//                     className="flex transition-transform duration-700 ease-in-out"
//                     style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//                   >
//                     {packageData.bannerImages.map((img, idx) => (
//                       <img
//                         key={idx}
//                         src={`${imageBaseUrl}${img}`}
//                         alt={`Gallery ${idx + 1}`}
//                         className="w-full h-40 md:h-48 object-cover flex-shrink-0 rounded-md"
//                       />
//                     ))}
//                   </div>
//                 </div>

//                 {/* Dots */}
//                 {packageData.bannerImages.length > 1 && (
//                   <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
//                     {packageData.bannerImages.map((_, idx) => (
//                       <button
//                         key={idx}
//                         onClick={() => setCurrentSlide(idx)}
//                         className={`w-2 h-2 rounded-full transition-all ${idx === currentSlide ? "bg-white w-8" : "bg-white/50"
//                           }`}
//                       />
//                     ))}
//                   </div>
//                 )}
//                 <p className="text-center text-sm text-gray-600 mt-2">Banner Image</p>
//               </div>
//             )}
//           </div>
//         </div>


//         {/* Metadata */}
//         <div className="text-center text-xs text-gray-500 pb-6">
//           <p>Created: {new Date(packageData.createdAt).toLocaleDateString()}</p>
//           <p>Updated: {new Date(packageData.updatedAt).toLocaleDateString()}</p>
//         </div>
//       </div>
//     </div>
//   );
// }

// // Pricing Card Component
// function PricingCard({ icon, label, value, gradient }) {
//   return (
//     <div className={`bg-gradient-to-br ${gradient} p-4 rounded-xl shadow-lg text-white`}>
//       <div className="text-2xl mb-2">{icon}</div>
//       <p className="text-sm opacity-90">{label}</p>
//       <p className="text-lg font-bold mt-2">{value}</p>
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPackageById } from "../../Services/PackageApi";
import { getAllCities } from "../../Services/CityApi";   // ← added this import

const BASE_URL = import.meta.env.VITE_BASE_URL;
import Breaker from "../../compoents/Breaker";

export default function ViewPackage() {
  const { id } = useParams();
  const [packageData, setPackageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // ────────────────────────────────────────────────
  // ADDED: state + logic to show city name
  const [cityName, setCityName] = useState("Loading...");
  // ────────────────────────────────────────────────

  useEffect(() => {
    getPackageById(id)
      .then((res) => {
        setPackageData(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // ────────────────────────────────────────────────
  // ADDED: Fetch all cities → find matching city name
  useEffect(() => {
    if (!packageData?.cityId?._id) return;

    const cityId = packageData.cityId._id;

    getAllCities({ page: 1, rowsPerPage: 999, searchQuery: "" })
      .then((res) => {
        if (res.status && res.data) {
          const found = res.data.find((c) => c._id === cityId);
          setCityName(found ? found.name : "Unknown City");
        }
      })
      .catch(() => {
        setCityName("City not found");
      });
  }, [packageData?.cityId?._id]);
  // ────────────────────────────────────────────────

  // Auto-slide for gallery
  useEffect(() => {
    if (!packageData?.bannerImages || packageData.bannerImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % packageData.bannerImages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [packageData?.bannerImages]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-xl text-gray-600">Loading package details...</p>
      </div>
    );

  if (!packageData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <p className="text-xl text-red-600">Package not found</p>
      </div>
    );

  const imageBaseUrl = `${BASE_URL}/`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto space-y-4">
        <div className="mb-10">
          <Breaker />
        </div>

        {/* 1. Header Section */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-white/60">
          <div className="bg-[#f74500] text-white p-6">
            <h1 className="text-3xl font-bold">{packageData.name}</h1>
            
            {/* ──────────────────────────────────────────────── */}
            {/* ADDED: showing city name here */}
            <p className="mt-1 text-lg opacity-90">
              {cityName}
            </p>
            {/* ──────────────────────────────────────────────── */}
            
            <div className="flex items-center gap-3 mt-3">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-bold ${
                  packageData.status === "active"
                    ? "bg-green-600 text-white"
                    : "bg-gray-600 text-white"
                }`}
              >
                {packageData.status.charAt(0).toUpperCase() + packageData.status.slice(1)}
              </span>
              {packageData.tag && (
                <span className="px-4 py-1.5 rounded-full text-sm font-bold bg-yellow-400/30 text-yellow-100">
                  {packageData.tag.toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 2. Pricing Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <PricingCard icon="💰" label="Base Fare" value={`₹ ${packageData.baseFair}`} gradient="from-emerald-500 to-teal-600" />
          <PricingCard icon="➕" label="Convenience Fee" value={`₹ ${packageData.convienienceFee || 0}`} gradient="from-blue-500 to-indigo-600" />
          <PricingCard icon="🛣️" label="Total Distance" value={`${packageData.totalDistance} km`} gradient="from-purple-500 to-pink-600" />
          <PricingCard icon="⏳" label="Duration" value={`${packageData.timeDuration} Days`} gradient="from-orange-500 to-red-600" />
          <PricingCard icon="👥" label="Max Members" value={packageData.maxMember} gradient="from-cyan-500 to-blue-600" />
        </div>

        {/* 3. Itinerary Stops */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-white/60">
          <div className="bg-[#f74500] text-white p-4">
            <h2 className="text-xl font-bold">Itinerary Stops</h2>
          </div>
          <div className="p-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-600 uppercase tracking-wider border-b">
                  <th className="pb-3">#</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Distance to Next</th>
                </tr>
              </thead>
              <tbody>
                {packageData.locations
                  .sort((a, b) => a.order - b.order)
                  .map((stop, index) => (
                    <tr key={stop._id} className="border-b hover:bg-indigo-50 transition">
                      <td className="py-3 font-bold text-indigo-700">{index + 1}</td>
                      <td className="py-3 text-gray-800">{stop.location?.name || "N/A"}</td>
                      <td className="py-3 text-gray-700">{stop.order}</td>
                      <td className="py-3 text-gray-700">
                        {stop.distanceToNext ? `${stop.distanceToNext} km` : "-"}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Package Details */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/60">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Package Details</h2>
          <p className="text-base text-gray-700 leading-relaxed whitespace-pre-wrap">
            {packageData.packageDetails || "No additional details provided."}
          </p>
        </div>

        {/* 5. Images Section */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-white/60">
          <div className="bg-[#f74500] text-white p-4">
            <h2 className="text-xl font-bold">Image</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
            {/* Primary Image */}
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img
                src={`${imageBaseUrl}${packageData.primaryBanner}`}
                alt={`${packageData.name} - Primary`}
                className="w-full h-40 md:h-48 object-cover"
              />
              <p className="text-center text-sm text-gray-600 mt-2">Primary Banner Image</p>
            </div>

            {/* Gallery Carousel */}
            {packageData.bannerImages && packageData.bannerImages.length > 0 && (
              <div className="relative rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-hidden rounded-xl">
                  <div
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {packageData.bannerImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={`${imageBaseUrl}${img}`}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-40 md:h-48 object-cover flex-shrink-0 rounded-md"
                      />
                    ))}
                  </div>
                </div>
                {/* Dots */}
                {packageData.bannerImages.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {packageData.bannerImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentSlide ? "bg-white w-8" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                )}
                <p className="text-center text-sm text-gray-600 mt-2">Banner Image</p>
              </div>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="text-center text-xs text-gray-500 pb-6">
          <p>Created: {new Date(packageData.createdAt).toLocaleDateString()}</p>
          <p>Updated: {new Date(packageData.updatedAt).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

// Pricing Card Component (unchanged)
function PricingCard({ icon, label, value, gradient }) {
  return (
    <div className={`bg-gradient-to-br ${gradient} p-4 rounded-xl shadow-lg text-white`}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-sm opacity-90">{label}</p>
      <p className="text-lg font-bold mt-2">{value}</p>
    </div>
  );
}