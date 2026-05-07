
import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { getAgentById } from "../../Services/AgentApi";
import toast from "react-hot-toast";
import Breaker from "../../compoents/Breaker";
import { motion } from "framer-motion";

function Info({ label, value, badge = false, highlight = false }) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
            {badge ? (
                <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${value === "Active" || value === "Yes"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : value === "Inactive" || value === "No"
                            ? "bg-red-100 text-red-700 border border-red-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                >
                    {value || "N/A"}
                </span>
            ) : (
                <p className={`font-medium text-gray-900 ${highlight ? "text-[#FB721D] font-semibold" : ""}`}>
                    {value || "N/A"}
                </p>
            )}
        </div>
    );

}

const SortIcon = ({ direction }) => {
    if (!direction) return <span className="ml-1 text-gray-400">↕</span>;
    return direction === "asc" ? (
        <span className="ml-1 text-blue-600">↑</span>
    ) : (
        <span className="ml-1 text-blue-600">↓</span>
    );
};
export default function ViewAgent() {
    const { id } = useParams();

    const [agent, setAgent] = useState(null);
    const [loading, setLoading] = useState(true);

    // Table states
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    useEffect(() => {
        getAgentById(id)
            .then((res) => {
                if (res?.data) {
                    setAgent(res.data);
                } else {
                    toast.error("Agent data not found");
                }
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load agent details");
            })
            .finally(() => setLoading(false));
    }, [id]);

    const sortedBookings = useMemo(() => {
        if (!sortConfig.key || !agent?.agentBookings?.length) return agent?.agentBookings || [];

        return [...agent.agentBookings].sort((a, b) => {
            const aVal = a[sortConfig.key] ?? "";
            const bVal = b[sortConfig.key] ?? "";
            if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });
    }, [agent?.agentBookings, sortConfig]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedBookings.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);

    const requestSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    //=================================================///
    const getColorFromName = (name) => {
        if (!name) return "bg-gray-500";
        const colors = [
            "bg-blue-600", "bg-green-600", "bg-purple-600", "bg-pink-600",
            "bg-indigo-600", "bg-teal-600", "bg-amber-600", "bg-orange-500",
        ];
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    // Replace your renderAvatar with this version
    const renderAvatar = (imageUrl, name = "") => {
        // Calculate initials
        const initials = name?.trim()
            ? name
                .trim()
                .split(/\s+/)
                .map((word) => word[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()
            : "AG";

        const bgColor = getColorFromName(name);

        return (
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden border-4 border-white shadow-lg">
                {/* Always show colored background + initials */}
                <div
                    className={`absolute inset-0 flex items-center justify-center text-white text-5xl font-bold ${bgColor}`}
                >
                    {initials}
                </div>

                {/* Show real image on top only if URL exists */}
                {imageUrl && imageUrl.trim() !== "" && (
                    <img
                        src={imageUrl}
                        alt={name || "Agent"}
                        className="absolute inset-0 w-full h-full object-cover"
                        // Hide broken image without needing state
                        onError={(e) => {
                            e.target.style.opacity = "0";
                            e.target.style.pointerEvents = "none";
                        }}
                    />
                )}
            </div>
        );
    };
    //===================================//

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FB721D]"></div>
            </div>
        );
    }

    if (!agent || !agent.agentDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">
                Agent not found
            </div>
        );
    }

    const { agentDetails, agentBankDetails, agentBookings = [] } = agent;

    const BACKEND_BASE = import.meta.env.VITE_BASE_URL;
    const imageUrl = agentDetails.image
        ? `${BACKEND_BASE}/${agentDetails.image}`
        : "https://via.placeholder.com/120/cccccc/666666?text=Agent";

    return (
        <div className="min-h-screen bg-gray-50/70 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-8xl mx-auto space-y-8">
                <Breaker title="Agent Management" />

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Agent Profile</h1>
                </motion.div>

                {/* Profile Card */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
                >
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-8">
                            {/* <div className="flex-shrink-0">
                                <img
                                    src={imageUrl}
                                    alt={agentDetails.name || "Agent"}
                                    className="w-28 h-28 md:w-32 md:h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                                    onError={(e) => (e.target.src = "https://via.placeholder.com/128/cccccc/666666?text=Agent")}
                                />
                            </div> */}
                            <div className="flex-shrink-0">
                                {renderAvatar(imageUrl, agentDetails.name)}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {agentDetails.name || "Unnamed Agent"}
                                </h2>
                                <p className="text-gray-600 mt-1">{agentDetails.email || "No email"}</p>
                                <div className="mt-3 flex flex-wrap gap-3">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                                        ID: {agentDetails._id?.slice(-8)}
                                    </span>
                                    <Info label="" value={agentDetails.status} badge />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <Info label="Full Name" value={agentDetails.name} highlight />
                            <Info label="Phone" value={agentDetails.phone} />
                            <Info label="Email" value={agentDetails.email} />
                            <Info label="Aadhar" value={agentDetails.aadharNumber} />
                            <Info label="Address" value={agentDetails.address} />
                            <Info label="Wallet Balance" value={`₹${agentDetails.walletBalance ?? 0}`} highlight />
                            <Info label="Verified" value={agentDetails.isVerified ? "Yes" : "No"} badge />
                            <Info label="Agent Type" value={agentDetails.isAgent ? "Yes" : "No"} badge />
                            <Info
                                label="OTP Expiry"
                                value={
                                    agentDetails.otpExpiry
                                        ? new Date(agentDetails.otpExpiry).toLocaleString("en-IN")
                                        : "N/A"
                                }
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Bank Details */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
                >
                    <div className="p-6 md:p-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-100">
                            Bank Information
                        </h2>

                        {agentBankDetails ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <Info label="Account Holder" value={agentBankDetails.accountHolderName} />
                                <Info label="Bank Name" value={agentBankDetails.bankName} />
                                <Info label="Account Number" value={agentBankDetails.accountNumber} />
                                <Info label="IFSC Code" value={agentBankDetails.ifscCode} />
                                <Info label="UPI ID" value={agentBankDetails.upiId || "N/A"} />
                                <Info
                                    label="Primary Account"
                                    value={agentBankDetails.isPrimary ? "Yes" : "No"}
                                    badge
                                />
                            </div>
                        ) : (
                            <p className="text-gray-500 italic">No bank details registered yet.</p>
                        )}
                    </div>
                </motion.div>

                {/* Bookings Table */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden"
                >
                    <div className="p-6 md:p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                Bookings History
                                <span className="ml-3 text-sm font-normal text-gray-500">
                                    ({agentBookings.length})
                                </span>
                            </h2>
                        </div>

                        {agentBookings.length > 0 ? (
                            <>
                                <div className="overflow-x-auto rounded-lg border border-gray-200">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gradient-to-r from-[#FB721D] to-[#e0631b]">
                                            <tr>
                                                {[
                                                    { label: "Booking ID", key: "bookingId" },
                                                    { label: "Pickup", key: "pickupLoc" },
                                                    { label: "Drop Points", key: null },
                                                    { label: "Amount", key: "totalAmount" },
                                                    { label: "Status", key: "status" },
                                                    { label: "Date", key: "createdAt" },
                                                ].map((col) => (
                                                    <th
                                                        key={col.label}
                                                        onClick={() => col.key && requestSort(col.key)}
                                                        className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white ${col.key ? "cursor-pointer hover:opacity-90" : ""
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-1.5">
                                                            {col.label}
                                                            {col.key && <SortIcon direction={sortConfig.key === col.key ? sortConfig.direction : null} />}
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {currentItems.map((booking) => (
                                                <tr
                                                    key={booking._id}
                                                    className="hover:bg-orange-50/40 transition-colors duration-150"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {booking.bookingId}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {booking.pickupLoc}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                        {booking.dropPoints?.join(" → ") || "N/A"}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        ₹{Number(booking.totalAmount || 0).toLocaleString("en-IN")}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span
                                                            className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${booking.status === "DriverAssigned"
                                                                ? "bg-blue-100 text-blue-800"
                                                                : booking.status === "Pending"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : booking.status === "Completed"
                                                                        ? "bg-green-100 text-green-800"
                                                                        : "bg-gray-100 text-gray-700"
                                                                }`}
                                                        >
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                        {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        })}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                                        <button
                                            onClick={() => paginate(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === 1
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "bg-[#FB721D] text-white hover:bg-[#e0631b]"
                                                }`}
                                        >
                                            Previous
                                        </button>

                                        <div className="flex gap-2 flex-wrap justify-center">
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => paginate(page)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                                                        ? "bg-[#FB721D] text-white shadow-md"
                                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                        </div>

                                        <button
                                            onClick={() => paginate(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === totalPages
                                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                                : "bg-[#FB721D] text-white hover:bg-[#e0631b]"
                                                }`}
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 text-gray-500 italic">
                                No bookings recorded for this agent yet.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}