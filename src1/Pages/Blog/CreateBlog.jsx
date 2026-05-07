import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import { createBlogApi } from "../../Services/BlogApi";
import toast from "react-hot-toast";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import Loader from "../../compoents/Loader";
import RichTextEditor from "react-rte";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const CreateBlog = () => {
  const [images, setImages] = useState([]);
  const [apiMessage, setApiMessage] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    priority: "",
    description: RichTextEditor.createEmptyValue(),
    thumbImage: "",
    image: [],
    status: "",
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});
  const [thumbPreview, setThumbPreview] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      if (thumbPreview) URL.revokeObjectURL(thumbPreview);
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [thumbPreview, imagePreviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleThumbChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, thumbImage: file });
      setThumbPreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, image: files });
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleDescriptionChange = (value) => {
    setFormData({ ...formData, description: value });
  };

  const stripHtml = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiMessage("");
    setApiError({});

    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required.";
    if (!formData.priority.trim()) errors.priority = "priority is required.";
    if (!formData.status) errors.status = "Status is required.";
    if (!stripHtml(formData.description.toString("html")).trim())
      errors.description = "Description is required.";

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    try {
      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("priority", formData.priority);
      dataToSend.append("description", formData.description.toString("html"));
      if (formData.thumbImage)
        dataToSend.append("thumbImage", formData.thumbImage);
      dataToSend.append("status", formData.status === "true");

      formData.image.forEach((img) => {
        if (img) dataToSend.append("image", img);
      });

      const res = await createBlogApi(dataToSend);
      if (res.status) {
        toast.success("Blog added successfully!");
        navigate(-1);
      } else {
        const errorMessage =
          res?.message || res?.error?.message || "Something went wrong!";
        toast.error(errorMessage);
        setApiMessage(errorMessage);
      }
    } catch (error) {
      const catchErrorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Server error occurred";
      console.error("Error creating blog:", error);
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
      <div className="ml-5 mt-10 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          <label className="ml-2 font-normal">Title:</label>
          <br />
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="text"
            name="title"
            placeholder="Blog Title"
            value={formData.title}
            onChange={handleChange}
          />
          {apiError.title && (
            <p className="text-red-500 text-sm ml-2">{apiError.title}</p>
          )}
          <label className="ml-2 font-normal">priority:</label>
          <br />
          <input
            className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
            type="number"
            name="priority"
            placeholder="Blog priority"
            value={formData.priority}
            onChange={handleChange}
          />
          {apiError.priority && (
            <p className="text-red-500 text-sm ml-2">{apiError.priority}</p>
          )}

          <label className="ml-2 mt-4 font-normal block">Description:</label>
          <div className="mb-1 mt-2 rounded-xl shadow-md bg-white">
            <RichTextEditor
              value={formData.description}
              onChange={handleDescriptionChange}
              className="bg-white text-gray-800 rounded-xl"
            />
          </div>
          {apiError.description && (
            <p className="text-red-500 text-sm ml-2">{apiError.description}</p>
          )}

          {/* Thumbnail */}
          <div className="w-full mb-4">
            <label className="ml-2 mt-4 font-normal block">Thumb Image:</label>
            {thumbPreview && (
              <img
                src={thumbPreview}
                alt="Preview"
                className="h-20 w-40 object-cover rounded mt-2 mb-2 ml-2 border border-gray-300"
              />
            )}
            <label
              htmlFor="thumb-upload"
              className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
            >
              📷 Upload Thumbnail
            </label>
            <input
              id="thumb-upload"
              className="hidden"
              type="file"
              name="thumbImage"
              accept="image/*"
              onChange={handleThumbChange}
            />
          </div>

          {/* Carousel for blog images */}
          <label className="ml-2 font-normal block">Blog Images:</label>
          <div className="ml-2 rounded-md hover:bg-gray-100 transition-colors p-2 max-w-50">
            <Carousel
              showThumbs={false}
              infiniteLoop
              autoPlay
              interval={3000}
              showStatus={false}
              showIndicators={true}
              className="rounded-xl"
            >
              {imagePreviews.map((src, i) => (
                <div key={i}>
                  <img
                    src={src}
                    alt={`Preview ${i}`}
                    className="h-[100px] w-full object-cover rounded-xl"
                  />
                </div>
              ))}
            </Carousel>
          </div>

          <div className="w-full mb-4">
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4"
            >
              📁 Upload Images
            </label>
            <input
              id="image-upload"
              className="hidden"
              type="file"
              name="image"
              accept="image/*"
              multiple
              onChange={handleImageChange}
            />
          </div>

          {/* Status */}
          <label className="ml-2 font-normal block">Status:</label>
          <div className="relative w-full">
            <select
              className="w-full h-10 mb-1 border rounded-xl pl-3 pr-10 py-2 border-gray-500 appearance-none"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">Select Status</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
          {apiError.status && (
            <p className="text-red-500 text-sm ml-2">{apiError.status}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl"
          >
            {loading ? "Creating..." : "Create Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBlog;
