import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import { createBannnerTemplate } from "../../Services/BannerApi";
import Loader from "../../compoents/Loader";
import toast from "react-hot-toast";
import AddNewMultiImageManager from "../../compoents/image-manager/AddNewImageManager";

const CreateBannerTemplate = () => {
  const [formData, setFormData] = useState({
    title: "",
    type: "",
  });
  const [apiMessage, setApiMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [newImagesPreviews, setNewImagesPreviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      newImagesPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [newImagesPreviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError({});

    const errors = {};
    if (!formData.title) errors.title = "Title is required.";
    if (!formData.type) errors.type = "Type is required.";
    if (Array.isArray(newImages) && newImages.length === 0)
      errors.image = "Image is required.";

    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      setLoading(false);
      return;
    }

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });
      if (Array.isArray(newImages) && newImages.length > 0) {
        // formDataToSend.append("image", JSON.stringify(newImages));
        newImages.forEach((file) => {
          formDataToSend.append("image", file);
        });
      }

      const res = await createBannnerTemplate(formDataToSend);

      if (res.status) {
        navigate(-1);
        toast.success("Banner added successfully!");
      } else {
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
      <div className="ml-5 mt-8 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* Type */}
          <div className="my-4">
            <label className="ml-2 font-normal block">Type :</label>
            <select
              aria-label="Select a type of banner"
              name="type"
              className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
              value={formData.type}
              onChange={handleChange}
            >
              <option selected disabled value="">
                --Select a banner type--
              </option>
              <option value="home">Home</option>
              {/* <option value="profile">Profile</option> */}
              {/* <option value="college_listing">College Listing</option> */}
            </select>
            {apiError.type && (
              <p className="text-red-500 text-sm ml-2">{apiError.type}</p>
            )}
          </div>

          {/* Title */}
          <div className="my-4">
            <label className="ml-2 font-normal block">Title :</label>
            <input
              className="w-full h-10 mb-1 border rounded-xl pl-4 border-gray-500"
              type="text"
              name="title"
              placeholder="Title"
              value={formData.title}
              onChange={handleChange}
              aria-label="Title"
            />
            {apiError.title && (
              <p className="text-red-500 text-sm ml-2">{apiError.title}</p>
            )}
          </div>

          <div className="w-full mb-4">
            <AddNewMultiImageManager
              newImagesPreviews={newImagesPreviews}
              setNewImages={setNewImages}
              setNewImagesPreviews={setNewImagesPreviews}
              buttonTitle="Upload Images"
              heading="Images"
            />
            {apiError.image && (
              <p className="text-red-500 text-sm ml-2">{apiError.image}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-l from-[#181e2a] to-[#232a3b] text-white font-bold hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl"
          >
            {loading ? "Creating..." : "Create Banner"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateBannerTemplate;
