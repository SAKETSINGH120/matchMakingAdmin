import * as React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserById, updateUserProfile } from "../../Services/userServices";
import Breaker from "../../compoents/Breaker";
import {
  FaUser,
  FaBriefcase,
  FaHeart,
  FaLanguage,
  FaGlobe,
  FaEye,
} from "react-icons/fa";
import attachUrl from "../../utils/attachUrl";

export default function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    number: "",
    email: "",
    gender: "",
    dob: "",
    heightCm: "",
    profession: "",
    company: "",
    education: "",
    bio: "",
    isVerified: false,
    isPremium: false,
    status: "active",
    statusReason: "",
    relationshipGoal: "",
    lifestyle: {
      drinking: "",
      smoking: "",
      workout: "",
      diet: "",
    },
    preferences: {
      interestedIn: "",
      minAge: "",
      maxAge: "",
      maxDistanceKm: "",
    },
    location: {
      type: "Point",
      coordinates: [0, 0],
      city: "",
      country: "",
    },
    privacy: {
      showAge: true,
      showDistance: true,
    },
    interests: [],
    languages: [],
  });

  const [remainingSecondaryImages, setRemainingSecondaryImages] = useState([]);
  const [primaryImageFile, setPrimaryImageFile] = useState(null);
  const [secondaryImageFiles, setSecondaryImageFiles] = useState([]);

  // Image removal tracks
  const [originalUser, setOriginalUser] = useState(null);

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
          const user = result.data;
          setOriginalUser(user);
          setRemainingSecondaryImages(user.secondaryImages || []);

          setFormData({
            name: user.name || "",
            number: user.number || "",
            email: user.email || "",
            gender: user.gender || "",
            dob: user.dob ? new Date(user.dob).toISOString().split("T")[0] : "",
            heightCm: user.heightCm || "",
            profession: user.profession || "",
            company: user.company || "",
            education: user.education || "",
            bio: user.bio || "",
            isVerified: user.isVerified || false,
            isPremium: user.isPremium || false,
            status: user.status || "active",
            statusReason: user.statusReason || "",
            relationshipGoal: user.relationshipGoal || "",
            lifestyle: {
              drinking: user.lifestyle?.drinking || "",
              smoking: user.lifestyle?.smoking || "",
              workout: user.lifestyle?.workout || "",
              diet: user.lifestyle?.diet || "",
            },
            preferences: {
              interestedIn: user.preferences?.interestedIn || "",
              minAge: user.preferences?.minAge || "",
              maxAge: user.preferences?.maxAge || "",
              maxDistanceKm: user.preferences?.maxDistanceKm || "",
            },
            location: {
              type: "Point",
              coordinates: user.location?.coordinates || [0, 0],
              city: user.location?.city || "",
              country: user.location?.country || "",
            },
            privacy: {
              showAge: user.privacy?.showAge ?? true,
              showDistance: user.privacy?.showDistance ?? true,
            },
            interests: user.interests || [],
            languages: user.languages || [],
          });
        } else {
          toast.error(result?.message || "Failed to load user");
          navigate("/users");
        }
      } catch (err) {
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

  const handleCoordinateChange = (idx, val) => {
    setFormData((prev) => {
      const newCoords = [...(prev.location?.coordinates || [0, 0])];
      newCoords[idx] = parseFloat(val) || 0;
      return {
        ...prev,
        location: {
          ...prev.location,
          coordinates: newCoords,
        },
      };
    });
  };

  const handleRemoveExistingSecondaryImage = (imgPath) => {
    setRemainingSecondaryImages((prev) =>
      prev.filter((img) => img !== imgPath),
    );
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);

      const hasNewFiles = primaryImageFile || secondaryImageFiles.length > 0;

      // Clean and sanitize optional array inputs to only contain elements meeting validation criteria (min 2 chars)
      const cleanLanguages = Array.isArray(formData.languages)
        ? formData.languages
            .map((lang) => lang.trim())
            .filter((lang) => lang.length >= 2)
        : [];

      const cleanInterests = Array.isArray(formData.interests)
        ? formData.interests
            .map((item) => item.trim())
            .filter((item) => item.length >= 2)
        : [];

      // Clean lifestyle and preferences objects to completely omit undefined/empty sub-fields
      const lifestyleObj = {
        drinking: formData.lifestyle?.drinking || undefined,
        smoking: formData.lifestyle?.smoking || undefined,
        workout: formData.lifestyle?.workout || undefined,
        diet: formData.lifestyle?.diet || undefined,
      };
      const hasLifestyleObj = Object.values(lifestyleObj).some(
        (val) => val !== undefined,
      );

      const preferencesObj = {
        interestedIn: formData.preferences?.interestedIn || undefined,
        minAge: formData.preferences?.minAge
          ? Number(formData.preferences.minAge)
          : undefined,
        maxAge: formData.preferences?.maxAge
          ? Number(formData.preferences.maxAge)
          : undefined,
        maxDistanceKm: formData.preferences?.maxDistanceKm
          ? Number(formData.preferences.maxDistanceKm)
          : undefined,
      };
      const hasPreferencesObj = Object.values(preferencesObj).some(
        (val) => val !== undefined,
      );

      // Construct a clean nested structure for JSON payload, omitting empty optional fields
      const jsonPayload = {
        name: formData.name ? formData.name.trim() : "",
        number: formData.number ? formData.number.trim() : "",
        email: formData.email ? formData.email.trim() : "",
        dob: formData.dob || undefined,
        gender: formData.gender || undefined,
        bio: formData.bio ? formData.bio.trim() : undefined,
        education: formData.education ? formData.education.trim() : undefined,
        profession: formData.profession
          ? formData.profession.trim()
          : undefined,
        company: formData.company ? formData.company.trim() : undefined,
        heightCm: formData.heightCm ? Number(formData.heightCm) : undefined,
        languages: cleanLanguages.length > 0 ? cleanLanguages : undefined,
        interests: cleanInterests.length > 0 ? cleanInterests : undefined,
        isVerified: formData.isVerified,
        isPremium: formData.isPremium,
        status: formData.status,
        statusReason: formData.statusReason
          ? formData.statusReason.trim()
          : undefined,
        relationshipGoal: formData.relationshipGoal || undefined,
        lifestyle: hasLifestyleObj ? lifestyleObj : undefined,
        preferences: hasPreferencesObj ? preferencesObj : undefined,
        location: {
          type: "Point",
          coordinates: formData.location?.coordinates || [0, 0],
          city: formData.location?.city
            ? formData.location.city.trim()
            : undefined,
          country: formData.location?.country
            ? formData.location.country.trim()
            : undefined,
        },
        privacy: {
          showAge: formData.privacy?.showAge ?? true,
          showDistance: formData.privacy?.showDistance ?? true,
        },
        secondaryImages: remainingSecondaryImages, // Kept images list
      };

      if (hasNewFiles) {
        // Use multipart FormData with explicit flat dot-notation serialization
        // to align with the backend's express-validator check paths.
        const fd = new FormData();

        // 1. Basic Fields
        if (jsonPayload.name) fd.append("name", jsonPayload.name);
        if (jsonPayload.number) fd.append("number", jsonPayload.number);
        if (jsonPayload.email) fd.append("email", jsonPayload.email);
        if (jsonPayload.dob) fd.append("dob", jsonPayload.dob);
        if (jsonPayload.gender) fd.append("gender", jsonPayload.gender);
        if (jsonPayload.bio) fd.append("bio", jsonPayload.bio);
        if (jsonPayload.education)
          fd.append("education", jsonPayload.education);
        if (jsonPayload.profession)
          fd.append("profession", jsonPayload.profession);
        if (jsonPayload.company) fd.append("company", jsonPayload.company);
        if (jsonPayload.heightCm !== undefined)
          fd.append("heightCm", String(jsonPayload.heightCm));

        fd.append("isVerified", String(jsonPayload.isVerified));
        fd.append("isPremium", String(jsonPayload.isPremium));
        fd.append("status", jsonPayload.status);
        if (jsonPayload.statusReason)
          fd.append("statusReason", jsonPayload.statusReason);
        if (jsonPayload.relationshipGoal)
          fd.append("relationshipGoal", jsonPayload.relationshipGoal);

        // 2. Arrays: multi-append for languages and interests to be parsed as real arrays
        if (Array.isArray(jsonPayload.languages)) {
          jsonPayload.languages.forEach((lang) => {
            fd.append("languages", lang);
          });
        }
        if (Array.isArray(jsonPayload.interests)) {
          jsonPayload.interests.forEach((interest) => {
            fd.append("interests", interest);
          });
        }

        // 3. Lifestyle dot-notation nested properties
        if (jsonPayload.lifestyle?.drinking) {
          fd.append("lifestyle.drinking", jsonPayload.lifestyle.drinking);
        }
        if (jsonPayload.lifestyle?.smoking) {
          fd.append("lifestyle.smoking", jsonPayload.lifestyle.smoking);
        }
        if (jsonPayload.lifestyle?.workout) {
          fd.append("lifestyle.workout", jsonPayload.lifestyle.workout);
        }
        if (jsonPayload.lifestyle?.diet) {
          fd.append("lifestyle.diet", jsonPayload.lifestyle.diet);
        }

        // 4. Preferences dot-notation nested properties
        if (jsonPayload.preferences?.interestedIn) {
          fd.append(
            "preferences.interestedIn",
            jsonPayload.preferences.interestedIn,
          );
        }
        if (jsonPayload.preferences?.minAge !== undefined) {
          fd.append(
            "preferences.minAge",
            String(jsonPayload.preferences.minAge),
          );
        }
        if (jsonPayload.preferences?.maxAge !== undefined) {
          fd.append(
            "preferences.maxAge",
            String(jsonPayload.preferences.maxAge),
          );
        }
        if (jsonPayload.preferences?.maxDistanceKm !== undefined) {
          fd.append(
            "preferences.maxDistanceKm",
            String(jsonPayload.preferences.maxDistanceKm),
          );
        }

        // 5. Location dot-notation nested properties
        if (jsonPayload.location?.city) {
          fd.append("location.city", jsonPayload.location.city);
        }
        if (jsonPayload.location?.country) {
          fd.append("location.country", jsonPayload.location.country);
        }
        // coordinates array (multi-append)
        if (
          Array.isArray(jsonPayload.location?.coordinates) &&
          jsonPayload.location.coordinates.length === 2
        ) {
          fd.append(
            "location.coordinates",
            String(jsonPayload.location.coordinates[0]),
          ); // Longitude
          fd.append(
            "location.coordinates",
            String(jsonPayload.location.coordinates[1]),
          ); // Latitude
        }

        // 6. Privacy dot-notation nested properties
        fd.append(
          "privacy.showAge",
          String(jsonPayload.privacy?.showAge ?? true),
        );
        fd.append(
          "privacy.showDistance",
          String(jsonPayload.privacy?.showDistance ?? true),
        );

        // 7. Append only kept images under 'secondaryImages' key
        remainingSecondaryImages.forEach((imgUrl) => {
          fd.append("secondaryImages", imgUrl);
        });

        // 8. Append primaryImage file if selected
        if (primaryImageFile) {
          fd.append("primaryImage", primaryImageFile);
        }

        // 9. Append new secondaryImage files if selected
        secondaryImageFiles.forEach((file) => {
          fd.append("secondaryImages", file);
        });

        const result = await updateUserProfile(id, fd, true);
        if (result?.success) {
          toast.success("Profile updated successfully!");
          navigate(`/Home/user/view/${id}`);
        } else {
          toast.error(result?.message || "Failed to update profile");
        }
      } else {
        // Standard JSON payload
        const result = await updateUserProfile(id, jsonPayload, false);
        if (result?.success) {
          toast.success("Profile updated successfully!");
          navigate(`/Home/user/view/${id}`);
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
    navigate(`/Home/user/view/${id}`);
  };

  if (loading) {
    return (
      <div className="theme-page flex min-h-screen items-center justify-center">
        <p className="animate-pulse text-lg text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
          Loading edit form...
        </p>
      </div>
    );
  }

  if (!originalUser) {
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

      <form
        onSubmit={handleUpdateProfile}
        className="max-w-8xl mx-auto space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-8">
          <div>
            <h1 className="text-3xl font-bold text-theme-light-heading dark:text-theme-dark-textPrimary">
              Edit Profile
            </h1>
            <p className="text-sm text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
              Manage all BondTheAgency features, media files, and admin status
              flags.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="theme-btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating}
              className="theme-btn-primary"
            >
              {updating ? "Saving Changes..." : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Profile Header Media Card */}
        <div className="theme-panel p-6 flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <div className="relative group">
              <img
                className="h-28 w-28 rounded-full bg-white ring-4 ring-[#5f6f5c]/20 object-cover object-center shrink-0"
                src={
                  primaryImageFile
                    ? URL.createObjectURL(primaryImageFile)
                    : originalUser.primaryImage
                      ? attachUrl(originalUser.primaryImage)
                      : "/images/userDefaultLogo.jpg"
                }
                alt="User Profile"
              />
              <label className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                <svg
                  className="w-8 h-8 text-white"
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
                  onChange={(e) =>
                    setPrimaryImageFile(e.target.files?.[0] || null)
                  }
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
              Click to replace profile picture
            </p>
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1 text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="theme-input text-sm"
                  placeholder="Enter user full name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Phone Number
                </label>
                <input
                  type="text"
                  required
                  value={formData.number}
                  onChange={(e) => handleInputChange("number", e.target.value)}
                  className="theme-input text-sm"
                  placeholder="e.g. +919876543210"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="theme-input text-sm"
                  placeholder="e.g. user@gmail.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="theme-panel p-6 space-y-4">
          <div className="border-b border-theme-light-border dark:border-theme-dark-border pb-2">
            <h3 className="text-lg font-bold text-theme-light-heading dark:text-theme-dark-textPrimary">
              Gallery Images
            </h3>
            <p className="text-xs text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
              Review and manage secondary images. Removed images will not be
              sent to the server.
            </p>
          </div>

          {/* Add New Gallery Files */}
          <div className="bg-theme-light-surfaceAlt dark:bg-theme-dark-inputBg/50 p-4 rounded-xl space-y-2">
            <label className="block text-sm font-semibold text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
              Upload New Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                setSecondaryImageFiles(Array.from(e.target.files || []))
              }
              className="theme-input w-full cursor-pointer text-sm"
            />
            {secondaryImageFiles.length > 0 && (
              <p className="text-xs text-green-600 dark:text-green-400">
                {secondaryImageFiles.length} new files ready for upload.
              </p>
            )}
          </div>

          {/* Existing Gallery Images */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
              Active Gallery Images ({remainingSecondaryImages.length})
            </p>

            {remainingSecondaryImages.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {remainingSecondaryImages.map((imgPath, index) => (
                  <div
                    key={index}
                    className="relative group rounded-xl overflow-hidden shadow border border-theme-light-border dark:border-theme-dark-border aspect-square bg-black/5"
                  >
                    <img
                      src={attachUrl(imgPath)}
                      alt={`Gallery ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleRemoveExistingSecondaryImage(imgPath)
                      }
                      className="absolute inset-0 bg-red-600/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white transition-opacity duration-200"
                      title="Click to remove"
                    >
                      <svg
                        className="w-8 h-8 mb-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                      <span className="text-xs font-semibold uppercase tracking-wider">
                        Remove
                      </span>
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm italic text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                No active gallery images.
              </p>
            )}
          </div>

          {/* New Selected Files Preview */}
          {secondaryImageFiles.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-dashed border-theme-light-border dark:border-theme-dark-border">
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                New Upload Previews ({secondaryImageFiles.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {secondaryImageFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative rounded-xl overflow-hidden border-2 border-green-500 aspect-square shadow"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="New preview"
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setSecondaryImageFiles((prev) =>
                          prev.filter((_, i) => i !== index),
                        )
                      }
                      className="absolute top-1 right-1 bg-red-600 hover:bg-red-700 text-white rounded-full p-1 shadow"
                      title="Cancel file"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information Card */}
          <div className="theme-panel p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-theme-light-border dark:border-theme-dark-border pb-2 text-theme-light-primaryButton dark:text-theme-dark-primaryButton font-bold">
              <FaUser />
              <h3 className="text-lg text-theme-light-heading dark:text-theme-dark-textPrimary">
                Basic Info
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Gender
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange("gender", e.target.value)}
                  className="theme-input mt-1"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => handleInputChange("dob", e.target.value)}
                  className="theme-input mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Height (cm)
                </label>
                <input
                  type="number"
                  value={formData.heightCm}
                  onChange={(e) =>
                    handleInputChange("heightCm", e.target.value)
                  }
                  className="theme-input mt-1"
                  placeholder="e.g. 175"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Profession
                </label>
                <input
                  type="text"
                  value={formData.profession}
                  onChange={(e) =>
                    handleInputChange("profession", e.target.value)
                  }
                  className="theme-input mt-1"
                  placeholder="e.g. Software Engineer"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Company
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  className="theme-input mt-1"
                  placeholder="e.g. Google"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Education
                </label>
                <input
                  type="text"
                  value={formData.education}
                  onChange={(e) =>
                    handleInputChange("education", e.target.value)
                  }
                  className="theme-input mt-1"
                  placeholder="e.g. Master in Science"
                />
              </div>
            </div>
          </div>

          {/* Preferences Card */}
          <div className="theme-panel p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-theme-light-border dark:border-theme-dark-border pb-2 text-theme-light-primaryButton dark:text-theme-dark-primaryButton font-bold">
              <FaHeart />
              <h3 className="text-lg text-theme-light-heading dark:text-theme-dark-textPrimary">
                Preferences
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Interested In
                </label>
                <select
                  value={formData.preferences?.interestedIn}
                  onChange={(e) =>
                    handleNestedChange(
                      "preferences",
                      "interestedIn",
                      e.target.value,
                    )
                  }
                  className="theme-input mt-1"
                >
                  <option value="">Select Option</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="everyone">Everyone</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                    Min Age Preference
                  </label>
                  <input
                    type="number"
                    value={formData.preferences?.minAge}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "minAge",
                        e.target.value,
                      )
                    }
                    className="theme-input mt-1"
                    placeholder="e.g. 21"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                    Max Age Preference
                  </label>
                  <input
                    type="number"
                    value={formData.preferences?.maxAge}
                    onChange={(e) =>
                      handleNestedChange(
                        "preferences",
                        "maxAge",
                        e.target.value,
                      )
                    }
                    className="theme-input mt-1"
                    placeholder="e.g. 35"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Max Distance (km)
                </label>
                <input
                  type="number"
                  value={formData.preferences?.maxDistanceKm}
                  onChange={(e) =>
                    handleNestedChange(
                      "preferences",
                      "maxDistanceKm",
                      e.target.value,
                    )
                  }
                  className="theme-input mt-1"
                  placeholder="e.g. 50"
                />
              </div>
            </div>
          </div>

          {/* Lifestyle Card */}
          <div className="theme-panel p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-theme-light-border dark:border-theme-dark-border pb-2 text-theme-light-primaryButton dark:text-theme-dark-primaryButton font-bold">
              <FaBriefcase />
              <h3 className="text-lg text-theme-light-heading dark:text-theme-dark-textPrimary">
                Lifestyle
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Drinking
                </label>
                <select
                  value={formData.lifestyle?.drinking}
                  onChange={(e) =>
                    handleNestedChange("lifestyle", "drinking", e.target.value)
                  }
                  className="theme-input mt-1"
                >
                  <option value="">Select Option</option>
                  <option value="never">Never</option>
                  <option value="rarely">Rarely</option>
                  <option value="socially">Socially</option>
                  <option value="regularly">Regularly</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Smoking
                </label>
                <select
                  value={formData.lifestyle?.smoking}
                  onChange={(e) =>
                    handleNestedChange("lifestyle", "smoking", e.target.value)
                  }
                  className="theme-input mt-1"
                >
                  <option value="">Select Option</option>
                  <option value="never">Never</option>
                  <option value="occasionally">Occasionally</option>
                  <option value="regularly">Regularly</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Workout
                </label>
                <select
                  value={formData.lifestyle?.workout}
                  onChange={(e) =>
                    handleNestedChange("lifestyle", "workout", e.target.value)
                  }
                  className="theme-input mt-1"
                >
                  <option value="">Select Option</option>
                  <option value="never">Never</option>
                  <option value="sometimes">Sometimes</option>
                  <option value="often">Often</option>
                  <option value="daily">Daily</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Diet
                </label>
                <select
                  value={formData.lifestyle?.diet}
                  onChange={(e) =>
                    handleNestedChange("lifestyle", "diet", e.target.value)
                  }
                  className="theme-input mt-1"
                >
                  <option value="">Select Option</option>
                  <option value="veg">Veg</option>
                  <option value="non-veg">Non-Veg</option>
                  <option value="vegan">Vegan</option>
                  <option value="no-preference">No Preference</option>
                </select>
              </div>
            </div>
          </div>

          {/* Relationship & Location Card */}
          <div className="theme-panel p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-theme-light-border dark:border-theme-dark-border pb-2 text-theme-light-primaryButton dark:text-theme-dark-primaryButton font-bold">
              <FaGlobe />
              <h3 className="text-lg text-theme-light-heading dark:text-theme-dark-textPrimary">
                Location & Relationship
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Relationship Goal
                </label>
                <select
                  value={formData.relationshipGoal}
                  onChange={(e) =>
                    handleInputChange("relationshipGoal", e.target.value)
                  }
                  className="theme-input mt-1"
                >
                  <option value="">Select Goal</option>
                  <option value="casual">Casual</option>
                  <option value="serious">Serious</option>
                  <option value="friendship">Friendship</option>
                  <option value="marriage">Marriage</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  City
                </label>
                <input
                  type="text"
                  value={formData.location?.city}
                  onChange={(e) =>
                    handleNestedChange("location", "city", e.target.value)
                  }
                  className="theme-input mt-1"
                  placeholder="e.g. Los Angeles"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.location?.country}
                  onChange={(e) =>
                    handleNestedChange("location", "country", e.target.value)
                  }
                  className="theme-input mt-1"
                  placeholder="e.g. United States"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location?.coordinates?.[0] ?? ""}
                    onChange={(e) => handleCoordinateChange(0, e.target.value)}
                    className="theme-input mt-1"
                    placeholder="e.g. -118.24"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.location?.coordinates?.[1] ?? ""}
                    onChange={(e) => handleCoordinateChange(1, e.target.value)}
                    className="theme-input mt-1"
                    placeholder="e.g. 34.05"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Settings Card */}
          <div className="theme-panel p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-theme-light-border dark:border-theme-dark-border pb-2 text-theme-light-primaryButton dark:text-theme-dark-primaryButton font-bold">
              <FaEye />
              <h3 className="text-lg text-theme-light-heading dark:text-theme-dark-textPrimary">
                Privacy Settings
              </h3>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex justify-between items-center border-b border-theme-light-border dark:border-theme-dark-border pb-2">
                <span className="text-sm font-semibold text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
                  Show Age on Profile
                </span>
                <label className="relative inline-flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.privacy?.showAge || false}
                    onChange={(e) =>
                      handleNestedChange("privacy", "showAge", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-400 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-400 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[3px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 dark:peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex justify-between items-center border-b border-theme-light-border dark:border-theme-dark-border pb-2">
                <span className="text-sm font-semibold text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
                  Show Distance to Match
                </span>
                <label className="relative inline-flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.privacy?.showDistance || false}
                    onChange={(e) =>
                      handleNestedChange(
                        "privacy",
                        "showDistance",
                        e.target.checked,
                      )
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-400 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-400 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[3px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 dark:peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Account Settings Card */}
          <div className="theme-panel p-6 space-y-4">
            <div className="flex items-center gap-2 border-b border-theme-light-border dark:border-theme-dark-border pb-2 text-theme-light-primaryButton dark:text-theme-dark-primaryButton font-bold">
              <FaUser />
              <h3 className="text-lg text-theme-light-heading dark:text-theme-dark-textPrimary">
                Account Status
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-theme-light-border dark:border-theme-dark-border pb-2">
                <span className="text-sm font-semibold text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
                  Verified Profile
                </span>
                <label className="relative inline-flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) =>
                      handleInputChange("isVerified", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-400 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-400 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[3px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 dark:peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div className="flex justify-between items-center border-b border-theme-light-border dark:border-theme-dark-border pb-2">
                <span className="text-sm font-semibold text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
                  Premium Membership
                </span>
                <label className="relative inline-flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.isPremium}
                    onChange={(e) =>
                      handleInputChange("isPremium", e.target.checked)
                    }
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-400 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-400 rounded-full peer peer-checked:after:translate-x-7 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[3px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500 dark:peer-checked:bg-emerald-500"></div>
                </label>
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Account Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange("status", e.target.value)}
                  className="theme-input mt-1"
                >
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                  <option value="deleted">Deleted</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                  Status Reason
                </label>
                <textarea
                  value={formData.statusReason}
                  onChange={(e) =>
                    handleInputChange("statusReason", e.target.value)
                  }
                  className="theme-input mt-1 min-h-[80px] text-sm"
                  placeholder="Provide context if blocking or deleting account..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Interests & Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="theme-panel p-6 space-y-2">
            <div className="flex items-center gap-2 border-b border-theme-light-border dark:border-theme-dark-border pb-2 text-theme-light-primaryButton dark:text-theme-dark-primaryButton font-bold">
              <FaHeart />
              <h3 className="text-lg text-theme-light-heading dark:text-theme-dark-textPrimary">
                Interests
              </h3>
            </div>
            <textarea
              value={formData.interests.join(", ")}
              onChange={(e) =>
                handleInputChange(
                  "interests",
                  e.target.value
                    .split(",")
                    .map((item) => item.trim())
                    .filter((item) => item),
                )
              }
              className="theme-input min-h-[100px] text-sm"
              placeholder="Enter interests separated by commas (e.g. Reading, Hiking, Cooking)..."
            />
          </div>

          <div className="theme-panel p-6 space-y-2">
            <div className="flex items-center gap-2 border-b border-theme-light-border dark:border-theme-dark-border pb-2 text-theme-light-primaryButton dark:text-theme-dark-primaryButton font-bold">
              <FaLanguage />
              <h3 className="text-lg text-theme-light-heading dark:text-theme-dark-textPrimary">
                Languages
              </h3>
            </div>
            <textarea
              value={formData.languages.join(", ")}
              onChange={(e) =>
                handleInputChange(
                  "languages",
                  e.target.value
                    .split(",")
                    .map((lang) => lang.trim())
                    .filter((lang) => lang),
                )
              }
              className="theme-input min-h-[100px] text-sm"
              placeholder="Enter languages separated by commas (e.g. English, Spanish, Hindi)..."
            />
          </div>
        </div>

        {/* Bio Section */}
        <div className="theme-panel p-6 space-y-2">
          <h3 className="text-lg font-bold text-theme-light-heading dark:text-theme-dark-textPrimary">
            About Bio
          </h3>
          <textarea
            value={formData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            className="theme-input min-h-[120px] text-sm"
            placeholder="Write user profile bio here..."
            maxLength={500}
          />
          <div className="text-right text-xs text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
            {formData.bio.length} / 500 characters
          </div>
        </div>

        {/* Save/Cancel footer */}
        <div className="flex justify-end gap-4 bg-theme-light-surfaceAlt dark:bg-theme-dark-surfaceAlt p-4 rounded-2xl">
          <button
            type="button"
            onClick={handleCancel}
            className="theme-btn-secondary px-6"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updating}
            className="theme-btn-primary px-8"
          >
            {updating ? "Saving Changes..." : "Save Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}
