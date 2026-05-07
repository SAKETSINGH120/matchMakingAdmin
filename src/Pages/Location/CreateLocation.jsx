import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breaker from "../../compoents/Breaker"; // Note: you had a typo ("compoents"), fix if needed
import { createLocation } from "../../Services/LocationApi"; // Make sure this path & export is correct
import Loader from "../../compoents/Loader";
import toast from "react-hot-toast";
import CityDropdown from "./components/CityDropdown";

const CreateLocation = () => {
  const [formData, setFormData] = useState({
    name: "",
    city: "",
  });
  const [apiMessage, setApiMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError({});
    setApiMessage("");

    const errors = {};
    if (!formData.name.trim()) {
      errors.name = "Location name is required.";
    }
    if (!formData.city.trim()) {
      errors.city = "City is required.";
    }

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      cityId: formData.city.trim(),
    };

    try {
      const res = await createLocation(payload);

      toast.success("Location created successfully!b  dfdsfa");
      navigate(-1); // Go back to previous page (e.g., location list)
    } catch (error) {
      const errorMessage = error?.message || "Failed to create location.";
      console.error("Error creating location:", error);
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

  if (loading) return <Loader />;

  return (
    <div className="m-3">
      <div className="mb-4">
        <Breaker />
      </div>
      <div className="ml-5 mt-8 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 ml-2">Create New Location</h2>
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
          {apiError.name && (
            <p className="text-red-500 text-sm ml-2">{apiError.name}</p>
          )}

          {/* API Error Message */}
          {apiMessage && (
            <p className="text-red-500 text-sm ml-2 mt-4">{apiMessage}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FB721D] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl"
          >
            {loading ? "Creating..." : "Create Location"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateLocation;