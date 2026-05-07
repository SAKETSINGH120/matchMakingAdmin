import React from "react";

const Loader = ({ text = "Loading..." }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center gap-4 bg-white px-8 py-7 rounded-2xl shadow-md">
        {/* Small Modern Ring Loader */}
        <div className="relative w-16 h-16">
          {/* Background Ring */}
          <div className="absolute inset-0 rounded-full border-[4px] border-[#5F6F5C]/20" />

          {/* Animated Ring */}
          <div className="absolute inset-0 rounded-full border-[4px] border-transparent border-t-[#5F6F5C] border-r-[#5F6F5C]/60 animate-spin-slow" />

          {/* Center Dot */}
          <div className="absolute inset-4 rounded-full bg-[#5F6F5C]/20 animate-pulse" />
        </div>

        {/* Loading Text */}
        <p className="text-[#5F6F5C] text-sm font-medium tracking-wide flex items-center gap-1">
          {text}
          <span className="flex">
            <span className="animate-bounce [animation-delay:-0.3s]">.</span>
            <span className="animate-bounce [animation-delay:-0.15s]">.</span>
            <span className="animate-bounce">.</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Loader;
