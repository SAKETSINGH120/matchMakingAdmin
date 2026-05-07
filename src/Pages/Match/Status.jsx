import React, { useState } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { FaMapMarkerAlt, FaCalendarAlt, FaInfoCircle } from "react-icons/fa";
import { updateMatchDetail } from "../../Services/MatchApi";

const Status = ({ match }) => {

    const [meetingStatus, setMeetingStatus] = useState(match?.meeting?.status);
    const [showModal, setShowModal] = useState(false);
    const [selectedAction, setSelectedAction] = useState(null);
    const [adminNote, setAdminNote] = useState("");

    const handleMeetingStatusUpdate = async () => {
        try {

            const result = await updateMatchDetail(
                match._id,
                selectedAction,
                adminNote
            );

            if (result?.success) {

                toast.success(`Meeting ${selectedAction} successfully`);

                setMeetingStatus(
                    selectedAction === "approve" ? "approved" : "rejected"
                );

                setShowModal(false);

            } else {
                toast.error(result?.message || "Failed to update meeting status");
            }

        } catch (error) {
            toast.error("Error updating meeting status");
        }
    };

    return (
        <>
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">

                <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                    <FaInfoCircle className="text-[#3f4f3c]" />
                    Meeting Logistics
                </h3>

                <div className="space-y-6">

                    {/* STATUS */}
                    <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">

                        <p className="text-sm font-medium text-gray-500 mb-2">
                            Meeting Status
                        </p>

                        <div
                            className={`text-sm font-black mb-4 ${meetingStatus === "approved"
                                    ? "text-emerald-500"
                                    : meetingStatus === "pending"
                                        ? "text-amber-500"
                                        : "text-rose-500"
                                }`}
                        >
                            {meetingStatus?.toUpperCase()}
                        </div>

                        {meetingStatus === "pending" && (
                            <div className="flex gap-2">

                                <button
                                    onClick={() => {
                                        setSelectedAction("approve");
                                        setShowModal(true);
                                    }}
                                    className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-sm font-bold hover:bg-emerald-700 transition"
                                >
                                    Approve
                                </button>

                                <button
                                    onClick={() => {
                                        setSelectedAction("reject");
                                        setShowModal(true);
                                    }}
                                    className="flex-1 py-2 bg-white text-rose-600 border border-rose-200 rounded-xl text-sm font-bold hover:bg-rose-50 transition"
                                >
                                    Reject
                                </button>

                            </div>
                        )}

                    </div>

                    {/* DATE + LOCATION */}

                    <div className="grid md:grid-cols-2 gap-4">

                        <div className="p-5 bg-purple-50 rounded-2xl border border-purple-100 flex gap-3">

                            <FaCalendarAlt className="text-purple-500 mt-1" />

                            <div>
                                <p className="text-xs font-semibold text-purple-400 uppercase mb-1">
                                    Schedule
                                </p>

                                <p className="text-gray-800 font-semibold">
                                    {match?.meeting?.dateTime
                                        ? format(new Date(match.meeting.dateTime), "PPP • p")
                                        : "TBD"}
                                </p>
                            </div>

                        </div>

                        <div className="p-5 bg-blue-50 rounded-2xl border border-blue-100 flex gap-3">

                            <FaMapMarkerAlt className="text-blue-500 mt-1" />

                            <div>
                                <p className="text-xs font-semibold text-blue-400 uppercase mb-1">
                                    Venue
                                </p>

                                <p className="text-gray-800 font-semibold">
                                    {match?.meeting?.location?.address || "Online / TBD"}
                                </p>
                            </div>

                        </div>

                    </div>

                    {/* NOTES */}

                    <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">

                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                            Admin Notes
                        </p>

                        <p className="text-gray-600 italic">
                            {match?.meeting?.notes || "No notes provided"}
                        </p>

                    </div>

                </div>
            </div>

            {/* MODAL */}

            {showModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

                    <div
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    ></div>

                    <div className="relative bg-white w-full max-w-md rounded-[2rem] shadow-2xl p-8">

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            {selectedAction === "approve"
                                ? "Confirm Meeting Approval"
                                : "Confirm Meeting Rejection"}
                        </h2>

                        <p className="text-gray-500 text-sm mb-6">
                            Add admin note for meeting decision.
                        </p>

                        <textarea
                            value={adminNote}
                            onChange={(e) => setAdminNote(e.target.value)}
                            className="w-full border-2 border-gray-100 rounded-2xl p-4 mb-6 focus:border-indigo-500 focus:outline-none"
                            placeholder="Write admin note..."
                        />

                        <div className="flex gap-3">

                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 py-3 bg-gray-100 rounded-xl font-bold"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleMeetingStatusUpdate}
                                className={`flex-1 py-3 text-white rounded-xl font-bold ${selectedAction === "approve"
                                        ? "bg-emerald-600 hover:bg-emerald-700"
                                        : "bg-rose-600 hover:bg-rose-700"
                                    }`}
                            >
                                Submit
                            </button>

                        </div>

                    </div>
                </div>
            )}
        </>
    );
};

export default Status;