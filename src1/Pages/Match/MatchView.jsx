import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  getMatchById,
  updateMatchStatus,
  updateMatchDetail,
} from "../../Services/MatchApi";
import Breaker from "../../compoents/Breaker";
import { format } from "date-fns";

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

  const handleMeetingStatusUpdate = async (status) => {
    try {
      const result = await updateMatchDetail(match._id, status);
      if (result?.success) {
        toast.success(`Meeting ${status} successfully`);
        setMatch((prev) => ({
          ...prev,
          meeting: { ...prev.meeting, status: status },
        }));
      } else {
        toast.error(result?.message || "Failed to update meeting status");
      }
    } catch (error) {
      toast.error("Error updating meeting status");
    }
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
    } catch (error) {
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
      } catch (err) {
        toast.error("Error fetching match details");
      } finally {
        setLoading(false);
      }
    };
    fetchMatch();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium animate-pulse">
            Loading Premium View...
          </p>
        </div>
      </div>
    );
  }

  const user1 = match?.users?.[0] || {};
  const user2 = match?.users?.[1] || {};

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <Breaker />

      {/* Header Section */}
      <div className="bg-white border-b border-gray-200  mt-6 top-0 z-30 px-6 py-4 mb-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-indigo-600 font-medium transition-colors"
          >
            <span className="text-lg">←</span> Back to Matches
          </button>
          {match?.chatEnabled && (
            <button
              onClick={() => navigate(`/Home/match/chat/${match._id}`)}
              className="px-4 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              View Chat
            </button>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6">
        {/* Profile Comparison Section */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Central Match Icon (Desktop Only) */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-xl border border-gray-100 items-center justify-center">
            <span className="text-pink-500 text-2xl font-bold">♥</span>
          </div>

          {[user1, user2].map((user, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <img
                    src={
                      user.profilePhoto?.[0] ||
                      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS0rz7SHvHoyn3LwaQ6Zc8LkQEmi-ClP8mvZg&s"
                    }
                    alt={user.name}
                    className="w-32 h-32 rounded-3xl object-cover ring-4 ring-gray-50 shadow-inner"
                  />
                  {user.isPremium && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-tr from-amber-400 to-yellow-200 text-[10px] font-black px-2 py-1 rounded-lg shadow-sm border border-white">
                      PREMIUM
                    </span>
                  )}
                </div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {capitalizeWords(user.name)}
                </h2>
                <p className="text-indigo-600 font-semibold mb-6">
                  {user.number || "Not provided"}
                </p>

                <div className="w-full grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-2xl p-4 text-left">
                    <p className="text-[11px] uppercase tracking-wide text-gray-400 font-bold mb-1">
                      Gender
                    </p>
                    <p className="text-gray-700 font-medium capitalize">
                      {user.gender || "—"}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-4 text-left">
                    <p className="text-[11px] uppercase tracking-wide text-gray-400 font-bold mb-1">
                      Status
                    </p>
                    <span
                      className={`text-sm font-bold ${user.status === "active" ? "text-emerald-600" : "text-rose-600"}`}
                    >
                      {user.status?.toUpperCase() || "—"}
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
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-800">
                  Match Overview
                </h3>
                <span className="px-4 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full border border-indigo-100 uppercase">
                  {match.matchType || "System"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
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
                </div>

                <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100">
                  <p className="text-sm font-medium text-gray-500 mb-2">
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
                        className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          setSelectedAction("reject") || setShowModal(true)
                        }
                        className="flex-1 py-2 bg-white text-rose-600 border border-rose-200 rounded-xl text-sm font-bold hover:bg-rose-50 transition-all"
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
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-800 mb-6">
                  Meeting Logistics
                </h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px] p-4 bg-purple-50 rounded-2xl border border-purple-100">
                      <p className="text-[10px] font-bold text-purple-400 uppercase mb-1">
                        Schedule
                      </p>
                      <p className="text-gray-800 font-bold">
                        {match.meeting.dateTime
                          ? format(new Date(match.meeting.dateTime), "PPP • p")
                          : "TBD"}
                      </p>
                    </div>
                    <div className="flex-1 min-w-[200px] p-4 bg-blue-50 rounded-2xl border border-blue-100">
                      <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">
                        Venue
                      </p>
                      <p className="text-gray-800 font-bold">
                        {match.meeting.location?.address || "Online/TBD"}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-gray-50 rounded-2xl">
                    <p className="text-xs font-bold text-gray-400 uppercase mb-2">
                      Admin Notes
                    </p>
                    <p className="text-gray-600 italic">
                      "
                      {match.meeting.notes ||
                        "No specific instructions provided."}
                      "
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Side Panel: Actions & Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-bold text-gray-800 mb-4">Quick Stats</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-500">Chat Access</span>
                  <span
                    className={`text-xs font-bold ${match.chatEnabled ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    {match.chatEnabled ? "● ACTIVE" : "○ DISABLED"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
                  <span className="text-sm text-gray-500">Matched On</span>
                  <span className="text-xs font-bold text-gray-700">
                    {match.matchedAt
                      ? format(new Date(match.matchedAt), "dd MMM yy")
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate(-1)}
              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-black transition-all"
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
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden p-8 animate-in fade-in zoom-in duration-300">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {selectedAction === "approve"
                ? "Confirm Approval"
                : "Confirm Rejection"}
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Add an internal note for the audit log regarding this decision.
            </p>

            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Ex: Profile verification completed..."
              className="w-full border-2 border-gray-100 rounded-2xl p-4 mb-6 focus:border-indigo-500 focus:outline-none transition-colors min-h-[120px]"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                className={`flex-1 py-3 text-white rounded-xl font-bold transition-all ${
                  selectedAction === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-100"
                    : "bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-100"
                }`}
              >
                Submit Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchView;
