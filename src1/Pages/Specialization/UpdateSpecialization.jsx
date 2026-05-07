///compoents/UpdateStreams.jsx (New component for updating a stream)
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import {
  getStreamByIdApi,
  updateStreamApi,
} from "../../Services/SpecializationApi";
import Loader from "../../compoents/Loader";
import toast from "react-hot-toast";

const UpdateStreams = () => {
  const { id } = useParams(); // Get stream ID from URL params (e.g., /update/:id)
  const [formData, setFormData] = useState({
    name: "",
    priority: "",
    status: "",
  });
  const [apiMessage, setApiMessage] = useState("");
  const [loading, setLoading] = useState(false); // For submit
  const [fetchLoading, setFetchLoading] = useState(true); // For initial fetch
  const [apiError, setApiError] = useState({});
  const navigate = useNavigate();

  // Fetch existing stream data on component mount
  useEffect(() => {
    const fetchStream = async () => {
      if (!id) {
        toast.error("Stream ID is missing");
        navigate(-1);
        return;
      }

      setFetchLoading(true);
      const res = await getStreamByIdApi(id);

      if (res) {
        const stream = res.data; // Assume API returns { name, priority, status, ... }
        console.log("Fetched stream data:", stream); // Debug
        setFormData({
          name: stream.name || "",
          priority: stream.priority?.toString() || "", // Convert number to string for input
          status: stream.status ? "true" : "false", // Convert boolean to string for select
        });
      } else {
        const errorMessage = res?.error?.message || "Failed to fetch stream";
        toast.error(errorMessage);
        setApiMessage(errorMessage);
        navigate(-1); // Redirect if not found or error
      }
      setFetchLoading(false);
    };

    fetchStream();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear field-specific error on change
    if (apiError[name]) {
      setApiError({ ...apiError, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError({});
    setApiMessage("");

    const errors = {};
    if (!formData.name.trim()) errors.name = "name is required.";
    if (!formData.priority) errors.priority = "Priority is required.";
    if (!formData.status) errors.status = "Status is required.";

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    // Prepare payload with correct types (same as create)
    const payload = {
      name: formData.name.trim(),
      priority: Number(formData.priority), // Convert to number
      status: formData.status === "true", // Convert to boolean
    };

    console.log("Payload prepared for update:", payload); // Debug

    try {
      const res = await updateStreamApi(id, payload);

      if (res.status) {
        navigate(-1);
        toast.success("Stream updated successfully!");
      } else {
        const errorMessage =
          res?.error?.message || res?.message || "Something went wrong!";
        toast.error(errorMessage);
        setApiMessage(errorMessage);
      }
    } catch (error) {
      const catchErrorMessage = error?.message || "Server error occurred";
      console.error("Error updating stream:", error);
      toast.error(catchErrorMessage);
      setApiMessage(catchErrorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loader during initial fetch
  if (fetchLoading) return <Loader />;

  return (
    <div className="m-3">
      <div className="mb-4">
        <Breaker />
      </div>
      <div className="ml-5 mt-8 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* name */}
          <label className="ml-2 font-normal block">Stream name:</label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            name="name"
            placeholder=" Name"
            value={formData.name}
            onChange={handleChange}
          />
          {apiError.name && (
            <p className="text-red-500 text-sm ml-2">{apiError.name}</p>
          )}

          {/* Priority */}
          <label className="ml-2 mt-4 font-normal block">Priority:</label>
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="number"
            name="priority"
            placeholder="Priority"
            value={formData.priority}
            onChange={handleChange}
          />
          {apiError.priority && (
            <p className="text-red-500 text-sm ml-2">{apiError.priority}</p>
          )}

          {/* Status */}
          <label className="ml-2 mt-4 font-normal block">Status:</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-3 pr-10 py-2 border-gray-500"
          >
            <option value="">Select Status</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          {apiError.status && (
            <p className="text-red-500 text-sm ml-2">{apiError.status}</p>
          )}

          {/* API Error Message */}
          {apiMessage && (
            <p className="text-red-500 text-sm ml-2 mt-4">{apiMessage}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl"
          >
            {loading ? "Updating..." : "Update Specialization"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateStreams;
