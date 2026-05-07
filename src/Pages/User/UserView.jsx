// import * as React from "react";
// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { getUserById } from "../../Services/userServices";
// import Breaker from "../../compoents/Breaker";

// export default function UserView() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       if (!id) {
//         toast.error("No user ID provided");
//         navigate("/users");
//         return;
//       }

//       try {
//         setLoading(true);
//         const result = await getUserById(id);

//         if (result?.success) {
//           setUser(result.data);
//         } else {
//           toast.error(result?.message || "Failed to load user details");
//           navigate("/users");
//         }
//       } catch (err) {
//         console.error("Error fetching user:", err);
//         toast.error("Could not fetch user details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, [id, navigate]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50/70 flex items-center justify-center">
//         <div className="text-lg font-medium text-gray-600 animate-pulse">
//           Loading user profile...
//         </div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-gray-50/70 flex items-center justify-center">
//         <div className="text-xl font-medium text-red-600">User not found</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50/60 py-8 px-4 sm:px-6 lg:px-8">
//        <Breaker />
//       <div className="mx-auto max-w-7xl ">
//         {/* Back button + Breaker */}

//           {/* <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition"
//           >
//             ← Back to list
//           </button> */}
//           {/* <Breaker /> */}

//         {/* Main Card */}
//         <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100 ">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-7 text-white">
//             <h1 className="text-2xl font-bold tracking-tight">
//               {user.name || "—"}
//             </h1>

//             <p className="mt-1.5 text-indigo-100/95 font-medium">
//               {user.number || "—"}
//             </p>
//           </div>

//           {/* Content */}
//           <div className="p-6 sm:p-8 space-y-10">
//             <CompactSection title="Basic Information">
//               <InfoItem label="Gender" value={user.gender} />
//               <InfoItem label="Date of Birth" value={formatDate(user.dob)} />
//               <InfoItem label="Age" value={calculateAge(user.dob)} />
//               <InfoItem
//                 label="Height"
//                 value={user.heightCm ? `${user.heightCm} cm` : "—"}
//               />
//               <InfoItem label="Profession" value={user.profession} />
//               <InfoItem label="Company" value={user.company} />
//               <InfoItem label="Education" value={user.education} />
//             </CompactSection>

//             <CompactSection title="Preferences">
//               <InfoItem label="Interested In" value={user.preferences?.interestedIn} />
//               <InfoItem
//                 label="Age Range"
//                 value={
//                   user.preferences?.minAge && user.preferences?.maxAge
//                     ? `${user.preferences.minAge} – ${user.preferences.maxAge}`
//                     : "—"
//                 }
//               />
//               <InfoItem
//                 label="Max Distance"
//                 value={
//                   user.preferences?.maxDistanceKm
//                     ? `${user.preferences.maxDistanceKm} km`
//                     : "—"
//                 }
//               />
//             </CompactSection>

//             <CompactSection title="Lifestyle">
//               <InfoItem label="Drinking" value={user.lifestyle?.drinking} />
//               <InfoItem label="Smoking" value={user.lifestyle?.smoking} />
//               <InfoItem label="Workout" value={user.lifestyle?.workout} />
//               <InfoItem label="Diet" value={user.lifestyle?.diet} />
//             </CompactSection>

//             <CompactSection title="Relationship Goal">
//               <InfoItem label="Goal" value={user.relationshipGoal} />
//             </CompactSection>

//             <CompactSection title="Account Status">
//               <InfoItem label="Premium" value={user.isPremium ? "Yes" : "No"} />
//               <InfoItem label="Verified" value={user.isVerified ? "Yes" : "No"} />
//               <InfoItem label="Activity Score" value={user.activityScore ?? 0} />
//               <InfoItem
//                 label="Profile Completion"
//                 value={`${user.profileCompletionPercent ?? 0}%`}
//               />
//             </CompactSection>

//             <CompactSection title="Bio">
//               <p className="text-gray-700 leading-relaxed whitespace-pre-line">
//                 {user.bio || "No bio provided."}
//               </p>
//             </CompactSection>

//             <CompactSection title="Interests">
//               {user.interests?.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {user.interests.map((interest, idx) => (
//                     <span
//                       key={idx}
//                       className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-50 text-indigo-700 border border-indigo-100"
//                     >
//                       {interest}
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <span className="text-gray-500 italic">No interests listed</span>
//               )}
//             </CompactSection>

//             <CompactSection title="Languages">
//               {user.languages?.length > 0 ? (
//                 <div className="flex flex-wrap gap-2">
//                   {user.languages.map((lang, idx) => (
//                     <span
//                       key={idx}
//                       className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200"
//                     >
//                       {lang}
//                     </span>
//                   ))}
//                 </div>
//               ) : (
//                 <span className="text-gray-500 italic">No languages listed</span>
//               )}
//             </CompactSection>

//             <CompactSection title="Location & Activity">
//               <InfoItem label="City" value={user.location?.city} />
//               <InfoItem label="Country" value={user.location?.country} />
//               <InfoItem label="Last Active" value={formatDateTime(user.lastActiveAt)} />
//               <InfoItem label="Joined" value={formatDateTime(user.createdAt)} />
//               <InfoItem label="Last Updated" value={formatDateTime(user.updatedAt)} />
//             </CompactSection>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// /* ──────────────────────────────────────────────── */
// /*               Smaller / Cleaner Components        */
// /* ──────────────────────────────────────────────── */

// function CompactSection({ title, children }) {
//   return (
//     <div className="space-y-4">
//       <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
//         {title}
//       </h3>
//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 text-sm">
//         {children}
//       </div>
//     </div>
//   );
// }

// function InfoItem({ label, value }) {
//   return (
//     <div className="flex justify-between sm:justify-start sm:gap-4">
//       <dt className="font-medium text-gray-600 min-w-[110px]">{label}:</dt>
//       <dd className="text-gray-900">{value || "—"}</dd>
//     </div>
//   );
// }

// /* ──────────────────────────────────────────────── */
// /*                   Helpers (unchanged)             */
// /* ──────────────────────────────────────────────── */

// function formatDate(dateString) {
//   if (!dateString) return "—";
//   return new Date(dateString).toLocaleDateString("en-GB", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//   });
// }

// function formatDateTime(dateString) {
//   if (!dateString) return "—";
//   return new Date(dateString).toLocaleString("en-GB", {
//     day: "numeric",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// }

// function calculateAge(dob) {
//   if (!dob) return "—";
//   const birthDate = new Date(dob);
//   const today = new Date();
//   let age = today.getFullYear() - birthDate.getFullYear();
//   const m = today.getMonth() - birthDate.getMonth();
//   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
//     age--;
//   }
//   return age;
// }
import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserById, updateUserProfile } from "../../Services/userServices";
import Breaker from "../../compoents/Breaker";
import { FaUser, FaBriefcase, FaHeart, FaLanguage } from "react-icons/fa";
import attachUrl from "../../utils/attachUrl";

export default function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({});
  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [secondaryImageFiles, setSecondaryImageFiles] = useState([]);
  const [removePrimaryImage, setRemovePrimaryImage] = useState(false);
  const [removeSecondaryImages, setRemoveSecondaryImages] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        toast.error("No user ID provided");
        navigate("/users");
        return;
      }

      try {
        setLoading(true);
        const result = await getUserById(id);

        if (result?.success) {
          setUser(result.data);
          setFormData({
            ...result.data,
            preferences: result.data.preferences || {},
            lifestyle: result.data.lifestyle || {},
            location: result.data.location || {},
            privacy: result.data.privacy || {
              showAge: true,
              showDistance: true,
            },
            interests: result.data.interests || [],
            languages: result.data.languages || [],
          });
        } else {
          toast.error(result?.message || "Failed to load user");
          navigate("/users");
        }
      } catch {
        toast.error("Could not fetch user details");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, navigate]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);

      // Only upload actual new image files
      const hasImageChanges =
        primaryImageFile || secondaryImageFiles.length > 0;

      if (hasImageChanges) {
        // Use FormData for file uploads
        const fd = new FormData();

        // Add all form data fields
        Object.keys(formData).forEach((key) => {
          if (key === "preferences" || key === "lifestyle") {
            // Handle nested objects
            Object.keys(formData[key] || {}).forEach((nestedKey) => {
              fd.append(`${key}[${nestedKey}]`, formData[key][nestedKey]);
            });
          } else if (key !== "primaryImage" && key !== "secondaryImages") {
            fd.append(key, formData[key]);
          }
        });

        // Primary image: send only the new file if one was selected
        if (primaryImageFile) {
          fd.append("primaryImage", primaryImageFile);
        }

        // Secondary images: send only newly selected files
        secondaryImageFiles.forEach((file) => {
          fd.append("secondaryImages", file);
        });

        const result = await updateUserProfile(id, fd, true);
        if (result?.success) {
          toast.success("Profile updated successfully");
          setUser(result.data);
          setEditMode(false);
          setPrimaryImageFile(null);
          setSecondaryImageFiles([]);
          setRemovePrimaryImage(false);
          setRemoveSecondaryImages([]);
        } else {
          toast.error(result?.message || "Failed to update profile");
        }
      } else {
        // Use JSON for non-file updates
        const result = await updateUserProfile(id, formData, false);
        if (result?.success) {
          toast.success("Profile updated successfully");
          setUser(result.data);
          setEditMode(false);
          setRemovePrimaryImage(false);
          setRemoveSecondaryImages([]);
        } else {
          toast.error(result?.message || "Failed to update profile");
        }
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error(err.message || "Error updating profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        ...user,
        preferences: user.preferences || {},
        lifestyle: user.lifestyle || {},
        location: user.location || {},
        privacy: user.privacy || { showAge: true, showDistance: true },
        interests: user.interests || [],
        languages: user.languages || [],
      });
    }
    setEditMode(false);
    setPrimaryImageFile(null);
    setSecondaryImageFiles([]);
    setRemovePrimaryImage(false);
    setRemoveSecondaryImages([]);
  };

  if (loading) {
    return (
      <div className="theme-page flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-lg text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
          Loading user profile...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="theme-page flex min-h-screen items-center justify-center">
        <p className="text-lg font-semibold text-theme-light-danger dark:text-theme-dark-danger">
          User not found
        </p>
      </div>
    );
  }

  return (
    <div className="theme-page p-6">
      <Breaker />

      <div className="max-w-8xl mx-auto space-y-6">
        <button
          onClick={() => navigate(-1)}
          className="mt-8 rounded bg-theme-light-primaryButton px-3 py-2 text-sm text-white transition-colors hover:bg-theme-light-primaryHover dark:bg-theme-dark-primaryButton dark:hover:bg-theme-dark-primaryHover"
        >
          ← Back
        </button>

        {/* Edit/Cancel/Update Buttons */}
        <div className="flex gap-3 mt-4">
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="rounded bg-theme-light-primaryButton px-4 py-2 text-sm text-white transition-colors hover:bg-theme-light-primaryHover dark:bg-theme-dark-primaryButton dark:hover:bg-theme-dark-primaryHover"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="rounded bg-gray-400 px-4 py-2 text-sm text-white transition-colors hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={updating}
                className="rounded bg-green-600 px-4 py-2 text-sm text-white transition-colors hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? "Updating..." : "Update Profile"}
              </button>
            </>
          )}
        </div>
        {/* Profile Header with Primary Image Upload */}
        <div className="mt-8 flex items-center gap-6 rounded-2xl bg-theme-light-primaryButton p-6 text-white shadow-lg transition-colors duration-200 dark:bg-theme-dark-primaryButton">
          {editMode ? (
            <div className="flex flex-col gap-2">
              <div className="relative group">
                <img
                  className="h-24 w-24 rounded-full bg-white ring-4 ring-white/40 object-cover object-center shrink-0"
                  src={
                    primaryImageFile
                      ? URL.createObjectURL(primaryImageFile)
                      : !removePrimaryImage && user.primaryImage
                        ? attachUrl(user.primaryImage)
                        : "/images/userDefaultLogo.jpg"
                  }
                  alt={user.name || "User"}
                />
                <label className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setPrimaryImageFile(e.target.files?.[0] || null);
                      setRemovePrimaryImage(false);
                    }}
                    className="hidden"
                  />
                </label>
              </div>
              {user.primaryImage && (
                <button
                  type="button"
                  onClick={() => {
                    setRemovePrimaryImage(!removePrimaryImage);
                    if (!removePrimaryImage) {
                      setPrimaryImageFile(null);
                    }
                  }}
                  className="text-xs px-2 py-1 bg-red-500 hover:bg-red-600 rounded text-white transition-colors"
                >
                  {removePrimaryImage ? "Keep" : "Remove"} Profile Pic
                </button>
              )}
            </div>
          ) : (
            <img
              className="h-24 w-24 rounded-full bg-white ring-4 ring-white/40 object-cover object-center shrink-0"
              src={
                user.primaryImage
                  ? attachUrl(user.primaryImage)
                  : "/images/userDefaultLogo.jpg"
              }
              alt={user.name || "User"}
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="opacity-80">{user.number}</p>

            <div className="flex gap-3 mt-3">
              {user.isVerified && (
                <span className="px-3 py-1 text-xs bg-green-500 rounded-full">
                  Verified
                </span>
              )}

              {user.isPremium && (
                <span className="px-3 py-1 text-xs bg-yellow-400 text-black rounded-full">
                  Premium
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Secondary Images */}
        {editMode ? (
          <Card title="Gallery Images - Edit">
            <div className="space-y-4">
              {/* Upload new secondary images */}
              <div>
                <label className="block text-sm font-medium mb-2 text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
                  Add New Gallery Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    setSecondaryImageFiles(Array.from(e.target.files || []))
                  }
                  className="theme-input w-full"
                />
                {secondaryImageFiles.length > 0 && (
                  <p className="text-xs text-green-600 mt-1">
                    {secondaryImageFiles.length} file(s) selected
                  </p>
                )}
              </div>

              {/* Existing images with remove option */}
              {user?.secondaryImages?.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
                    Existing Images
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {user.secondaryImages.map((imgPath, index) => (
                      <div
                        key={`${imgPath}-${index}`}
                        className="relative group"
                      >
                        <img
                          src={
                            !removeSecondaryImages.includes(index)
                              ? attachUrl(imgPath)
                              : undefined
                          }
                          alt={`Secondary ${index + 1}`}
                          className={`h-28 w-full rounded-xl border object-cover transition-opacity ${
                            removeSecondaryImages.includes(index)
                              ? "opacity-30 border-red-500 border-2"
                              : "border-theme-light-border dark:border-theme-dark-border"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setRemoveSecondaryImages((prev) =>
                              prev.includes(index)
                                ? prev.filter((i) => i !== index)
                                : [...prev, index],
                            );
                          }}
                          className={`absolute inset-0 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                            removeSecondaryImages.includes(index)
                              ? "bg-red-500/50 opacity-100"
                              : "bg-black/40"
                          }`}
                          title={
                            removeSecondaryImages.includes(index)
                              ? "Click to keep"
                              : "Click to remove"
                          }
                        >
                          {removeSecondaryImages.includes(index) ? (
                            <svg
                              className="w-6 h-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-6 h-6 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview new images */}
              {secondaryImageFiles.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2 text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
                    New Images Preview
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {secondaryImageFiles.map((file, index) => (
                      <img
                        key={`new-${index}`}
                        src={URL.createObjectURL(file)}
                        alt={`New ${index + 1}`}
                        className="h-28 w-full rounded-xl border-2 border-green-400 object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        ) : (
          <Card title="Gallery Images">
            {user?.secondaryImages?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {user.secondaryImages.map((imgPath, index) => (
                  <img
                    key={`${imgPath}-${index}`}
                    src={attachUrl(imgPath)}
                    alt={`Secondary ${index + 1}`}
                    className="h-28 w-full rounded-xl border border-theme-light-border object-cover dark:border-theme-dark-border"
                  />
                ))}
              </div>
            ) : (
              <p className="text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                No secondary images
              </p>
            )}
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Basic Info" icon={<FaUser />}>
            <EditableRow
              label="Gender"
              value={editMode ? formData.gender : user.gender}
              editable={editMode}
              onChange={(val) => handleInputChange("gender", val)}
              type="select"
              options={["male", "female", "other"]}
            />
            <EditableRow
              label="Date of Birth"
              value={editMode ? formData.dob : user.dob}
              editable={editMode}
              onChange={(val) => handleInputChange("dob", val)}
              type="date"
            />
            <EditableRow
              label="Age"
              value={
                editMode ? calculateAge(formData.dob) : calculateAge(user.dob)
              }
              editable={false}
            />
            <EditableRow
              label="Height (cm)"
              value={editMode ? formData.heightCm : user.heightCm}
              editable={editMode}
              onChange={(val) => handleInputChange("heightCm", val)}
              type="number"
            />
            <EditableRow
              label="Profession"
              value={editMode ? formData.profession : user.profession}
              editable={editMode}
              onChange={(val) => handleInputChange("profession", val)}
            />
            <EditableRow
              label="Company"
              value={editMode ? formData.company : user.company}
              editable={editMode}
              onChange={(val) => handleInputChange("company", val)}
            />
            <EditableRow
              label="Education"
              value={editMode ? formData.education : user.education}
              editable={editMode}
              onChange={(val) => handleInputChange("education", val)}
            />
          </Card>

          <Card title="Preferences" icon={<FaHeart />}>
            <EditableRow
              label="Interested In"
              value={
                editMode
                  ? formData.preferences?.interestedIn
                  : user.preferences?.interestedIn
              }
              editable={editMode}
              onChange={(val) =>
                handleNestedChange("preferences", "interestedIn", val)
              }
              type="select"
              options={["male", "female", "everyone"]}
            />
            <EditableRow
              label="Min Age"
              value={
                editMode
                  ? formData.preferences?.minAge
                  : user.preferences?.minAge
              }
              editable={editMode}
              onChange={(val) =>
                handleNestedChange("preferences", "minAge", val)
              }
              type="number"
            />
            <EditableRow
              label="Max Age"
              value={
                editMode
                  ? formData.preferences?.maxAge
                  : user.preferences?.maxAge
              }
              editable={editMode}
              onChange={(val) =>
                handleNestedChange("preferences", "maxAge", val)
              }
              type="number"
            />
            <EditableRow
              label="Max Distance (km)"
              value={
                editMode
                  ? formData.preferences?.maxDistanceKm
                  : user.preferences?.maxDistanceKm
              }
              editable={editMode}
              onChange={(val) =>
                handleNestedChange("preferences", "maxDistanceKm", val)
              }
              type="number"
            />
          </Card>

          <Card title="Lifestyle" icon={<FaBriefcase />}>
            <EditableRow
              label="Drinking"
              value={
                editMode
                  ? formData.lifestyle?.drinking
                  : user.lifestyle?.drinking
              }
              editable={editMode}
              onChange={(val) =>
                handleNestedChange("lifestyle", "drinking", val)
              }
              type="select"
              options={["never", "rarely", "socially", "regularly"]}
            />
            <EditableRow
              label="Smoking"
              value={
                editMode ? formData.lifestyle?.smoking : user.lifestyle?.smoking
              }
              editable={editMode}
              onChange={(val) =>
                handleNestedChange("lifestyle", "smoking", val)
              }
              type="select"
              options={["never", "occasionally", "regularly"]}
            />
            <EditableRow
              label="Workout"
              value={
                editMode ? formData.lifestyle?.workout : user.lifestyle?.workout
              }
              editable={editMode}
              onChange={(val) =>
                handleNestedChange("lifestyle", "workout", val)
              }
              type="select"
              options={["never", "sometimes", "often", "daily"]}
            />
            <EditableRow
              label="Diet"
              value={editMode ? formData.lifestyle?.diet : user.lifestyle?.diet}
              editable={editMode}
              onChange={(val) => handleNestedChange("lifestyle", "diet", val)}
              type="select"
              options={["veg", "non-veg", "vegan", "no-preference"]}
            />
          </Card>

          <Card title="Relationship & Location" icon={<FaHeart />}>
            <EditableRow
              label="Relationship Goal"
              value={
                editMode ? formData.relationshipGoal : user.relationshipGoal
              }
              editable={editMode}
              onChange={(val) => handleInputChange("relationshipGoal", val)}
              type="select"
              options={["casual", "serious", "friendship", "marriage"]}
            />
            <EditableRow
              label="City"
              value={editMode ? formData.location?.city : user.location?.city}
              editable={editMode}
              onChange={(val) => handleNestedChange("location", "city", val)}
            />
            <EditableRow
              label="Country"
              value={
                editMode ? formData.location?.country : user.location?.country
              }
              editable={editMode}
              onChange={(val) => handleNestedChange("location", "country", val)}
            />
          </Card>

          <Card title="Privacy Settings" icon={<FaUser />}>
            <EditableToggle
              label="Show Age"
              value={
                editMode ? formData.privacy?.showAge : user.privacy?.showAge
              }
              editable={editMode}
              onChange={(val) => handleNestedChange("privacy", "showAge", val)}
            />
            <EditableToggle
              label="Show Distance"
              value={
                editMode
                  ? formData.privacy?.showDistance
                  : user.privacy?.showDistance
              }
              editable={editMode}
              onChange={(val) =>
                handleNestedChange("privacy", "showDistance", val)
              }
            />
          </Card>

          <Card title="Account" icon={<FaUser />}>
            <Row label="Status" value={user.status} />
            {user.statusReason && (
              <Row label="Status Reason" value={user.statusReason} />
            )}
            <Row label="Premium" value={user.isPremium ? "Yes" : "No"} />
            <Row label="Verified" value={user.isVerified ? "Yes" : "No"} />
            <Row label="Joined" value={formatDateTime(user.createdAt)} />
            <Row
              label="Last Active"
              value={formatDateTime(user.lastActiveAt)}
            />
          </Card>
        </div>

        {/* Interests & Languages */}
        <div className="grid md:grid-cols-2 gap-6">
          {editMode ? (
            <Card title="Interests" icon={<FaHeart />}>
              <textarea
                value={(formData.interests || []).join(", ")}
                onChange={(e) =>
                  handleInputChange(
                    "interests",
                    e.target.value
                      .split(",")
                      .map((i) => i.trim())
                      .filter((i) => i),
                  )
                }
                className="theme-input w-full min-h-20"
                placeholder="Enter interests separated by commas..."
              />
            </Card>
          ) : (
            <Card title="Interests" icon={<FaHeart />}>
              <TagList items={user.interests} />
            </Card>
          )}

          {editMode ? (
            <Card title="Languages" icon={<FaLanguage />}>
              <textarea
                value={(formData.languages || []).join(", ")}
                onChange={(e) =>
                  handleInputChange(
                    "languages",
                    e.target.value
                      .split(",")
                      .map((l) => l.trim())
                      .filter((l) => l),
                  )
                }
                className="theme-input w-full min-h-20"
                placeholder="Enter languages separated by commas..."
              />
            </Card>
          ) : (
            <Card title="Languages" icon={<FaLanguage />}>
              <TagList items={user.languages} />
            </Card>
          )}
        </div>
        {editMode ? (
          <Card title="Bio">
            <textarea
              value={editMode ? formData.bio : user.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              className="theme-input w-full min-h-24"
              placeholder="Enter bio..."
            />
          </Card>
        ) : (
          <Card title="Bio">
            <p className="leading-relaxed text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
              {user.bio || "No bio provided"}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}

/* Components */

function Card({ title, icon, children }) {
  return (
    <div className="rounded-2xl border border-theme-light-border bg-theme-light-surface p-6 shadow-md transition hover:shadow-xl dark:border-theme-dark-border dark:bg-theme-dark-surface">
      <div className="mb-4 flex items-center gap-2 text-theme-light-primaryButton dark:text-theme-dark-primaryButton">
        {icon}
        <h3 className="text-lg font-semibold text-theme-light-heading dark:text-theme-dark-textPrimary">
          {title}
        </h3>
      </div>

      <div className="space-y-3 text-sm text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between border-b border-theme-light-border pb-1 dark:border-theme-dark-border">
      <span className="text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
        {label}
      </span>
      <span className="font-medium text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
        {value || "—"}
      </span>
    </div>
  );
}

function EditableRow({
  label,
  value,
  editable,
  onChange,
  type = "text",
  options = [],
}) {
  if (!editable) {
    return (
      <div className="flex justify-between border-b border-theme-light-border pb-1 dark:border-theme-dark-border">
        <span className="text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
          {label}
        </span>
        <span className="font-medium text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
          {value || "—"}
        </span>
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className="flex justify-between items-center border-b border-theme-light-border pb-2 dark:border-theme-dark-border">
        <span className="text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
          {label}
        </span>
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="theme-input max-w-[150px] text-sm"
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "date") {
    return (
      <div className="flex justify-between items-center border-b border-theme-light-border pb-2 dark:border-theme-dark-border">
        <span className="text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
          {label}
        </span>
        <input
          type="date"
          value={value ? new Date(value).toISOString().split("T")[0] : ""}
          onChange={(e) => onChange(e.target.value)}
          className="theme-input max-w-[150px] text-sm"
        />
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center border-b border-theme-light-border pb-2 dark:border-theme-dark-border">
      <span className="text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
        {label}
      </span>
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="theme-input max-w-[150px] text-sm"
        placeholder="—"
      />
    </div>
  );
}

function EditableToggle({ label, value, editable, onChange }) {
  if (!editable) {
    return (
      <div className="flex justify-between border-b border-theme-light-border pb-1 dark:border-theme-dark-border">
        <span className="text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
          {label}
        </span>
        <span className="font-medium text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
          {value ? "Yes" : "No"}
        </span>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center border-b border-theme-light-border pb-2 dark:border-theme-dark-border">
      <span className="text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
        {label}
      </span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={value || false}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );
}

function TagList({ items }) {
  if (!items?.length)
    return (
      <p className="text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
        None
      </p>
    );

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span
          key={i}
          className="rounded-full bg-theme-light-surfaceAlt px-3 py-1 text-xs text-theme-light-textPrimary transition-colors hover:bg-theme-light-border dark:bg-theme-dark-inputBg dark:text-theme-dark-textPrimary dark:hover:bg-theme-dark-border"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

/* Helpers */

function formatDateTime(date) {
  if (!date) return "—";
  return new Date(date).toLocaleString();
}

function calculateAge(dob) {
  if (!dob) return "—";
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;

  return age;
}
