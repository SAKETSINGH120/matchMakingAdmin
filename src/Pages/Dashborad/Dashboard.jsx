// import React, { useEffect, useRef, useState } from "react";
// import { useAuth } from "../../auth/AuthContext";
// import socket from "../../socket";
// import { getDashboardStats } from "../../Services/DashboardApi";
// import toast from "react-hot-toast";
// import Loader from "../../compoents/Loader";
// import NotificationBell from "./NotificationBell";
// import { FaUsers, FaHeart, FaExchangeAlt, FaStar, FaUserCheck, FaUserTimes } from "react-icons/fa";

// const MetricCard = ({ title, value, icon: Icon, progress }) => (
//   <div
//     className="bg-white rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group relative overflow-hidden"
//     style={{
//       borderColor: "var(--primary-border)",
//       boxShadow: "0 10px 15px -3px var(--primary-shadow)",
//     }}
//   >
//     <div
//       className="absolute -right-4 -bottom-4 opacity-20 text-8xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none"
//       style={{ color: "var(--primary-light)" }}
//     >
//       <Icon />
//     </div>

//     <div className="flex items-start gap-5 relative z-10">
//       <div
//         className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-colors duration-300 group-hover:text-white shadow-inner"
//         style={{
//           backgroundColor: "var(--primary-light)",
//           color: "var(--primary-color)",
//         }}
//       >
//         <Icon />
//       </div>

//       <div className="flex-1">
//         <div className="text-sm text-gray-600 font-semibold uppercase tracking-wider">
//           {title}
//         </div>
//         <div className="text-3xl font-bold text-gray-800 mt-1">{value}</div>

//         {typeof progress === "number" && (
//           <div
//             className="mt-4 h-2 rounded-full overflow-hidden"
//             style={{ backgroundColor: "var(--primary-border)" }}
//           >
//             <div
//               className="h-full rounded-full transition-all duration-1000 ease-out"
//               style={{
//                 width: `${progress}%`,
//                 backgroundColor: "var(--primary-color)",
//               }}
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// );

// // ✅ Play bell sound using Web Audio API — no .mp3 file needed, no autoplay block
// function playBellSound() {
//   try {
//     const ctx = new (window.AudioContext || window.webkitAudioContext)();

//     const playTone = (freq, startTime, duration, gain = 0.4) => {
//       const oscillator = ctx.createOscillator();
//       const gainNode = ctx.createGain();
//       oscillator.connect(gainNode);
//       gainNode.connect(ctx.destination);
//       oscillator.type = "sine";
//       oscillator.frequency.setValueAtTime(freq, startTime);
//       gainNode.gain.setValueAtTime(0, startTime);
//       gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.01);
//       gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
//       oscillator.start(startTime);
//       oscillator.stop(startTime + duration);
//     };

//     const now = ctx.currentTime;
//     playTone(880, now, 0.8, 0.35);           // A5  — ding
//     playTone(1108.73, now + 0.01, 0.6, 0.2); // C#6
//     playTone(659.25, now + 0.25, 1.0, 0.3);  // E5  — dong
//   } catch (e) {
//     console.warn("Bell sound failed:", e);
//   }
// }

// export default function Dashboard() {
//   const { auth } = useAuth();
//   const [isLoading, setIsLoading] = useState(true);
//   const [stats, setStats] = useState(null);

//   // ✅ Load notifications from localStorage so they persist across refreshes
//   const [notifications, setNotifications] = useState(() => {
//     try {
//       const saved = localStorage.getItem("admin_notifications");
//       return saved ? JSON.parse(saved) : [];
//     } catch {
//       return [];
//     }
//   });

//   // ✅ Save notifications to localStorage whenever they change
//   useEffect(() => {
//     localStorage.setItem("admin_notifications", JSON.stringify(notifications));
//   }, [notifications]);

//   // 1. Fetch initial dashboard stats
//   useEffect(() => {
//     const fetchStats = async () => {
//       try {
//         setIsLoading(true);
//         const result = await getDashboardStats();
//         if (result?.success) setStats(result.data);
//         else toast.error(result?.message || "Failed to load stats");
//       } catch (err) {
//         console.error(err);
//         toast.error("Error loading stats");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchStats();
//   }, []);

//   // 2. Socket connection + listeners
//   useEffect(() => {
//     if (!auth.token || !auth.user) return;

//     socket.connect();

//     socket.on("connect", () => {
//       console.log("✅ Socket Connected:", socket.id);
//     });

//     socket.on("connect_error", (err) => {
//       console.log("❌ Socket Error:", err.message);
//     });

//     socket.on("dashboard-update", (data) => {
//       console.log("📊 Live Dashboard Update:", data);
//       setStats(data);
//     });

//     socket.on("admin_notification", (data) => {
//       console.log("🔔 Admin Notification:", data);

//       // ✅ Web Audio bell — works without any .mp3 file
//       playBellSound();

//       toast.success(data?.message || "New Notification", {
//         icon: "🔔",
//         duration: 4000,
//       });

//       setNotifications((prev) => [
//         {
//           ...data,
//           createdAt: new Date().toISOString(),
//           isRead: false,
//         },
//         ...prev,
//       ]);
//     });

//     return () => {
//       socket.off("connect");
//       socket.off("connect_error");
//       socket.off("dashboard-update");
//       socket.off("admin_notification");
//       socket.disconnect();
//     };
//   }, [auth.token, auth.user]);

//   const clearNotifications = () => {
//     setNotifications([]);
//     localStorage.removeItem("admin_notifications");
//   };

//   const markAsRead = (index) => {
//     setNotifications((prev) =>
//       prev.map((n, i) => (i === index ? { ...n, isRead: true } : n))
//     );
//   };

//   const u = stats?.users || {};
//   const e = stats?.engagement || {};
//   const s = stats?.subscriptions || {};

//   return (
//     <div className="min-h-screen bg-gray-50/40 p-5 md:p-8">
//       <div className="max-w-8xl">

//         {/* Header */}
//         <div className="flex justify-between items-center mb-2">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Dashboard</h1>
//           <NotificationBell
//             notifications={notifications}
//             onClear={clearNotifications}
//             onMarkRead={markAsRead}
//           />
//         </div>
//         <p className="text-gray-600 mb-8">Platform overview & key metrics</p>

//         {isLoading ? (
//           <div className="flex justify-center items-center h-96">
//             <Loader />
//           </div>
//         ) : (
//           <div className="space-y-10">

//             {/* Users */}
//             <section>
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6">Users</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 <MetricCard icon={FaUsers} title="Total Users" value={u.total ?? 0} />
//                 <MetricCard icon={FaUserCheck} title="Active Users" value={u.active ?? 0} />
//                 <MetricCard icon={FaUserTimes} title="Blocked Users" value={u.blocked ?? 0} />
//                 <MetricCard icon={FaStar} title="Premium Users" value={u.premium ?? 0} />
//                 <MetricCard icon={FaUsers} title="Female Users" value={u.totalFemale ?? 0} />
//                 <MetricCard icon={FaUsers} title="Male Users" value={u.totalMale ?? 0} />
//               </div>
//             </section>

//             {/* Engagement */}
//             <section>
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6">Engagement</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <MetricCard icon={FaExchangeAlt} title="Total Swipes" value={e.totalSwipes ?? 0} />
//                 <MetricCard icon={FaHeart} title="Total Likes" value={e.totalLikes ?? 0} />
//                 <MetricCard icon={FaHeart} title="Total Matches" value={e.totalMatches ?? 0} />
//                 <MetricCard
//                   icon={FaStar}
//                   title="Like Rate"
//                   value={`${e.likeRate ?? 0}%`}
//                   progress={e.likeRate ?? 0}
//                 />
//               </div>
//             </section>

//             {/* Subscriptions */}
//             <section>
//               <h2 className="text-2xl font-semibold text-gray-800 mb-6">Subscriptions</h2>
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//                 <MetricCard icon={FaStar} title="Active Subscriptions" value={s.active ?? 0} />
//               </div>
//             </section>

//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import socket from "../../socket";
import { getDashboardStats } from "../../Services/DashboardApi";
import toast from "react-hot-toast";
import Loader from "../../compoents/Loader";
import NotificationBell from "./NotificationBell";

import {
  FaUsers,
  FaHeart,
  FaExchangeAlt,
  FaStar,
  FaUserCheck,
  FaUserTimes,
} from "react-icons/fa";

const MetricCard = ({ title, value, icon: Icon, progress }) => (
  <div className="theme-panel p-6 hover:shadow-md">
    <div className="flex justify-between items-center">
      <div>
        <p className="text-sm font-semibold uppercase text-theme-light-heading dark:text-theme-dark-textPrimary">
          {title}
        </p>

        <h3 className="mt-1 text-3xl font-bold text-theme-light-heading dark:text-theme-dark-textPrimary">
          {value}
        </h3>
      </div>

      <div className="rounded-lg bg-theme-light-primaryButton p-3 text-3xl text-white transition-colors duration-200 dark:bg-theme-dark-primaryButton">
        <Icon />
      </div>
    </div>

    {typeof progress === "number" && (
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-theme-light-border dark:bg-theme-dark-border">
        <div
          className="h-full bg-theme-light-primaryButton dark:bg-theme-dark-primaryButton"
          style={{ width: `${progress}%` }}
        />
      </div>
    )}
  </div>
);

export default function Dashboard() {
  const { auth } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);

  const isAgent = auth?.user?.role === "agent";

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await getDashboardStats();

        if (res?.success) {
          setStats(res.data);
        } else {
          toast.error("Failed to load dashboard");
        }
      } catch {
        toast.error("Dashboard error");
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  useEffect(() => {
    if (!auth?.token) return;

    socket.connect();

    socket.on("dashboard-update", (data) => {
      setStats(data);
    });

    socket.on("admin_notification", (data) => {
      toast.success(data?.message || "New Notification 🔔");

      setNotifications((prev) => [
        { ...data, createdAt: new Date(), isRead: false },
        ...prev,
      ]);
    });

    return () => {
      socket.off("dashboard-update");
      socket.off("admin_notification");
      socket.disconnect();
    };
  }, [auth]);

  const u = stats?.users || {};
  const e = stats?.engagement || {};
  const s = stats?.subscriptions || {};

  if (loading) return <Loader />;

  return (
    <div className="theme-page p-6 md:p-10">
      {/* HEADER */}

      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-theme-light-heading dark:text-theme-dark-textPrimary">
            Dashboard
          </h1>

          <p className="text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
            Platform overview & analytics
          </p>
        </div>

        <NotificationBell
          notifications={notifications}
          onClear={() => setNotifications([])}
          onMarkRead={(i) =>
            setNotifications((prev) =>
              prev.map((n, index) =>
                index === i ? { ...n, isRead: true } : n,
              ),
            )
          }
        />
      </div>

      <div className="space-y-10">
        {/* USERS SECTION */}

        {!isAgent && (
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-theme-light-heading dark:text-theme-dark-textPrimary">
              Users
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Users"
                value={u.total ?? 0}
                icon={FaUsers}
              />

              <MetricCard
                title="Active Users"
                value={u.active ?? 0}
                icon={FaUserCheck}
              />

              <MetricCard
                title="Blocked Users"
                value={u.blocked ?? 0}
                icon={FaUserTimes}
              />

              <MetricCard
                title="Premium Users"
                value={u.premium ?? 0}
                icon={FaStar}
              />

              <MetricCard
                title="Female Users"
                value={u.totalFemale ?? 0}
                icon={FaUsers}
              />

              <MetricCard
                title="Male Users"
                value={u.totalMale ?? 0}
                icon={FaUsers}
              />
            </div>
          </section>
        )}

        {/* ENGAGEMENT */}

        <section>
          <h2 className="mb-6 text-2xl font-semibold text-theme-light-heading dark:text-theme-dark-textPrimary">
            Engagement
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Swipes"
              value={e.totalSwipes ?? 0}
              icon={FaExchangeAlt}
            />

            <MetricCard
              title="Total Likes"
              value={e.totalLikes ?? 0}
              icon={FaHeart}
            />

            <MetricCard
              title="Total Matches"
              value={e.totalMatches ?? 0}
              icon={FaHeart}
            />

            <MetricCard
              title="Like Rate"
              value={`${e.likeRate ?? 0}%`}
              icon={FaStar}
              progress={e.likeRate ?? 0}
            />
          </div>
        </section>

        {/* SUBSCRIPTIONS */}

        {!isAgent && (
          <section>
            <h2 className="mb-6 text-2xl font-semibold text-theme-light-heading dark:text-theme-dark-textPrimary">
              Subscriptions
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Active Subscriptions"
                value={s.active ?? 0}
                icon={FaStar}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
