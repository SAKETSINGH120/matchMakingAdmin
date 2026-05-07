import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { updateBlogApi, getBlogApi } from "../../Services/BlogApi";
import Breaker from "../../compoents/Breaker";
import RichTextEditor from "react-rte";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const UpdateBlog = () => {
  const [formData, setFormData] = useState({
    title: "",
    thumbImage: null,
    image: [],
    status: "",
    priority: 0,
  });

  const [editorState, setEditorState] = useState(() =>
    RichTextEditor.createValueFromString("", "html")
  );

  const [thumbPreview, setThumbPreview] = useState(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const stripHtml = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  };

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const res = await getBlogApi(id);
          if (res.status) {
            const { title, description, status, thumbImage, image, priority } =
              res.data;

            setFormData((prev) => ({
              ...prev,
              priority: priority || 0,
              title: title || "",
              status: String(status),
            }));

            if (description) {
              setEditorState(
                RichTextEditor.createValueFromString(description, "html")
              );
            }

            if (thumbImage) setThumbPreview(thumbImage);
            if (image && Array.isArray(image)) setImagePreviews(image);

            setIsLoaded(true);
          }
        } catch (err) {
          console.error("Failed to fetch blog data:", err);
          toast.error("Failed to load blog data!");
        }
      };
      fetchBlog();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleThumbChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, thumbImage: file }));
      setThumbPreview(URL.createObjectURL(file));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, image: files }));
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError({});

    const descriptionHtml = editorState.toString("html");
    const errors = {};
    if (!formData.title.trim()) errors.title = "Title is required.";
    if (!stripHtml(descriptionHtml).trim())
      errors.description = "Description is required.";
    if (!formData.status) errors.status = "Status is required.";
    if (isNaN(formData.priority))
      errors.priority = "Priority must be a valid number.";

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    try {
      const dataToSend = new FormData();
      dataToSend.append("title", formData.title);
      dataToSend.append("priority", formData.priority);
      dataToSend.append("description", descriptionHtml);
      dataToSend.append("status", formData.status === "true");

      if (formData.thumbImage) {
        dataToSend.append("thumbImage", formData.thumbImage);
      }

      formData.image.forEach((img) => {
        dataToSend.append("image", img);
      });

      const res = await updateBlogApi({ id, data: dataToSend });

      if (res.status) {
        toast.success("Blog updated successfully!");
        navigate("/home/blog");
      } else {
        if (res.errors && typeof res.errors === "object") {
          Object.values(res.errors).forEach((errMsg) => {
            toast.error(errMsg);
          });
        } else {
          const message = res.message || "Failed to update blog.";
          toast.error(message);
        }
      }
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message || "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded)
    return <div className="p-10 text-center">Loading blog data...</div>;

  return (
    <div className="m-3">
      <div className="mb-4">
        <Breaker />
      </div>
      <div className="ml-5 mt-10 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <label className="ml-2 font-normal">Title:</label>
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

          {/* Description */}
          <label className="ml-2 mt-4 font-normal block">Description:</label>
          <div className="mb-1 mt-2 rounded-xl shadow-md">
            <RichTextEditor
              value={editorState}
              onChange={setEditorState}
              className="bg-white text-gray-800 rounded-xl"
            />
          </div>
          {apiError.description && (
            <p className="text-red-500 text-sm ml-2">{apiError.description}</p>
          )}

          {/* Thumb Image */}
          <div className="w-full mb-4">
            <label className="ml-2 mt-4 font-normal block">Thumb Image:</label>
            {thumbPreview && (
              <img
                src={
                  thumbPreview.startsWith("blob:")
                    ? thumbPreview
                    : `${BASE_URL}/${thumbPreview}`
                }
                alt="Thumb Preview"
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

          {/* Blog Images Carousel */}
          <label className="ml-2 font-normal block">Blog Images:</label>
          <div className="ml-2 rounded-md hover:bg-gray-100 transition-colors p-2 max-w-50">
            <Carousel
              showThumbs={false}
              infiniteLoop
              autoPlay
              showIndicators={false}
              interval={3000}
              showStatus={false}
              className="rounded-xl"
            >
              {imagePreviews.map((src, i) => (
                <div key={i}>
                  <img
                    src={src.startsWith("blob:") ? src : `${BASE_URL}/${src}`}
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl"
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateBlog;
