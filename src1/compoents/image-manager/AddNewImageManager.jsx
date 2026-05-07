import React from "react";
import { FiX } from "react-icons/fi";

const AddNewMultiImageManager = ({
  newImagesPreviews,
  setNewImages,
  setNewImagesPreviews,
  buttonTitle = "Add More Images",
  heading = "New Images",
}) => { 
  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    setNewImages((prev) => [...prev, ...files]);
    setNewImagesPreviews((prev) => [
      ...prev,
      ...files.map((f) => URL.createObjectURL(f)),
    ]);
  };

  const handleManageNewImagesRemove = (idx) => {
    setNewImages((prev) => prev.filter((_, index) => index !== idx));
    setNewImagesPreviews((prev) => prev.filter((_, index) => index !== idx));
  };

  return (
    <div>
      <div className="flex flex-col gap-y-2.5">
        <label className="ml-2 mt-4 font-normal block">{heading}:</label>
      </div>
      {Array.isArray(newImagesPreviews) && newImagesPreviews.length > 0 ? (
        <div className="flex flex-wrap gap-2 mt-2 ml-2 mb-4">
          {newImagesPreviews.map((url, idx) => (
            <div className="relative">
              <img
                key={idx}
                src={url}
                alt={`Gallery ${idx}`}
                className="h-25 w-25 object-cover rounded border border-gray-300"
              />
              <button
                type="button"
                className="absolute cursor-pointer top-0 right-0 bg-red-500 text-white rounded-full p-1 -mt-2 -mr-2 flex items-center justify-center hover:bg-red-600"
                onClick={() => handleManageNewImagesRemove(idx)}
              >
                <FiX size={18} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p className="text-gray-600 ml-2">No new image uploaded</p>
        </div>
      )}
      <label
        htmlFor="gallery-upload"
        className="flex items-center justify-center h-10 border border-gray-500 rounded-xl cursor-pointer bg-white hover:bg-gray-100 transition-colors px-4 mt-4"
      >
        {buttonTitle}
      </label>
      <input
        id="gallery-upload"
        className="hidden"
        type="file"
        accept="image/*"
        multiple
        onChange={handleGalleryChange}
      />
    </div>
  );
};

export default AddNewMultiImageManager;
