// src/Pages/Location/UpdateLocation.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import { getLocationById, updateLocation } from "../../Services/LocationApi";
import Loader from "../../compoents/Loader";
import toast from "react-hot-toast";
import CityDropdown from "./components/CityDropdown";

const UpdateLocation = () => {
  const { id } = useParams(); 
  const [formData, setFormData] = useState({
    name: "",
    city: ""
  });
  const [apiMessage, setApiMessage] = useState("");
  const [loading, setLoading] = useState(false); 
  const [fetchLoading, setFetchLoading] = useState(true); 
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(null);

  
  useEffect(() => {
    const fetchLocation = async () => {
      if (!id) {
        toast.error("Location ID is missing");
        navigate(-1);
        return;
      }

      try {
        setFetchLoading(true);
        const res = await getLocationById(id);

        
        const location = res.data;

        if (location) {
          setFormData({
            name: location.name || "",
            city: location.cityId?._id || "",
          });
          setSelectedCity(location.cityId);
        } else {
          toast.error("Location data not found");
          navigate(-1);
        }
      } catch (error) {
        const errorMessage = error?.message || "Failed to fetch location";
        toast.error(errorMessage);
        setApiMessage(errorMessage);
        // Optional: navigate(-1);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchLocation();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user starts typing
    if (apiError[name]) {
      setApiError({ ...apiError, [name]: undefined });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiMessage("");

    if (!formData.name.trim() && !formData.city.trim()) {
      setApiMessage("At least one field is required to update.");
    }

    const payload = {
    };

    if (formData.name.trim()) payload["name"] = formData.name.trim();
    if (formData.city.trim()) payload["cityId"] = formData.city.trim();

    try {
      const res = await updateLocation(id, payload);

      // Success handling (adjust based on your API response)
      toast.success("Location updated successfully!");
      navigate(-1); // Go back to list page
    } catch (error) {
      const errorMessage = error?.message || "Failed to update location";
      console.error("Error updating location:", error);
      toast.error(errorMessage);
      setApiMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const onSelectCity = (city) => {
    if (city && selectedCity && city._id === selectedCity._id) {
      setSelectedCity(null);
      setFormData(prev => ({ ...prev, city: "" }))
      return;
    }
    setSelectedCity(city);
    setFormData(prev => ({ ...prev, city: city._id }))
  };

  // Show full-screen loader while fetching initial data
  if (fetchLoading) return <Loader />;

  return (
    <div className="m-3">
      <div className="mb-4">
        <Breaker />
      </div>

      <div className="ml-5 mt-8 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 ml-2">Update Location</h2>

        <form onSubmit={handleSubmit}>
          <CityDropdown onSelect={onSelectCity} selectedCity={selectedCity} />
          {/* Location Name */}
          <label className="ml-2 font-normal block">Location Name:</label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            name="name"
            placeholder="Enter location name"
            value={formData.name}
            onChange={handleChange}
          />
          {apiMessage && (
            <p className="text-red-500 text-sm ml-2 mt-4">{apiMessage}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FB721D] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl"
          >
            {loading ? "Updating..." : "Update Location"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateLocation;