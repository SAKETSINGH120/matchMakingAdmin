import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import Select from "react-select";
import { getAllLocations } from "../../Services/locationServices";
import Breaker from "../../compoents/Breaker";

export default function PackageForm({ onSubmit, defaultValues = {} }) {
  const { register, handleSubmit, control, watch, setValue } = useForm({
    defaultValues: {
      ...defaultValues,
      primaryBanner: undefined,     // ← important: file input starts empty
      bannerImages: undefined,      // ← same for multiple file input
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "locations",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append({ location: "", order: 1, distanceToNext: 0 });
    }
  }, [fields.length, append]);

  const [locationOptions, setLocationOptions] = useState([]);

  // Previews
  const [primaryPreview, setPrimaryPreview] = useState(null);
  const [bannerPreviews, setBannerPreviews] = useState([]);

  // For edit mode - existing images
  const [existingPrimaryUrl, setExistingPrimaryUrl] = useState(defaultValues?.primaryBannerUrl || null);
  const [existingBannerUrls, setExistingBannerUrls] = useState(defaultValues?.bannerImagesUrls || []);

  const primaryFile = watch("primaryBanner");
  const bannerFiles = watch("bannerImages");

  // Load locations
  useEffect(() => {
    getAllLocations({ page: 1, limit: 1000 }).then((res) => {
      setLocationOptions(
        res.data.map((loc) => ({
          value: loc._id,
          label: loc.name,
        }))
      );
    });
  }, []);

  // Primary banner preview logic
  useEffect(() => {
    let previewUrl = null;

    if (primaryFile?.[0] instanceof File) {
      previewUrl = URL.createObjectURL(primaryFile[0]);
    } else if (existingPrimaryUrl) {
      previewUrl = existingPrimaryUrl;
    }

    setPrimaryPreview(previewUrl);

    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [primaryFile, existingPrimaryUrl]);

  // Multiple banners preview (existing + new)
  useEffect(() => {
    const newPreviews = bannerFiles
      ? Array.from(bannerFiles).map((file) => URL.createObjectURL(file))
      : [];

    setBannerPreviews([...existingBannerUrls, ...newPreviews]);

    return () => {
      newPreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [bannerFiles, existingBannerUrls]);

  const removePrimaryImage = () => {
    if (primaryFile?.[0] instanceof File) {
      setValue("primaryBanner", null);
    } else {
      // User wants to remove existing primary banner
      setExistingPrimaryUrl(null);
      // You may want to send flag to backend later:
      // setValue("removePrimaryBanner", true);
    }
  };

  const removeBannerImage = (index) => {
    const existingCount = existingBannerUrls.length;

    if (index < existingCount) {
      alert("Cannot remove existing banner images from this interface yet.");
      return;
    }

    // Remove from new uploads only
    const newIndex = index - existingCount;
    const currentFiles = bannerFiles ? Array.from(bannerFiles) : [];
    const updatedFiles = currentFiles.filter((_, i) => i !== newIndex);

    const dt = new DataTransfer();
    updatedFiles.forEach((file) => dt.items.add(file));
    setValue("bannerImages", dt.files.length > 0 ? dt.files : null);
  };

  const tagOptions = [
    { value: "popular", label: "Popular" },
    { value: "new", label: "New" },
    { value: "family", label: "Family" },
    { value: "other", label: "Other" },
  ];

  const submit = (data) => {
    onSubmit(data);
  };

  return (
    <>
      <div className="ml-5 mt-8 bg-white p-6 max-w-9xl rounded-xl shadow-xl">
        <form onSubmit={handleSubmit(submit)} className="space-y-8">
          {/* Package Name */}
          <div>
            <label htmlFor="name" className="block font-medium mb-2">
              Package Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              {...register("name", { required: true })}
              placeholder="Enter package name"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Primary Banner */}
            <div>
              <label className="block font-medium mb-2">Primary Banner Image</label>
              <label className="cursor-pointer inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium">
                Upload Primary Image
                <input
                  type="file"
                  {...register("primaryBanner")}
                  className="hidden"
                  accept="image/*"
                />
              </label>

              {primaryPreview && (
                <div className="mt-4 flex justify-start">
                  <div className="relative inline-block">
                    <img
                      src={primaryPreview}
                      alt="Primary Banner Preview"
                      className="w-48 h-32 object-cover rounded border shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={removePrimaryImage}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Banner Images */}
            <div>
              <label className="block font-medium mb-2">Additional Banner Images</label>
              <label className="cursor-pointer inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition font-medium">
                {bannerPreviews.length > 0 ? "Add More Images" : "Upload Images"}
                <input
                  type="file"
                  multiple
                  {...register("bannerImages")}
                  className="hidden"
                  accept="image/*"
                />
              </label>

              {bannerPreviews.length > 0 ? (
                <div className="flex flex-wrap mt-4 gap-4">
                  {bannerPreviews.map((preview, idx) => (
                    <div key={idx} className="relative inline-block">
                      <img
                        src={preview}
                        alt={`Banner ${idx + 1}`}
                        className="w-32 h-32 object-cover rounded border shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeBannerImage(idx)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-700 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm mt-3">
                  No additional banner images uploaded yet
                </p>
              )}
            </div>
          </div>

          {/* Locations */}
          <div className="space-y-6">
            <label className="block font-medium mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            {fields.map((item, index) => (
              <div key={item.id} className="border p-6 rounded-lg bg-gray-50 space-y-5">
                <div>
                  <label className="block font-medium mb-2">
                    Location {index + 1} <span className="text-red-500">*</span>
                  </label>
                  <Controller
                    control={control}
                    name={`locations.${index}.location`}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={locationOptions}
                        placeholder="Select a location"
                        isSearchable
                        menuPortalTarget={document.body}
                        value={locationOptions.find((opt) => opt.value === field.value)}
                        onChange={(val) => field.onChange(val?.value || "")}
                        styles={{
                          menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                        }}
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label htmlFor={`order-${index}`} className="block font-medium mb-2">
                      Order <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`order-${index}`}
                      type="number"
                      {...register(`locations.${index}.order`, { required: true })}
                      placeholder="e.g. 1"
                      className="w-full px-4 py-2 border rounded"
                    />
                  </div>
                  <div>
                    <label htmlFor={`distance-${index}`} className="block font-medium mb-2">
                      Distance to Next Location (km)
                    </label>
                    <input
                      id={`distance-${index}`}
                      type="number"
                      step="0.1"
                      {...register(`locations.${index}.distanceToNext`)}
                      placeholder="e.g. 120"
                      className="w-full px-4 py-2 border rounded"
                    />
                  </div>
                </div>

                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-600 hover:underline font-medium"
                  >
                    Remove This Location
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                append({ location: "", order: fields.length + 1, distanceToNext: 0 })
              }
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium"
            >
              + Add New Location
            </button>
          </div>

          {/* Pricing & Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="baseFair" className="block font-medium mb-2">
                Base Fare (₹) <span className="text-red-500">*</span>
              </label>
              <input
                id="baseFair"
                type="number"
                step="any"
                {...register("baseFair", {
                  valueAsNumber: true,
                  setValueAs: (v) => (v === "" ? null : Number(v)),
                })}
                placeholder="e.g. 15000"
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="totalDistance" className="block font-medium mb-2">
                Total Distance (km) <span className="text-red-500">*</span>
              </label>
              <input
                id="totalDistance"
                type="number"
                step="any"
                {...register("totalDistance", {
                  valueAsNumber: true,
                  setValueAs: (v) => (v === "" ? null : Number(v)),
                })}
                placeholder="e.g. 800"
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="convienienceFee" className="block font-medium mb-2">
                Convenience Fee (₹)
              </label>
              <input
                id="convienienceFee"
                type="number"
                {...register("convienienceFee", { valueAsNumber: true })}
                placeholder="e.g. 500"
                className="w-full px-4 py-2 border rounded"
              />
            </div>

            <div>
              <label htmlFor="maxMember" className="block font-medium mb-2">
                Maximum Members per Booking <span className="text-red-500">*</span>
              </label>
              <input
                id="maxMember"
                type="number"
                {...register("maxMember", { required: true, valueAsNumber: true })}
                placeholder="e.g. 4"
                className="w-full px-4 py-2 border rounded"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block font-medium mb-2">
              Package Status
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Package Details */}
          <div>
            <label htmlFor="packageDetails" className="block font-medium mb-2">
              Package Details / Description
            </label>
            <textarea
              id="packageDetails"
              {...register("packageDetails")}
              placeholder="Describe the package, itinerary, inclusions, etc."
              rows={6}
              className="w-full px-4 py-3 border rounded-lg resize-y"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block font-medium mb-2">Tags</label>
            <Controller
              control={control}
              name="tag"
              render={({ field }) => (
                <Select
                  {...field}
                  options={tagOptions}
                  isMulti
                  placeholder="Select one or more tags"
                  menuPortalTarget={document.body}
                  value={tagOptions.filter((opt) => field.value?.includes(opt.value))}
                  onChange={(vals) => field.onChange(vals.map((v) => v.value))}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              )}
            />
          </div>

          {/* Time Duration */}
          <div>
            <label htmlFor="timeDuration" className="block font-medium mb-2">
              Duration
            </label>
            <input
              id="timeDuration"
              {...register("timeDuration")}
              placeholder="e.g. 5 days 4 nights"
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-4 rounded-lg hover:bg-blue-800 transition font-bold text-lg"
          >
            {defaultValues?._id ? "Update Package" : "Create Package"}
          </button>
        </form>
      </div>
    </>
  );
}