


// import React, { useEffect, useState } from "react";
// import {
//   FaUsers,
//   FaHeart,
//   FaExchangeAlt,
//   FaStar,
//   FaUserCheck,
//   FaUserTimes,
// } from "react-icons/fa";
// import { getDashboardStats } from "../../Services/DashboardApi";
// import toast from "react-hot-toast";
// import Loader from "../../compoents/Loader";

// // Reusable MetricCard ─ updated color theme to #e4ece2 / teal-green family
// const MetricCard = ({ title, value, icon: Icon, progress }) => (
//   <div className="bg-white rounded-2xl p-6 border border-[#d4e4d8] shadow-lg shadow-[#c3d5c8]/20 hover:shadow-xl hover:shadow-[#a8c5ac]/30 transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden">
//     {/* Subtle background icon decoration */}
//     <div className="absolute -right-4 -bottom-4 text-[#e4ece2] opacity-20 text-8xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
//       <Icon />
//     </div>

//     <div className="flex items-start gap-5 relative z-10">
//       <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl text-teal-600 bg-[#e4ece2] transition-colors duration-300 group-hover:bg-teal-600 group-hover:text-white shadow-inner">
//         <Icon />
//       </div>

//       <div className="flex-1">
//         <div className="text-sm text-gray-600 font-semibold uppercase tracking-wider">
//           {title}
//         </div>
//         <div className="text-3xl font-bold text-gray-800 mt-1">{value}</div>

//         {typeof progress === "number" && (
//           <div className="mt-4 h-2 bg-[#d4e4d8] rounded-full overflow-hidden">
//             <div
//               className="h-full rounded-full bg-teal-600 transition-all duration-1000 ease-out"
//               style={{ width: `${progress}%` }}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// );

// export default function Dashboard() {
//   const [isLoading, setIsLoading] = useState(true);
//   const [stats, setStats] = useState(null);

//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         setIsLoading(true);
//         const result = await getDashboardStats();

//         if (result?.success) {
//           // toast.success("Dashboard stats loaded!");
//           setStats(result.data);
//         } else {
//           toast.error(result?.message || "Failed to load dashboard stats");
//         }
//       } catch (error) {
//         console.error("Dashboard fetch error:", error);
//         toast.error("Error loading dashboard data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchStats();
//   }, []);

//   // Helper to safely access nested values
//   const u = stats?.users || {};
//   const e = stats?.engagement || {};
//   const s = stats?.subscriptions || {};

//   return (
//     <div className="min-h-screen bg-gray-50/40 p-5 md:p-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
//             Dashboard
//           </h1>
//           <p className="text-gray-600 mt-2">Platform overview & key metrics</p>
//         </div>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-96">
//             <Loader />
//           </div>
//         ) : (
//           <div className="space-y-10">
//             {/* ── User Statistics ── */}
//             <section>
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//                 Users
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 <MetricCard icon={FaUsers} title="Total Users" value={u.total ?? 0} />
//                 <MetricCard
//                   icon={FaUserCheck}
//                   title="Active Users"
//                   value={u.active ?? 0}
//                 />
//                 <MetricCard
//                   icon={FaUserTimes}
//                   title="Blocked Users"
//                   value={u.blocked ?? 0}
//                 />
//                 <MetricCard
//                   icon={FaStar}
//                   title="Premium Users"
//                   value={u.premium ?? 0}
//                 />
//                 <MetricCard
//                   icon={FaUsers}
//                   title="Female Users"
//                   value={u.totalFemale ?? 0}
//                 />
//                 <MetricCard
//                   icon={FaUsers}
//                   title="Male Users"
//                   value={u.totalMale ?? 0}
//                 />
//               </div>
//             </section>

//             {/* ── Engagement ── */}
//             <section>
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//                 Engagement
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <MetricCard
//                   icon={FaExchangeAlt}
//                   title="Total Swipes"
//                   value={e.totalSwipes ?? 0}
//                 />
//                 <MetricCard
//                   icon={FaHeart}
//                   title="Total Likes"
//                   value={e.totalLikes ?? 0}
//                 />
//                 <MetricCard
//                   icon={FaHeart}
//                   title="Total Matches"
//                   value={e.totalMatches ?? 0}
//                 />
//                 <MetricCard
//                   icon={FaStar}
//                   title="Like Rate"
//                   value={`${e.likeRate ?? 0}%`}
//                   progress={e.likeRate ?? 0}
//                 />
//               </div>
//             </section>

//             {/* ── Subscriptions ── */}
//             <section>
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//                 Subscriptions
//               </h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <MetricCard
//                   icon={FaStar}
//                   title="Active Subscriptions"
//                   value={s.active ?? 0}
//                 />
//               </div>
//             </section>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  FaUsers,
  FaHeart,
  FaExchangeAlt,
  FaStar,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";
import { getDashboardStats } from "../../Services/DashboardApi";
import toast from "react-hot-toast";
import Loader from "../../compoents/Loader";

// Reusable MetricCard ─ updated color theme to primary color
const MetricCard = ({ title, value, icon: Icon, progress }) => (
  <div className="bg-white rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden"
       style={{
         borderColor: "var(--primary-border)",
         boxShadow: "0 10px 15px -3px var(--primary-shadow)"
       }}>
    
    {/* Subtle background icon decoration */}
    <div
      className="absolute -right-4 -bottom-4 opacity-20 text-8xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none"
      style={{ color: "var(--primary-light)" }}
    >
      <Icon />
    </div>

    <div className="flex items-start gap-5 relative z-10">
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-colors duration-300 group-hover:text-white shadow-inner"
        style={{
          backgroundColor: "var(--primary-light)",
          color: "var(--primary-color)"
        }}
      >
        <Icon />
      </div>

      <div className="flex-1">
        <div className="text-sm text-gray-600 font-semibold uppercase tracking-wider">
          {title}
        </div>
        <div className="text-3xl font-bold text-gray-800 mt-1">{value}</div>

        {typeof progress === "number" && (
          <div
            className="mt-4 h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: "var(--primary-border)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out"
              style={{
                width: `${progress}%`,
                backgroundColor: "var(--primary-color)"
              }}
            />
          </div>
        )}
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const result = await getDashboardStats();

        if (result?.success) {
          setStats(result.data);
        } else {
          toast.error(result?.message || "Failed to load dashboard stats");
        }
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error("Error loading dashboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const u = stats?.users || {};
  const e = stats?.engagement || {};
  const s = stats?.subscriptions || {};

  return (
    <div className="min-h-screen bg-gray-50/40 p-5 md:p-8">
      <div className="max-w-8xl ">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Platform overview & key metrics</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <Loader />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Users */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Users
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <MetricCard icon={FaUsers} title="Total Users" value={u.total ?? 0} />
                <MetricCard icon={FaUserCheck} title="Active Users" value={u.active ?? 0} />
                <MetricCard icon={FaUserTimes} title="Blocked Users" value={u.blocked ?? 0} />
                <MetricCard icon={FaStar} title="Premium Users" value={u.premium ?? 0} />
                <MetricCard icon={FaUsers} title="Female Users" value={u.totalFemale ?? 0} />
                <MetricCard icon={FaUsers} title="Male Users" value={u.totalMale ?? 0} />
              </div>
            </section>

            {/* Engagement */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Engagement
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard icon={FaExchangeAlt} title="Total Swipes" value={e.totalSwipes ?? 0} />
                <MetricCard icon={FaHeart} title="Total Likes" value={e.totalLikes ?? 0} />
                <MetricCard icon={FaHeart} title="Total Matches" value={e.totalMatches ?? 0} />
                <MetricCard
                  icon={FaStar}
                  title="Like Rate"
                  value={`${e.likeRate ?? 0}%`}
                  progress={e.likeRate ?? 0}
                />
              </div>
            </section>

            {/* Subscriptions */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Subscriptions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard icon={FaStar} title="Active Subscriptions" value={s.active ?? 0} />
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}