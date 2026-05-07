import React, { useState } from "react";
import attachUrl from "../../utils/attachUrl";
import { FiX } from "react-icons/fi";

const ExistingMultiImageManager = ({
  existingGalleryImages,
  setExistingGalleryImages,
  deleteHandler,
}) => {
  const [ImagesToRemove, setImagesToRemove] = useState([]);
  const [imagesRemoveLoading, setImagesRemoveLoading] = useState(false);

  const handleAddImageToRemove = (id, idx) => {
    setImagesToRemove((prev) => [...prev, idx]);
    setExistingGalleryImages((prev) => prev.filter((img) => img.id !== id));
  };

  const handleDeleteImages = async () => {
    setImagesRemoveLoading(true);
    if (ImagesToRemove.length === 0) return;
    if (await deleteHandler(ImagesToRemove)) {
      setImagesToRemove([]);
    }
    setImagesRemoveLoading(false);
  };

  return (
    <div className="flex flex-col gap-y-2.5 mb-2">
      <label className="ml-2 mt-4 font-normal block">Existing Images:</label>
      {Array.isArray(existingGalleryImages) &&
        existingGalleryImages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 ml-2">
            {existingGalleryImages.map(({ url, id, idx }) => (
              <div className="relative">
                <img
                  key={id}
                  src={attachUrl(url)}
                  alt={`Gallery ${id}`}
                  className="h-25 w-25 object-cover rounded border border-gray-300"
                />
                <button
                  type="button"
                  className="absolute cursor-pointer top-0 right-0 bg-red-500 text-white rounded-full p-1 -mt-2 -mr-2 flex items-center justify-center hover:bg-red-600"
                  onClick={() => handleAddImageToRemove(id, idx)}
                >
                  <FiX size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      {ImagesToRemove.length > 0 && (
        <div className="mb-8">
          <button
            className={`px-4 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 mt-2 ml-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={handleDeleteImages}
            type="button"
            disabled={imagesRemoveLoading}
          >
            {imagesRemoveLoading ? "Updating..." : "Update Images"}
          </button>
        </div>
      )}
    </div>
  );
};

export default ExistingMultiImageManager;
