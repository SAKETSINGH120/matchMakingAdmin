import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getMatchById, updateMatchStatus } from "../../Services/MatchApi";
import Breaker from "../../compoents/Breaker";
import { format } from "date-fns";
import Status from "./Status";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const MatchView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [match, setMatch] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [adminNote, setAdminNote] = useState("");
  const [loading, setLoading] = useState(true);

  // Helper for consistent capitalization
  const capitalizeWords = (text) => {
    if (!text) return "-";
    return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const handleStatusUpdate = async () => {
    try {
      const result = await updateMatchStatus(
        match._id,
        selectedAction,
        adminNote,
      );
      if (result?.success) {
        toast.success(`Match ${selectedAction} successfully`);
        setMatch((prev) => ({
          ...prev,
          status: selectedAction === "approve" ? "approved" : "rejected",
        }));
        setShowModal(false);
      } else {
        toast.error(result?.message || "Failed to update status");
      }
    } catch {
      toast.error("Error updating status");
    }
  };

  useEffect(() => {
    const fetchMatch = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const result = await getMatchById(id);
        if (result?.success) setMatch(result.data);
      } catch {
        toast.error("Error fetching match details");
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-theme-light-bg transition-colors duration-200 dark:bg-theme-dark-bg">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-theme-light-border border-t-theme-light-primaryButton dark:border-theme-dark-border dark:border-t-theme-dark-primaryButton"></div>
          <p className="animate-pulse font-medium text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
            Loading Premium View...
          </p>
        </div>
      </div>
    );
  }

  const user1 = match?.users?.[0] || {};
  const user2 = match?.users?.[1] || {};

  return (
    <div className="min-h-screen bg-theme-light-bg pb-12 text-theme-light-textPrimary transition-colors duration-200 dark:bg-theme-dark-bg dark:text-theme-dark-textPrimary">
      <Breaker />

      {/* Header Section */}
      <div className="top-0 z-30 mb-8 mt-6 border-b border-theme-light-border bg-theme-light-surface px-6 py-4 shadow-sm transition-colors duration-200 dark:border-theme-dark-border dark:bg-theme-dark-surface">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 font-medium text-theme-light-textSecondary transition-colors duration-200 hover:text-theme-light-primaryButton dark:text-theme-dark-textSecondary dark:hover:text-theme-dark-primaryButton"
          >
            <span className="text-lg">←</span> Back to Matches
          </button>
          {/* {match?.chatEnabled && (
            <button
              onClick={() => navigate(`/Home/match/chat/${match._id}`)}
              className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View Chat
            </button>
          )} */}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        {/* Profile Comparison Section */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Central Match Icon (Desktop Only) */}
          <div className="absolute left-1/2 top-1/2 z-10 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-theme-light-border bg-theme-light-surface shadow-xl transition-colors duration-200 dark:border-theme-dark-border dark:bg-theme-dark-surface lg:flex">
            <span className="text-pink-500 text-2xl font-bold">♥</span>
          </div>

          {[user1, user2].map((user, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-theme-light-border bg-theme-light-surface p-8 shadow-sm transition-all duration-200 hover:shadow-md dark:border-theme-dark-border dark:bg-theme-dark-surface"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img
                    src={
                      user.primaryImage
                        ? `${BASE_URL}/${user.primaryImage}`
                        : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0rz7SHvHoyn3LwaQ6Zc8LkQEmi-ClP8mvZg&s"
                    }
                    alt={user.name}
                    className="h-32 w-32 rounded-3xl object-cover ring-4 ring-theme-light-surfaceAlt shadow-inner dark:ring-theme-dark-inputBg"
                  />
                  {user.isPremium && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-tr from-amber-400 to-yellow-200 text-[10px] font-black px-2 py-1 rounded-lg shadow-sm border border-white">
                      PREMIUM
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-theme-light-heading dark:text-theme-dark-textPrimary">
                  {capitalizeWords(user.name)}
                </h2>
                <p className="mb-6 font-semibold text-theme-light-primaryButton dark:text-theme-dark-primaryButton">
                  {user.number || "Not provided"}
                </p>

                <div className="w-full grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-theme-light-surfaceAlt p-4 text-left transition-colors duration-200 dark:bg-theme-dark-inputBg">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                      Gender
                    </p>
                    <p className="font-medium capitalize text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
                      {user.gender || "—"}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-theme-light-surfaceAlt p-4 text-left transition-colors duration-200 dark:bg-theme-dark-inputBg">
                    <p className="mb-1 text-[11px] font-bold uppercase tracking-wide text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                      Status
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-extrabold tracking-wide ${
                        user.status === "active"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-rose-100 text-rose-700 border-rose-200"
                      }`}
                    >
                      {user.status?.toUpperCase() || "—"}
                    </span>
                    <p className="mb-1 mt-3 text-[11px] font-bold uppercase tracking-wide text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                      Premium
                    </p>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] font-extrabold tracking-wide ${
                        user.isPremium
                          ? "bg-amber-100 text-amber-700 border-amber-200"
                          : "bg-theme-light-surface text-theme-light-textSecondary border-theme-light-border dark:bg-theme-dark-surface dark:text-theme-dark-textSecondary dark:border-theme-dark-border"
                      }`}
                    >
                      {user.isPremium === true ? "YES" : "NO"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Match Verdict Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="rounded-3xl border border-theme-light-border bg-theme-light-surface p-8 shadow-sm transition-colors duration-200 dark:border-theme-dark-border dark:bg-theme-dark-surface">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-theme-light-heading dark:text-theme-dark-textPrimary">
                  Match Overview
                </h3>
                {/* <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100 uppercase">
                  {match.matchType || "System"}
                </span> */}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    Compatibility Score
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-black text-gray-800">
                      {match.compatibilityScore || 0}
                    </span>
                    <span className="text-xl font-bold text-gray-400">%</span>
                  </div>
                  <div className="w-full bg-gray-200 h-2 mt-4 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full transition-all duration-1000"
                      style={{ width: `${match.compatibilityScore}%` }}
                    ></div>
                  </div>
                </div> */}

                <div className="rounded-2xl border border-theme-light-border bg-gradient-to-br from-theme-light-surfaceAlt to-theme-light-surface p-6 transition-colors duration-200 dark:border-theme-dark-border dark:from-theme-dark-inputBg dark:to-theme-dark-surface">
                  <p className="mb-2 text-sm font-medium text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                    Match Status
                  </p>
                  <div
                    className={`text-sm font-black mb-4 ${match.status === "approved" ? "text-emerald-500" : match.status === "pending" ? "text-amber-500" : "text-rose-500"}`}
                  >
                    {match.status?.toUpperCase()}
                  </div>

                  {match.status === "pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setSelectedAction("approve") || setShowModal(true)
                        }
                        className="flex-1 rounded-xl bg-emerald-600 py-2 text-sm font-bold text-white transition-all hover:bg-emerald-700 dark:shadow-none"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          setSelectedAction("reject") || setShowModal(true)
                        }
                        className="flex-1 rounded-xl border border-rose-200 bg-white py-2 text-sm font-bold text-rose-600 transition-all hover:bg-rose-50 dark:border-rose-700/50 dark:bg-theme-dark-surface dark:text-rose-300 dark:hover:bg-rose-900/20"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Meeting Details (if exists) */}
            {match.meeting && (
              //   <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition">

              //     <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              //       <FaInfoCircle className="text-[#3f4f3c]" />
              //       Meeting Logistics
              //     </h3>

              //     <div className="space-y-6">

              //       {/* Status */}
              //       <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
              //         <div>
              //           <p className="text-xs font-semibold text-gray-400 uppercase mb-1">
              //             Status
              //           </p>

              //           <span
              //             className={`px-4 py-1 rounded-full text-sm font-semibold capitalize
              // ${match.meeting.status === "approved"
              //                 ? "bg-green-100 text-green-600"
              //                 : match.meeting.status === "rejected"
              //                   ? "bg-red-100 text-red-500"
              //                   : "bg-yellow-100 text-yellow-600"
              //               }`}
              //           >
              //             {match.meeting.status || "Pending"}
              //           </span>
              //         </div>
              //       </div>

              //       {/* Schedule + Venue */}
              //       <div className="grid md:grid-cols-2 gap-4">

              //         {/* Schedule */}
              //         <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100 flex items-start gap-3">
              //           <FaCalendarAlt className="text-purple-500 mt-1" />

              //           <div>
              //             <p className="text-xs font-semibold text-purple-400 uppercase mb-1">
              //               Schedule
              //             </p>
              //             <p className="text-gray-800 font-semibold">
              //               {match.meeting.dateTime
              //                 ? format(new Date(match.meeting.dateTime), "PPP • p")
              //                 : "TBD"}
              //             </p>
              //           </div>
              //         </div>

              //         {/* Venue */}
              //         <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
              //           <FaMapMarkerAlt className="text-blue-500 mt-1" />

              //           <div>
              //             <p className="text-xs font-semibold text-blue-400 uppercase mb-1">
              //               Venue
              //             </p>
              //             <p className="text-gray-800 font-semibold">
              //               {match.meeting.location?.address || "Online / TBD"}
              //             </p>
              //           </div>
              //         </div>

              //       </div>

              //       {/* Admin Notes */}
              //       <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
              //         <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
              //           Admin Notes
              //         </p>

              //         <p className="text-gray-600 italic leading-relaxed">
              //           {match.meeting.notes || "No specific instructions provided."}
              //         </p>
              //       </div>

              //     </div>
              //   </div>
              <Status match={match} />
            )}
          </div>

          {/* Side Panel: Actions & Summary */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-theme-light-border bg-theme-light-surface p-6 shadow-sm transition-colors duration-200 dark:border-theme-dark-border dark:bg-theme-dark-surface">
              <h4 className="mb-4 font-bold text-theme-light-heading dark:text-theme-dark-textPrimary">
                Quick Stats
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-theme-light-surfaceAlt p-3 transition-colors duration-200 dark:bg-theme-dark-inputBg">
                  <span className="text-sm text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                    Chat Access
                  </span>
                  <span
                    className={`text-xs font-bold ${match.chatEnabled ? "text-emerald-600" : "text-theme-light-textSecondary dark:text-theme-dark-textSecondary"}`}
                  >
                    {match.chatEnabled ? "● ACTIVE" : "○ DISABLED"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-theme-light-surfaceAlt p-3 transition-colors duration-200 dark:bg-theme-dark-inputBg">
                  <span className="text-sm text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                    Matched On
                  </span>
                  <span className="text-xs font-bold text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
                    {match.matchedAt
                      ? format(new Date(match.matchedAt), "dd MMM yy")
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="w-full rounded-2xl bg-theme-light-primaryButton py-4 font-bold text-white transition-colors duration-200 hover:bg-theme-light-primaryHover dark:bg-theme-dark-primaryButton dark:hover:bg-theme-dark-primaryHover"
            >
              Done Reviewing
            </button>
          </div>
        </div>
      </div>

      {/* Modern Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-[3px] transition-opacity"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-theme-light-border bg-theme-light-surface p-0 shadow-2xl transition-colors duration-200 dark:border-theme-dark-border dark:bg-theme-dark-surface">
            <div
              className={`h-1.5 w-full ${
                selectedAction === "approve" ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />

            <div className="p-6 sm:p-7">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <span
                    className={`mb-3 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
                      selectedAction === "approve"
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                        : "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                    }`}
                  >
                    {selectedAction === "approve"
                      ? "APPROVAL FLOW"
                      : "REJECTION FLOW"}
                  </span>
                  <h2 className="text-2xl font-bold text-theme-light-heading dark:text-theme-dark-textPrimary">
                    {selectedAction === "approve"
                      ? "Approve This Match?"
                      : "Reject This Match?"}
                  </h2>
                  {/* <p className="mt-1 text-sm text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                    Add an internal note for audit history. This note is visible
                    in admin records only.
                  </p> */}
                </div>

                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg border border-theme-light-border bg-theme-light-surfaceAlt px-2.5 py-1.5 text-sm font-bold text-theme-light-textSecondary transition-colors hover:bg-theme-light-surface dark:border-theme-dark-border dark:bg-theme-dark-inputBg dark:text-theme-dark-textSecondary dark:hover:bg-theme-dark-surface"
                >
                  X
                </button>
              </div>

              <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                Admin Note
              </label>
              <textarea
                value={adminNote}
                onChange={(e) => setAdminNote(e.target.value)}
                placeholder="Ex: Verified profile details and approved for safe engagement."
                className="min-h-[130px] w-full rounded-2xl border border-theme-light-inputBorder bg-theme-light-inputBg p-4 text-theme-light-textPrimary outline-none transition-colors duration-200 placeholder:text-theme-light-textSecondary focus:border-theme-light-focusBorder focus:ring-2 focus:ring-theme-light-focusBorder/20 dark:border-theme-dark-inputBorder dark:bg-theme-dark-inputBg dark:text-theme-dark-textPrimary dark:placeholder:text-theme-dark-textSecondary dark:focus:border-theme-dark-focusBorder dark:focus:ring-theme-dark-focusBorder/20"
              />

              <div className="mt-2 text-right text-xs text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
                {adminNote.trim().length} characters
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-xl border border-theme-light-border bg-theme-light-surfaceAlt py-3 font-bold text-theme-light-textSecondary transition-colors duration-200 hover:bg-theme-light-surface dark:border-theme-dark-border dark:bg-theme-dark-inputBg dark:text-theme-dark-textSecondary dark:hover:bg-theme-dark-surface"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStatusUpdate}
                  className={`flex-1 rounded-xl py-3 font-bold text-white transition-all ${
                    selectedAction === "approve"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {selectedAction === "approve"
                    ? "Confirm Approval"
                    : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchView;
