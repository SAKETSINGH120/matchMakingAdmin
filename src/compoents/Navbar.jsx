import React from "react";
import Profilelogo from "./Profilelogo";
import { Moon, Sun } from "lucide-react";
import { useThemeMode } from "../context/ThemeContext";

const Navbar = () => {
  const { theme, toggleTheme } = useThemeMode();

  return (
    <nav className="z-30 flex h-18 w-full items-center border-b border-theme-light-border bg-theme-light-surfaceAlt py-2 shadow-sm transition-colors duration-200 dark:border-theme-dark-border dark:bg-theme-dark-surface">
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
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-btn-secondary mr-2 gap-2 rounded-full px-3 py-2"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          {theme === "light" ? (
            <Moon size={16} className="text-theme-dark-bg" />
          ) : (
            <Sun size={16} className="text-theme-dark-warning" />
          )}
          <span className="text-xs font-semibold">
            {theme === "light" ? "Dark" : "Light"}
          </span>
        </button>
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
