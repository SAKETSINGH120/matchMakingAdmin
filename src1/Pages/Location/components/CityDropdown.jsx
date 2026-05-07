import { useCallback, useEffect, useRef, useState } from "react";
import { getAllCities } from "../../../Services/CityApi";
import toast from "react-hot-toast";

const ROWS_PER_PAGE = 20;

const CityDropdown = ({ selectedCity, onSelect, apiError = {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState({
    list: [],
    page: 1,
    hasMore: true,
    search: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const observer = useRef();

  // Close when click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectCity = (city) => {
    onSelect(city);
    setIsOpen(false);
    setSearchQuery("");
  };

  const fetchData = useCallback(
    async (page, search = "", reset = false) => {
      if (!data.hasMore && !reset) return;
      setLoading(true);

      try {
        const res = await getAllCities({
          page,
          rowsPerPage: ROWS_PER_PAGE,
          searchQuery: search,
        });

        const newItems = res?.data || [];
        setData((prev) => ({
          ...prev,
          list: reset ? newItems : [...prev.list, ...newItems],
          page: reset ? 2 : page + 1,
          hasMore: newItems.length === ROWS_PER_PAGE,
          search,
        }));
      } catch (err) {
        console.log("Cities fetch error:", err);
        toast.error("Failed to load cities");
      } finally {
        setLoading(false);
      }
    },
    [data.hasMore]
  );

  // Infinite scroll observer
  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && data.hasMore) {
          fetchData(data.page, data.search);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, data.hasMore, data.page, data.search, fetchData]
  );

  // Initial load
  useEffect(() => {
    fetchData(1, "", true);
  }, [fetchData]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== data.search) {
        fetchData(1, searchQuery, true);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, fetchData]);

  return (
    <div className="my-4">
      <label className="ml-2 font-normal block mb-2">City<span className="text-red-500">*</span></label>

      <div className="relative" ref={dropdownRef}>
        <input
          type="text"
          value={isOpen ? searchQuery : selectedCity?.name || ""}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Select city..."
          className="w-full h-11 border border-gray-400 rounded-xl pl-4 pr-10 focus:outline-none focus:border-[#c1ab87]"
        />

        {/* Dropdown arrow */}
        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
          {isOpen ? "▲" : "▼"}
        </span>

        {isOpen && (
          <div className="absolute w-full z-10 mt-1 max-h-64 overflow-y-auto border border-gray-300 rounded-xl bg-white shadow-xl">
            {data.list.length === 0 && !loading ? (
              <div className="p-4 text-gray-500 text-center">No cities found</div>
            ) : (
              data.list.map((city, index) => (
                <div
                  key={city._id}
                  ref={index === data.list.length - 1 ? lastItemRef : null}
                  onClick={() => selectCity(city)}
                  className={`px-4 py-3 cursor-pointer hover:bg-gray-100 transition-colors
                    ${selectedCity?._id === city._id ? "bg-amber-50 text-amber-800 font-medium" : ""}`}
                >
                  {city.name}
                </div>
              ))
            )}

            {loading && (
              <div className="p-4 text-center text-gray-500">Loading...</div>
            )}
          </div>
        )}
      </div>

      {apiError.city && (
        <p className="text-red-500 text-sm ml-2 mt-1">{apiError.city}</p>
      )}
    </div>
  );
};

export default CityDropdown;