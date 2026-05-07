import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import toast from "react-hot-toast";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Loader from "../../compoents/Loader";
import { createCity } from "../../Services/CityApi";
import CreateUpdateButton from "../../compoents/CreateButton";

const AddNewCityPage = () => {
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});
  const navigate = useNavigate();
  // -----------------------------------------------------------------
  // Generic text / number change
  // -----------------------------------------------------------------
  const handleChange = (e) => {
    const { value } = e.target;
    setCity(value)
  };

  // -----------------------------------------------------------------
  // Form submit
  // -----------------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError({});
    const errors = {};
    if (!city.trim()) errors.city = "City is required.";

    if (Object.keys(errors).length) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    const payload = {
      name: city,
    };

    try {
      const res = await createCity(payload);
      if (res.status) {
        toast.success("City created successfully!");
        navigate(-1);
      } else {
        const msg =
          res?.message || res?.error?.message || "Something went wrong!";
        toast.error(msg);
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

  // -----------------------------------------------------------------
  // Render
  // -----------------------------------------------------------------
  if (loading) return <Loader />;

  return (
    <div className="m-3">
      <div className="mb-4">
        <Breaker />
      </div>

      <div className="ml-5 mt-10 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* ---------- City Name ---------- */}
          <label className="ml-2 font-normal">City Name:</label>
          <br />
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500 focus:outline-none focus:border-[#c1ab87]"
            type="text"
            name="name"
            placeholder="City Name"
            value={city}
            onChange={handleChange}
          />
          {apiError.city && (
            <p className="text-red-500 text-sm ml-2">{apiError.city}</p>
          )}

          <CreateUpdateButton loading={loading} text={loading ? "Creating..." : "Create City"} />
        </form>
      </div>
    </div>
  );
};

export default AddNewCityPage;
