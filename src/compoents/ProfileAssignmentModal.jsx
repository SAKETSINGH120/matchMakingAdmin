import React, { useEffect, useState, useCallback } from "react";
import { Modal, Spin } from "antd";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import {
  getAvailableProfiles,
  removeAssignedProfileFromUser,
} from "../../src1/Services/userServices";
import { clearFeed } from "../../src/Services/FeedApi";
const { getUserById } = import("../Services/userServices");

const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function ProfileAssignmentModal({
  open,
  userId,
  onClose,
  onConfirm,
  loading = false,
}) {
  const [profiles, setProfiles] = useState([]);
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [fetching, setFetching] = useState(false);
  const [removingProfileId, setRemovingProfileId] = useState(null);

  // New state for viewing profile details inside this modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [profileDetailsLoading, setProfileDetailsLoading] = useState(false);
  const [selectedProfileDetails, setSelectedProfileDetails] = useState(null);

  const fetchProfiles = useCallback(async () => {
    try {
      setFetching(true);
      const result = await getAvailableProfiles(userId);
      if (result?.success && result?.data) {
        setProfiles(result.data);
        setSelectedProfiles([]);
        setSearchTerm("");
      }
    } catch (error) {
      console.error("Error fetching profiles:", error);
    } finally {
      setFetching(false);
    }
  }, [userId]);

  useEffect(() => {
    if (open && userId) {
      fetchProfiles();
    }
  }, [open, userId, fetchProfiles]);

  const handleProfileToggle = (profileId) => {
    setSelectedProfiles((prev) => {
      if (prev.includes(profileId)) {
        return prev.filter((id) => id !== profileId);
      } else {
        return [...prev, profileId];
      }
    });
  };

  const handleConfirm = () => {
    if (selectedProfiles.length === 0) {
      toast.error("Please select at least one profile");
      return;
    }
    onConfirm(selectedProfiles);
  };

  const handleClose = () => {
    setSelectedProfiles([]);
    setSearchTerm("");
    onClose();
  };

  const handleClearFeed = async () => {
    try {
      const result = await clearFeed(userId);
      if (result?.success) {
        toast.success("Feed cleared successfully");
        fetchProfiles();
      } else {
        toast.error(result?.message || "Failed to clear feed");
      }
    } catch (error) {
      console.error("Error clearing feed:", error);
      toast.error("Error clearing feed");
    }
  };

  const handleRemoveAssignedProfile = async (targetProfileId) => {
    try {
      setRemovingProfileId(targetProfileId);
      const result = await removeAssignedProfileFromUser(
        userId,
        targetProfileId,
      );

      if (result?.success) {
        toast.success("Assigned profile removed successfully");
        setSelectedProfiles((prev) =>
          prev.filter((id) => id !== targetProfileId),
        );
        fetchProfiles();
      } else {
        toast.error(result?.message || "Failed to remove assigned profile");
      }
    } catch (error) {
      console.error("Error removing assigned profile:", error);
      toast.error("Error removing assigned profile");
    } finally {
      setRemovingProfileId(null);
    }
  };

  const openProfileDetails = async (profileId) => {
    try {
      setProfileDetailsLoading(true);
      setViewModalOpen(true);
      setSelectedProfileDetails(null);

      const res = await getUserById(profileId);
      if (res?.success && res.data) {
        setSelectedProfileDetails(res.data);
      } else {
        setSelectedProfileDetails(null);
      }
    } catch (err) {
      console.error("Error fetching profile details:", err);
      setSelectedProfileDetails(null);
    } finally {
      setProfileDetailsLoading(false);
    }
  };

  const formatDateTime = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
      });
    } catch (e) {
      return iso;
    }
  };

  const formatDate = (iso) => {
    if (!iso) return "—";
    try {
      return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      });
    } catch (e) {
      return iso;
    }
  };

  const yesNo = (v) => (v ? "Yes" : "No");

  const isSelected = (profileId) => selectedProfiles.includes(profileId);

  const filteredProfiles = profiles.filter((profile) => {
    const query = searchTerm.trim().toLowerCase();
    const queryDigits = query.replace(/\D/g, "");

    const normalizeText = (value) => String(value || "").toLowerCase();
    const normalizeDigits = (value) => String(value || "").replace(/\D/g, "");

    const name = normalizeText(profile.name);
    const searchableNumbers = [
      profile.number,
      profile.phoneNumber,
      profile.mobile,
      profile.contactNumber,
      profile.profileNumber,
      profile.id,
      profile._id,
    ]
      .map(normalizeDigits)
      .filter(Boolean);

    if (!query) return true;

    return (
      name.includes(query) ||
      searchableNumbers.some((number) => number.includes(queryDigits))
    );
  });

  return (
    <>
      <Modal
        open={open}
        title={
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-gray-900"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a4 4 0 00-4-4h-2.5a4 4 0 00-4 4v1h10.5z" />
                </svg>
              </div>
              <div>
                <span className="text-lg font-bold text-gray-900">
                  Assign Profiles
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Select one or more profiles to assign
                </p>
              </div>
            </div>
            <button
              onClick={handleClearFeed}
              className="flex-shrink-0 p-2 hover:bg-red-50 rounded-lg transition-colors group"
              title="Clear user feed"
            >
              <svg
                className="w-5 h-5 mr-4 ml-4 text-red-600 group-hover:scale-110 transition-transform"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
              </svg>
            </button>
          </div>
        }
        onCancel={handleClose}
        onOk={handleConfirm}
        okText={`Assign (${selectedProfiles.length})`}
        cancelText="Cancel"
        confirmLoading={loading}
        width={920}
        okButtonProps={{
          disabled: selectedProfiles.length === 0,
          className:
            selectedProfiles.length === 0
              ? "opacity-50 cursor-not-allowed"
              : "",
        }}
        modalRender={(modal) => (
          <Spin spinning={fetching} size="large">
            {modal}
          </Spin>
        )}
        bodyStyle={{ maxHeight: "550px", overflowY: "auto", padding: "24px" }}
      >
        <div className="mb-5">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Search by name or number
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type name or number..."
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 pr-10 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-gray-400"
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full px-2 py-1 text-xs font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                Clear
              </button>
            ) : null}
          </div>
        </div>

        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {filteredProfiles.map((profile) => {
              const profileId = profile._id || profile.id;
              const selected = isSelected(profileId);
              const imageUrl = profile.primaryImage
                ? `${BASE_URL}/${profile.primaryImage}`
                : "data:image/jpeg;base64,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";
              // : // //"/images/userDefaultLogo.jpg"
              //`${BASE_URL}/${profile.primaryImage}`
              ("");

              return (
                <div
                  key={profileId}
                  onClick={() => {
                    if (!profile.isAssigned) {
                      handleProfileToggle(profileId);
                    }
                  }}
                  className={`cursor-pointer rounded-xl overflow-hidden transition-all duration-300 group ${
                    selected
                      ? "ring-2 ring-gray-900 ring-offset-2 shadow-xl scale-105"
                      : "border border-gray-200 shadow-sm hover:shadow-lg hover:border-gray-300 hover:scale-102"
                  }`}
                >
                  <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={profile.name}
                      className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src = "";
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="absolute top-3 right-3 z-10">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shadow-md ${
                          selected
                            ? "bg-gray-900 border-gray-900 scale-110"
                            : "bg-white border-gray-300 group-hover:border-gray-500 group-hover:scale-110"
                        }`}
                      >
                        {selected && (
                          <svg
                            className="w-3.5 h-3.5 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-white">
                    <h3 className="text-sm font-bold text-gray-900 truncate leading-tight">
                      {profile.name}
                    </h3>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-700 font-medium">
                            {profile.gender ? profile.gender : "—"}
                          </span>
                        </div>
                        {profile.education && (
                          <span className="text-gray-500 text-right line-clamp-1">
                            {profile.education}
                          </span>
                        )}
                      </div>
                      {profile.isAssigned ? (
                        <div className="space-y-2">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 w-full justify-center">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              />
                            </svg>
                            <span className="text-xs font-semibold">
                              Already Assigned
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveAssignedProfile(profileId);
                            }}
                            disabled={removingProfileId === profileId}
                            className="w-full rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {removingProfileId === profileId
                              ? "Removing..."
                              : "Remove from Feed"}
                          </button>
                        </div>
                      ) : profile.isVerified ? (
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-900 text-white w-full justify-center">
                          <svg
                            className="w-3.5 h-3.5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            />
                          </svg>
                          <span className="text-xs font-semibold">
                            Verified
                          </span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 w-full justify-center text-xs font-medium">
                          Unverified
                        </div>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        openProfileDetails(profileId);
                      }}
                      className="w-full mt-3 rounded-full bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-600 transition-colors hover:bg-blue-100"
                      title="View profile details"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
              </svg>
            </div>
            <p className="text-gray-900 font-semibold text-lg">
              {searchTerm
                ? "No matching profiles found"
                : "No profiles available"}
            </p>
            <p className="text-gray-500 text-sm mt-2 text-center max-w-md">
              {searchTerm
                ? "Try a different name or number."
                : "Try searching for other users to assign profiles."}
            </p>
          </div>
        )}
      </Modal>

      {/* Inline profile details modal */}
      <Modal
        open={viewModalOpen}
        title="Profile Details"
        onCancel={() => {
          setViewModalOpen(false);
          setSelectedProfileDetails(null);
        }}
        footer={null}
        width={800}
      >
        {profileDetailsLoading ? (
          <div className="flex items-center justify-center py-10">
            <Spin />
          </div>
        ) : selectedProfileDetails ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <img
                src={
                  selectedProfileDetails.primaryImage
                    ? `${BASE_URL}/${selectedProfileDetails.primaryImage}`
                    : "/images/userDefaultLogo.jpg"
                }
                alt={selectedProfileDetails.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-semibold">
                  {selectedProfileDetails.name || "—"}
                </h3>
                <p className="text-sm text-gray-500">
                  {selectedProfileDetails.number || "—"}
                </p>
                <p className="text-sm text-gray-500">
                  {selectedProfileDetails.gender
                    ? selectedProfileDetails.gender.charAt(0).toUpperCase() +
                      selectedProfileDetails.gender.slice(1)
                    : "—"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">DOB</div>
                <div className="font-medium">
                  {selectedProfileDetails.dob
                    ? formatDate(selectedProfileDetails.dob)
                    : "—"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Age</div>
                <div className="font-medium">
                  {selectedProfileDetails.dob
                    ? (function () {
                        const b = new Date(selectedProfileDetails.dob);
                        const t = new Date();
                        let a = t.getUTCFullYear() - b.getUTCFullYear();
                        const m = t.getUTCMonth() - b.getUTCMonth();
                        if (
                          m < 0 ||
                          (m === 0 && t.getUTCDate() < b.getUTCDate())
                        )
                          a--;
                        return a;
                      })()
                    : "—"}
                </div>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Bio</div>
              <div className="font-medium">
                {selectedProfileDetails.bio || "—"}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div>
                <div className="text-xs text-gray-500">Created</div>
                <div className="font-medium">
                  {formatDateTime(selectedProfileDetails.createdAt)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Updated</div>
                <div className="font-medium">
                  {formatDateTime(selectedProfileDetails.updatedAt)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Status</div>
                <div className="font-medium">
                  {selectedProfileDetails.status || "—"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div>
                <div className="text-xs text-gray-500">Activity Score</div>
                <div className="font-medium">
                  {selectedProfileDetails.activityScore ?? "—"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Profile Completion</div>
                <div className="font-medium">
                  {selectedProfileDetails.profileCompletionPercent ?? "—"}%
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Max Distance (km)</div>
                <div className="font-medium">
                  {selectedProfileDetails.preferences?.maxDistanceKm ?? "—"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              <div>
                <div className="text-xs text-gray-500">Premium</div>
                <div className="font-medium">
                  {yesNo(selectedProfileDetails.isPremium)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Verified</div>
                <div className="font-medium">
                  {yesNo(selectedProfileDetails.isVerified)}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Privacy</div>
                <div className="font-medium">
                  Age: {yesNo(selectedProfileDetails.privacy?.showAge)} ·
                  Distance:{" "}
                  {yesNo(selectedProfileDetails.privacy?.showDistance)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <div className="text-xs text-gray-500">Languages</div>
                <div className="font-medium">
                  {(selectedProfileDetails.languages || []).join(", ") || "—"}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Interests</div>
                <div className="font-medium">
                  {(selectedProfileDetails.interests || []).join(", ") || "—"}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <div className="text-xs text-gray-500">Location</div>
              <div className="font-medium">
                {selectedProfileDetails.location?.coordinates &&
                selectedProfileDetails.location.coordinates.length
                  ? selectedProfileDetails.location.coordinates.join(", ")
                  : "—"}
              </div>
            </div>

            {selectedProfileDetails.secondaryImages &&
              selectedProfileDetails.secondaryImages.length > 0 && (
                <div className="pt-2">
                  <div className="text-xs text-gray-500">Secondary Images</div>
                  <div className="flex items-center gap-2 mt-2">
                    {selectedProfileDetails.secondaryImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={
                          img.startsWith("http") ? img : `${BASE_URL}/${img}`
                        }
                        alt={`img-${idx}`}
                        className="w-12 h-12 rounded object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
          </div>
        ) : (
          <div>No details available</div>
        )}
      </Modal>
    </>
  );
}
