import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateBannerApi, getBannerApi } from "../../Services/BannerApi";
import Breaker from "../../compoents/Breaker";
import toast from "react-hot-toast";
import Loader from "../../compoents/Loader";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const UpdateBanner = () => {
  const [formData, setFormData] = useState({
    image: null,
    priority: 0,
    status: "",
    type: "",
  });
  const [apiMessage, setApiMessage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});
  const { id } = useParams(); // Get 'id' from the URL using useParams
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Banner ID:", id); // Check if id is being passed correctly
    if (id) {
      const fetchBanner = async () => {
        setLoading(true);
        try {
          const res = await getBannerApi(id); // Make sure your API call uses the correct id
          if (res.status) {
            toast.success("banner fetch successfully!");
            const { title, image, priority, platform, status, type } = res.data;
            setFormData({
              title,
              image: null,
              priority,
              platform,
              status,
              type,
            });

            // Set image preview correctly with the full URL
            setImagePreview(`${BASE_URL}/${image}`);
          }
        } catch (err) {
          console.error("Failed to fetch banner data:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchBanner();
    } else {
      console.error("Banner ID is missing");
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(files[0]); // Convert the image to base64 for preview
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const errors = {};

    // if (!formData.title) errors.title = "Title is required.";
    if (!formData.priority) errors.priority = "Priority is required.";
    // if (!formData.platform) errors.platform = "Platform is required.";
    if (formData.status === "") errors.status = "Status is required.";
    if (!formData.type.trim()) errors.type = "Type is required";

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) dataToSend.append(key, formData[key]);
      });

      const res = await updateBannerApi({ id, data: dataToSend });
      if (res.status) {
        navigate(-1);
        toast.success("Banner update successfully!");
      } else {
        // Show detailed message from API response
        const errorMessage =
          res?.error?.message || res?.message || "Something went wrong!";
        toast.error(errorMessage);
        setApiMessage(errorMessage);
      }
    } catch (error) {
      const catchErrorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Server error occurred";
      console.error("Error creating banner:", error);
      toast.error(catchErrorMessage);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <Loader />;
  return (
    <div className="m-3">
      <div className="mb-4">
        <Breaker />
      </div>
      <div className="ml-5 mt-8  bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          {/* <label className="ml-2 font-normal">Banner Title:</label>
          <br />
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            placeholder="Banner Title"
          />
          {apiError.title && (
            <p className="text-red-500 text-sm ml-2">{apiError.title}</p>
          )} */}

          {/* Priority */}
          <label className="ml-2 mt-4 font-normal block">Priority:</label>
          <input
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="number"
            placeholder="Priority"
          />
          {apiError.priority && (
            <p className="text-red-500 text-sm ml-2">{apiError.priority}</p>
          )}

          {/* Type */}
          <label className="ml-2 mt-4 font-normal block">Type:</label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="w-full h-10 mb-1 border rounded-xl pl-3 pr-10 py-2 border-gray-500"
            aria-label="Type"
          >
            <option value="">Select Type</option>
            <option value="scholarship">Scholarship</option>
            <option value="topCollege">TopCollege</option>
            <option value="counsellor">Counsellor</option>
          </select>
          {apiError.type && (
            <p className="text-red-500 text-sm ml-2">{apiError.type}</p>
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
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </select>
          {apiError.status && (
            <p className="text-red-500 text-sm ml-2">{apiError.status}</p>
          )}

          {/* Image Upload */}
          <label className="ml-2 mt-4 font-normal block">Banner Image:</label>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              className="h-16 w-24 object-cover rounded mt-2 mb-2 ml-2 border border-gray-300"
            />
          )}
          <label
            htmlFor="image-upload"
            className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
          >
            🖼️ Upload Image
          </label>
          <input
            id="image-upload"
            className="hidden"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
          />
          {apiError.image && (
            <p className="text-red-500 text-sm ml-2">{apiError.image}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl"
          >
            {loading ? "Updating..." : "Update Banner"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBanner;
