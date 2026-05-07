import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import toast from "react-hot-toast";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Loader from "../../compoents/Loader";
import {
  getAllCountries,
  getState,
  updateState,
} from "../../Services/StateApi";

const StateUpdatePage = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});
  const navigate = useNavigate();
  const [fetching, setFetching] = useState(true);
  const countryDropdownRef = useRef(null);
  const [countrySearchQuery, setCountrySearchQuery] = useState("");
  const [countryModal, setCountryModal] = useState(false);
  const [countryData, setCountryData] = useState({
    list: [],
    search: "",
  });
  const [loadingCountryData, setLoadingCountryData] = useState(false);
  const countryList = countryData.list;
  const [selectedCountry, setSelectedCountry] = useState(null);

  //  ----------------------------------------------------------------
  //   Fetch enterance exam data
  //   ----------------------------------------------------------------
  useEffect(() => {
    (async () => {
      if (!id) {
        toast.error("Facing some issue");
        return;
      }

      try {
        setFetching(true);
        const res = await getState(id);
        if (res.status) {
          const state = res.data;
          setFormData({
            name: state.name ?? "",
            country: state.country?._id ?? "",
          });
          setSelectedCountry(state.country);
        } else {
          toast.error(res.message || "Failed to fetch state");
        }
      } catch (error) {
        toast.error("Error fetching state");
        console.error(error);
      } finally {
        setFetching(false);
      }
    })();
  }, []);

  // -----------------------------------------------------------------
  // Generic text / number change
  // -----------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------------------------------------------
  // Form submit
  // -----------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError({});
    // setApiMessage("");

    // ---------- client‑side validation ----------
    const errors = {};
    if (!formData.name.trim()) errors.name = "State Name is required.";
    if (!formData.country.trim()) errors.country = "Country is required.";

    if (Object.keys(errors).length) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    const payload = {
      name: formData.name,
      country: formData.country,
    };

    try {
      const res = await updateState({ id, data: payload });
      if (res.status) {
        toast.success("State updated successfully!");
        navigate(-1);
      } else {
        const msg =
          res?.message || res?.error?.message || "Something went wrong!";
        toast.error(msg);
        // setApiMessage(msg);
      }
    } catch (err) {
      const msg =
        err?.response?.data?.message || err?.message || "Server error occurred";
      toast.error(msg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (item) => {
    setFormData((p) => ({
      ...p,
      country: item?._id === formData.country ? "" : item._id,
    }));
    setSelectedCountry(item?._id === selectedCountry?._id ? "" : item);
  };

  // Fetch Function
  const fetchData = useCallback(async (search = "") => {
    setLoadingCountryData(true);
    try {
      const res = await getAllCountries({
        searchQuery: search,
      });
      const newItems = res?.data || [];
      setCountryData({
        list: newItems,
        search,
      });
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoadingCountryData(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Search with Debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (countrySearchQuery !== countryData.search) {
        fetchData(countrySearchQuery, true);
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [countrySearchQuery, fetchData]);

  useEffect(() => {
    const handleClick = (e) => {
      if (!countryDropdownRef.current?.contains(e.target)) {
        setCountryModal(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  // -----------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------
  if (loading || fetching) return <Loader />;

  return (
    <div className="m-3">
      <div className="mb-4">
        <Breaker />
      </div>

      <div className="ml-5 mt-10 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* --------- Select country -------- */}
          <div className="relative my-4">
            <label className="ml-2 font-normal block mb-2">
              Select Country
            </label>
            <div className="relative w-full" ref={countryDropdownRef}>
              <input
                type="text"
                value={countrySearchQuery}
                onChange={(e) => setCountrySearchQuery(e.target.value)}
                placeholder="Search by name..."
                className="w-full h-11 border border-gray-400 rounded-xl pl-4 pr-10 focus:outline-none focus:border-[#c1ab87]"
                onFocus={() => setCountryModal(true)}
              />
              {countryModal && (
                <div className="absolute z-10 w-full mt-1 max-h-64 overflow-y-auto border border-gray-300 rounded-xl bg-white shadow-lg">
                  {countryList.length === 0 && !loadingCountryData ? (
                    <p className="p-3 text-gray-500 text-center">No data</p>
                  ) : (
                    countryList.map((item) => (
                      <label
                        key={item._id}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 w-full"
                        htmlFor={item._id}
                      >
                        <input
                          type="checkbox"
                          checked={formData.country === item._id}
                          readOnly
                          className="mr-3"
                          id={item._id}
                          onClick={() => toggleSelection(item)}
                        />
                        <p className="font-medium">{item.name}</p>
                      </label>
                    ))
                  )}
                  {loadingCountryData && (
                    <div className="p-3 text-center">
                      <Loader small />
                    </div>
                  )}
                </div>
              )}
            </div>
            {selectedCountry?.name?.length > 0 && (
              <p className="mt-2 text-sm font-bold text-gray-900">
                {selectedCountry?.name} selected *
              </p>
            )}
            {apiError.country && (
              <p className="text-red-500 text-sm ml-2">{apiError.country}</p>
            )}
          </div>
          {/* ---------- State Name ---------- */}
          <label className="ml-2 font-normal">State Name:</label>
          <br />
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500 focus:outline-none focus:border-[#c1ab87]"
            type="text"
            name="name"
            placeholder="State Name"
            value={formData.name}
            onChange={handleChange}
          />
          {apiError.name && (
            <p className="text-red-500 text-sm ml-2">{apiError.name}</p>
          )}

          {/* ---------- Submit ---------- */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl"
          >
            {loading ? "Updating..." : "Update State"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StateUpdatePage;
