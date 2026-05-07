import React from "react";
import Profilelogo from "./Profilelogo";
import { IoMdNotificationsOutline } from "react-icons/io";

const Navbar = () => {
  return (
    <nav className="w-full bg-[#e8ede6] shadow-sm border-b border-orange-100 flex items-center py-2 h-18 z-30">
      {/* Logo/Title */}
      <div className="flex items-center  min-w-[180px]">
        {/* <img
          src={"../profilelogo.png"}
          alt="Logo"
          className="h-10 w-10 rounded-full object-cover shadow"
        /> */}
        {/* <div className="">
          <img className="h-16 w-auto" src="/images/Logo.png" alt="Logo" />
        </div> */}
      </div>

      {/* Search Bar (hidden on mobile) */}
      {/* <div className="flex-1 flex justify-center px-4">
        <div className="hidden md:flex w-full max-w-md">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 rounded-l-md border-none outline-none text-gray-700"
          />
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-r-md font-semibold">
            Search
          </button>
        </div>
      </div> */}

      {/* Right Side: Notification & Profile */}
      <div className="flex items-center gap-4 ml-auto">
        {/* <button className="relative p-2 rounded-full bg-white hover:bg-emerald-100 shadow">
          {/* <IoMdNotificationsOutline className="text-2xl text-emerald-600" /> */}
        {/* Notification dot */}
        {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span> */}
        {/* </button>  */}
        {/* <img
          src={"/images/profilelogo.png"}
          alt="Logo"
          className="h-12 w-12 rounded-full object-cover shadow"
        /> */}
        <Profilelogo />
      </div>
    </nav>
  );
};

export default Navbar;
