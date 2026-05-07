// src/Pages/Agent/UpdateAgent.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import { getAgentById, updateAgent } from "../../Services/AgentApi";
import Loader from "../../compoents/Loader";
import toast from "react-hot-toast";

const UpdateAgent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    walletBalance: 0,
    isVerified: false,
    status: "inactive",
  });

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [apiMessage, setApiMessage] = useState("");
  const [apiError, setApiError] = useState({});

  useEffect(() => {
    const fetchAgent = async () => {
      if (!id) {
        toast.error("Agent ID is missing");
        navigate(-1);
        return;
      }

      try {
        setFetchLoading(true);
        const res = await getAgentById(id);
        const agent = res.data || res;

        if (agent) {
          setFormData({
            name: agent.name || "",
            email: agent.email || "",
            phone: agent.phone || "",
            walletBalance: agent.walletBalance ?? 0,
            isVerified: agent.isVerified ?? false,
            status: agent.status || "inactive",
          });
        } else {
          toast.error("Agent data not found");
          navigate(-1);
        }
      } catch (error) {
        const errorMessage = error?.message || "Failed to fetch agent details";
        toast.error(errorMessage);
        setApiMessage(errorMessage);
      } finally {
        setFetchLoading(false);
      }
    };

    fetchAgent();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (apiError[name]) {
      setApiError({ ...apiError, [name]: undefined });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError({});
    setApiMessage("");

    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Email is invalid.";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required.";
    } else if (!/^\d{10,15}$/.test(formData.phone.replace(/\D/g, ""))) {
      errors.phone = "Phone number must be 10-15 digits.";
    }

    if (isNaN(formData.walletBalance) || formData.walletBalance < 0) {
      errors.walletBalance = "Wallet balance must be a positive number.";
    }

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    const payload = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      walletBalance: Number(formData.walletBalance),
      isVerified: formData.isVerified,
      status: formData.status,
    };

    try {
      await updateAgent(id, payload);
      toast.success("Agent updated successfully!");
      navigate(-1);
    } catch (error) {
      const errorMessage = error?.message || "Failed to update agent";
      console.error("Error updating agent:", error);
      toast.error(errorMessage);
      setApiMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) return <Loader />;

  return (
    <div className="m-3">
      <div className="mb-4">
        <Breaker />
      </div>

      <div className="ml-5 mt-8 bg-white p-6 max-w-4xl rounded-xl shadow-xl">
        <h2 className="text-2xl font-semibold mb-6 ml-2">Update Agent</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="ml-2 font-normal block">
              Name:<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FB721D]"
              type="text"
              name="name"
              placeholder="Enter agent name"
              value={formData.name}
              onChange={handleChange}
            />
            {apiError.name && <p className="text-red-500 text-sm ml-2">{apiError.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="ml-2 font-normal block">
              Email:<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FB721D]"
              type="email"
              name="email"
              placeholder="agent@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {apiError.email && <p className="text-red-500 text-sm ml-2">{apiError.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="ml-2 font-normal block">
              Phone:<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FB721D]"
              type="text"
              name="phone"
              placeholder="e.g., +1234567890"
              value={formData.phone}
              onChange={handleChange}
            />
            {apiError.phone && <p className="text-red-500 text-sm ml-2">{apiError.phone}</p>}
          </div>

          {/* Wallet Balance */}
          <div>
            <label className="ml-2 font-normal block">
              Wallet Balance:<span className="text-red-500 ml-1">*</span>
            </label>
            <input
              className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FB721D]"
              type="number"
              name="walletBalance"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.walletBalance}
              onChange={handleChange}
            />
            {apiError.walletBalance && (
              <p className="text-red-500 text-sm ml-2">{apiError.walletBalance}</p>
            )}
          </div>

          {/* Verified Status */}
          <div className="flex items-center gap-3 ml-2">
            <input
              type="checkbox"
              name="isVerified"
              id="isVerified"
              checked={formData.isVerified}
              onChange={handleChange}
              className="h-5 w-5 text-[#FB721D] rounded focus:ring-[#FB721D]"
            />
            <label htmlFor="isVerified" className="font-normal cursor-pointer">
              Is Verified
            </label>
          </div>

          {/* Status */}
          <div>
            <label className="ml-2 font-normal block">Status:</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FB721D]"
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
            </select>
          </div>

          {/* General Error */}
          {apiMessage && <p className="text-red-500 text-sm ml-2 mt-4">{apiMessage}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FB721D] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-8 rounded-2xl font-medium disabled:opacity-70"
          >
            {loading ? "Updating Agent..." : "Update Agent"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateAgent;