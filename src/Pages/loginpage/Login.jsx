// import React, { useState, useEffect } from "react";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import { useAuth } from "../auth/AuthContext";
// import { useNavigate } from "react-router-dom";
// import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
// import { FaMapMarkerAlt, FaRoute } from "react-icons/fa";
// import { RiTaxiFill } from "react-icons/ri";

// import "../App.css";
// function Loginpage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const { login } = useAuth();
//   const navigate = useNavigate();
//   useEffect(() => {
//     AOS.init({ duration: 1000, once: true, easing: "ease-in-out" });
//   }, []);
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const { success, error } = await login({ email, password });
//     if (success) {
//       navigate("/home");
//     } else {
//       alert("Login failed. Please check credentials.");
//       console.error(error);
//     }
//   };
//   return (
//     <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#e1e9de] relative overflow-hidden">
//       {/* Animated background shapes */}
//       {/* <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#e9eee7] opacity-30 rounded-full blur-3xl animate-pulse z-0" />{" "}
//       <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#e9eee7] opacity-20 rounded-full blur-3xl animate-pulse z-0" /> */}
//       {/* Left Panel */}{" "}
//       <div className="hidden md:flex flex-col justify-center items-center w-1/2 relative z-10">
//         {" "}
//         <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-20 w-3/4 flex flex-col items-center">
//           {" "}
//           <div className="flex flex-col items-center justify-center  mb-20">
//             <img
//               src="/images/Logo3.jpg"
//               alt="Logo"
//               className="h-32 w-32 object-contain"
//             />

//             <h2
//               className="text-4xl logo-font text-black mt-1 tracking-wide"
//               style={{
//                 fontFamily: "Playfair Display, serif",
//                 fontStyle: "italic",
//                 fontWeight: 600,
//               }}
//             >
//               Matchmaking
//             </h2>
//           </div>
//           {/* <p className="text-lg text-black-100 text-center max-w-xs mb-8 mt-1" >
//             {" "}
//             Sign in to access your dashboard and manage your account.{" "}
//           </p>{" "} */}
//         </div>{" "}
//       </div>
//       {/* Right Panel (Login Card) */}{" "}
//       <div className="flex flex-1 justify-center items-center min-h-screen relative z-10">
//         {" "}
//         <div
//           className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-xl p-8 md:p-12 z-10 border border-[#e9eee7]"
//           data-aos="zoom-in"
//         >
//           {" "}
//           {/* Logo (mobile only) */}{" "}
//           <div className="flex justify-center mb-2 mt-4 md:hidden">
//             {" "}
//             <img
//               className="h-20 w-20 rounded-full shadow-lg border-2 border-white logo-bounce"
//               src="/images/logo.png"
//               alt="Logo"
//             />{" "}
//           </div>{" "}
//           {/* Form Title & Subtitle */}{" "}
//           <h1 className="text-3xl font-bold text-center text-black-100 mb-2 tracking-tight">
//             {" "}
//             Sign in to your account{" "}
//           </h1>{" "}
//           <p className="text-center text-black-300 mb-8">
//             {" "}
//             Access your dashboard and manage your services{" "}
//           </p>{" "}
//           {/* Form */}{" "}
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {" "}
//             <div className="relative">
//               {" "}
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-black-200 mb-1"
//               >
//                 {" "}
//                 Email{" "}
//               </label>{" "}
//               <span className="absolute left-3 top-10 text-black-400 text-lg">
//                 {" "}
//                 <FiMail />{" "}
//               </span>{" "}
//               <input
//                 id="email"
//                 type="email"
//                 placeholder="Enter your email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 dark:focus:ring-[#e3ebe0] focus:border-transparent transition duration-300 bg-white text-gray-700 placeholder-gray-400"
//                 required
//               />
//             </div>
//             <div className="relative">
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-black-200 mb-1"
//               >
//                 Password
//               </label>
//               <span className="absolute left-3 top-10 text-black-400 text-lg">
//                 <FiLock />
//               </span>
//               <input
//                 id="password"
//                 type={showPassword ? "text" : "password"}
//                 placeholder="Enter your password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 dark:focus:ring-[#e3ebe0] focus:border-transparent transition duration-300 bg-white text-gray-700 placeholder-gray-400"
//                 required
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-10 text-gray-400 hover:text-orange-500 focus:outline-none"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 tabIndex={-1}
//               >
//                 {showPassword ? <FiEyeOff /> : <FiEye />}
//               </button>
//             </div>
//             <div className="flex justify-between items-center">
//               <div />
//               {/* <a
//                 href="#"
//                 className="text-sm text-blue-300 hover:underline font-medium"
//               >
//                 Forgot password?
//               </a> */}
//             </div>
//             <button
//               type="submit"
//               className="w-full py-3 bg-[#3f4f3c] text-white rounded-lg font-bold text-lg shadow-lg hover:bg-[#5f6f5c] hover:scale-[1.02] focus:outline-none focus:ring-2 dark:focus:ring-[#8f9f8c] focus:ring-offset-2 transition duration-300 transform"
//             >
//               Log In
//             </button>
//           </form>
//           {/* Additional Links */} <div className="mt-6 text-center"></div>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default Loginpage;

import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";

import "../../App.css";

function Loginpage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1200,
      once: true,
      easing: "ease-out-cubic",
      mirror: false,
      anchorPlacement: "top-bottom",
      offset: 60,
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { success, error } = await login({ email, password });
    if (success) {
      navigate("/home");
    } else {
      alert("Login failed. Please check credentials.");
      console.error(error);
    }
  };

  return (
    <div className="h-screen w-full  flex items-center justify-center bg-[#3f4f3c] relative overflow-hidden px-4 sm:px-6 lg:px-8 py-8 md:py-0">
      <div className="absolute -top-20 -left-20 md:-top-40 md:-left-40 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-br from-[#e9eee7] to-[#d8e0d5] opacity-40 rounded-full blur-3xl animate-[pulse_12s_ease-in-out_infinite] z-0" />
      <div className="absolute -bottom-20 -right-20 md:-bottom-40 md:-right-40 w-64 h-64 md:w-96 md:h-96 bg-gradient-to-tl from-[#e9eee7] to-[#d0dcd0] opacity-30 rounded-full blur-3xl animate-[pulse_15s_ease-in-out_infinite_3s] z-0" />
      {/* Single centered container for both sides */}
      <div
        className="w-full max-w-6xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-[#e9eee7] overflow-hidden flex flex-col md:flex-row relative z-10"
        data-aos="fade-up"
        data-aos-duration="1000"
        data-aos-easing="ease-out-cubic"
      >
        {/* Left Panel – Brand / Hero area */}
        <div className=" bg-[#e1e9de] hidden md:flex flex-col justify-center items-center w-[50%] relative z-10 ">
          <div
            className=" backdrop-blur-2xl 
               rounded-[40px] 
               p-20 lg:p-28 
               w-[90%] max-w-2xl 
               flex flex-col items-center 
               "
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-easing="ease-out-cubic"
          >
            <div className="flex flex-col items-center justify-center mb-20">
              <img
                src="/images/MatchLogo.png"
                alt="Logo"
                className="h-40 w-40 md:h-48 md:w-48 object-contain rounded-fullborder-4 border-white "
                data-aos="zoom-in"
                data-aos-delay="100"
                data-aos-duration="900"
              />

              <h2
                className="text-5xl md:text-6xl logo-font text-black tracking-wider mt-1 "
                style={{
                  fontFamily: "Playfair Display, serif",
                  fontStyle: "italic",
                  fontWeight: 700,
                }}
                data-aos="fade-up"
                data-aos-delay="500"
                data-aos-duration="800"
              >
                Matchmaking
              </h2>
            </div>
          </div>
        </div>

        {/* Right Panel – Login Form */}
        <div className="w-full md:w-2/5 lg:w-[50%] flex justify-center items-center p-8 md:p-12 lg:p-16">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="flex justify-center mb-8 md:hidden">
              <img
                className="h-20 w-20 rounded-full shadow-xl ring-2 ring-white/60 logo-bounce"
                src="/images/logo.png"
                alt="Logo"
                data-aos="zoom-in"
                data-aos-duration="800"
              />
            </div>

            {/* Title */}
            <h1
              className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-3 tracking-tight"
              data-aos="fade-down"
              data-aos-delay="100"
            >
              Sign in to Admin Panel
            </h1>
            <p
              className="text-center text-gray-600 mb-10 text-sm md:text-base"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Access your dashboard and manage your services
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-7">
              {/* Email */}
              <div
                className="relative group"
                data-aos="fade-right"
                data-aos-delay="300"
              >
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1.5 transition-all group-focus-within:text-[#4a5c48]"
                >
                  Email
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl transition-colors group-focus-within:text-[#5f6f5c]">
                    <FiMail />
                  </span>
                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a9f8a]/60 focus:border-[#8a9f8a]/40 transition-all duration-300 placeholder-gray-400 text-gray-800"
                    required
                  />
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#a0b0a0] to-[#c0d0c0] scale-x-0 origin-left transition-transform duration-300 peer-focus:scale-x-100 rounded-full" />
                </div>
              </div>

              {/* Password */}
              <div
                className="relative group"
                data-aos="fade-left"
                data-aos-delay="400"
              >
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1.5 transition-all group-focus-within:text-[#4a5c48]"
                >
                  Password
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-xl transition-colors group-focus-within:text-[#5f6f5c]">
                    <FiLock />
                  </span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer w-full pl-12 pr-12 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8a9f8a]/60 focus:border-[#8a9f8a]/40 transition-all duration-300 placeholder-gray-400 text-gray-800"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#5f6f5c] focus:outline-none transition-colors duration-200"
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-gradient-to-r from-[#a0b0a0] to-[#c0d0c0] scale-x-0 origin-left transition-transform duration-300 peer-focus:scale-x-100 rounded-full" />
                </div>
              </div>

              <div className="flex justify-between items-center text-sm">
                <div />
                {/* <a href="#" className="text-[#5f6f5c] hover:underline font-medium">Forgot password?</a> */}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#3f4f3c] text-white rounded-xl font-semibold text-lg shadow-lg hover:bg-[#4f5f4c] hover:shadow-xl hover:scale-[1.015] focus:outline-none focus:ring-2 focus:ring-[#8f9f8c]/70 focus:ring-offset-2 transition-all duration-300 transform active:scale-[0.98]"
                data-aos="zoom-in"
                data-aos-delay="600"
              >
                Log In
              </button>
            </form>

            <div className="mt-8 text-center text-sm text-gray-600">
              {/* Sign up link later if needed */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loginpage;
