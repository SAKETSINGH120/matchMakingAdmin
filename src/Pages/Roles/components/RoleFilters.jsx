import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { ClearBtn } from "../../../compoents/Button";

const RoleFilters = ({ searchParams, setSearchParams, search, setSearch }) => {
  const [isFiltered, setIsFiltered] = useState(false);

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      const sp = new URLSearchParams(searchParams);
      if (search) sp.set("search", search);
      else sp.delete("search");
      sp.set("page", "1");
      setSearchParams(sp, { replace: true });
      setIsFiltered(true);
    }
  };

  const handleOnSearch = () => {
    if (search.trim() === "") {
      toast.error("Please enter at least one search criteria.");
      return;
    }
    const sp = new URLSearchParams(searchParams);
    if (search) sp.set("search", search);
    else sp.delete("search");
    sp.set("page", "1");
    setSearchParams(sp, { replace: true });
    setIsFiltered(true);
  };

  const handleClearFilters = () => {
    setSearch("");
    const sp = new URLSearchParams(searchParams);

    sp.delete("search");
    sp.set("page", "1");
    setSearchParams(sp, { replace: true });
    setIsFiltered(false);
  };

  return (
    <div className="flex items-center gap-4">
      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="theme-input w-60 rounded-lg shadow-sm"
        aria-label="Search colleges by name"
        onKeyDown={handleOnKeyDown}
      />
      <button
        onClick={handleOnSearch}
        className="theme-btn-primary cursor-pointer px-5 py-2.5"
      >
        <FaSearch size={18} />
      </button>
      {isFiltered && <ClearBtn handleClear={handleClearFilters} />}
    </div>
  );
};

export default RoleFilters;
