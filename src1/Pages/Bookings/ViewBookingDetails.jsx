import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBookingById, assignDriversToBooking } from "../../services/bookingServices";
import { getAllVehicleTypes } from "../../Services/VehicleTypeApi";
import { getAllAvailableDrivers } from "../../Services/driverServices";
import toast from "react-hot-toast";
import Breaker from "../../compoents/Breaker";
import { convertUTCToLocalDateString } from "../../utils/convertUTCtoLocalDate";
import { FaArrowLeft, FaPlus, FaTrash } from "react-icons/fa";
import attachUrl from "../../utils/attachUrl";
import { useAuth } from "../../auth/AuthContext";

const ViewBookingDetails = () => {
    const { hasPermission } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [assignmentRows, setAssignmentRows] = useState([
        { id: Date.now(), vehicleType: "", selectedDrivers: [], availableDrivers: [] }
    ]);
    const [assigning, setAssigning] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingRes, vehicleTypesRes] = await Promise.all([
                    getBookingById(id),
                    getAllVehicleTypes({ rowsPerPage: 100 })
                ]);

                if (bookingRes.status) {
                    setBooking(bookingRes.data);
                }

                if (vehicleTypesRes.status || vehicleTypesRes.data) {
                    const types = vehicleTypesRes.data?.vehicleTypes || vehicleTypesRes.data || [];
                    setVehicleTypes(types);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load booking details");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleVehicleTypeChange = async (rowId, vehicleType) => {
        const updatedRows = assignmentRows.map(row =>
            row.id === rowId ? { ...row, vehicleType: vehicleType, selectedDrivers: [], availableDrivers: [] } : row
        );
        setAssignmentRows(updatedRows);

        if (!vehicleType) return;

        try {
            const res = await getAllAvailableDrivers({ page: 1, limit: 100, vehicleType: vehicleType });
            const drivers = res.data?.drivers || [];

            setAssignmentRows(prev => prev.map(row =>
                row.id === rowId ? { ...row, availableDrivers: drivers } : row
            ));
        } catch (error) {
            console.error("Error fetching drivers:", error);
            toast.error("Failed to fetch drivers");
        }
    };

    const handleDriverSelection = (rowId, driverId) => {
        setAssignmentRows(prev => prev.map(row => {
            if (row.id !== rowId) return row;

            const isSelected = row.selectedDrivers.includes(driverId);
            return {
                ...row,
                selectedDrivers: isSelected
                    ? row.selectedDrivers.filter(d => d !== driverId)
                    : [...row.selectedDrivers, driverId]
            };
        }));
    };

    const addRow = () => {
        setAssignmentRows([
            ...assignmentRows,
            { id: Date.now(), vehicleType: "", selectedDrivers: [], availableDrivers: [] }
        ]);
    };

    const removeRow = (rowId) => {
        if (assignmentRows.length === 1) {
            toast.error("At least one row is required");
            return;
        }
        setAssignmentRows(assignmentRows.filter(row => row.id !== rowId));
    };

    const handleSubmitAssignment = async () => {
        const isValid = assignmentRows.every(row => row.vehicleType && row.selectedDrivers.length > 0);
        if (!isValid) {
            toast.error("Please select a vehicle type and at least one driver for all rows.");
            return;
        }

        const drivers = [];
        assignmentRows.forEach(row => {
            drivers.push(...row.selectedDrivers);
        });

        const payload = {
            bookingId: id,
            drivers: drivers
        };

        try {
            setAssigning(true);
            await assignDriversToBooking(payload);
            const res = await getBookingById(id);
            if (res.status) {
                toast.success("Vehicle assigned successfully!");
                setBooking(res.data);
                setAssignmentRows([{ id: Date.now(), vehicleType: "", selectedDrivers: [], availableDrivers: [] }]);
            }
        } catch (error) {
            console.error("Error assigning drivers:", error);
        } finally {
            setAssigning(false);
        }
    };

    if (loading) return <div className="p-6 text-center">Loading...</div>;
    if (!booking) return <div className="p-6 text-center">Booking not found</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors cursor-pointer"
                >
                    <FaArrowLeft /> Back to Bookings
                </button>
                <Breaker />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Booking Information</h2>

                        <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Booking ID</label>
                                <p className="text-gray-900 font-medium font-mono mt-1">{booking.bookingId}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">City</label>
                                <p className="text-gray-900 font-medium font-mono mt-1">{booking.cityId?.name || "N/A"}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Date & Time</label>
                                <p className="text-gray-900 mt-1">
                                    {convertUTCToLocalDateString(booking.date)} at {booking.time}
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500">Pickup Location</label>
                                <p className="text-gray-900 mt-1">{booking.pickupLoc}</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-500">Status</label>
                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-semibold 
                                    ${booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        booking.status === 'Completed' ? 'bg-green-100 text-green-800' :
                                            'bg-gray-100 text-gray-800'}`}>
                                    {booking.status}
                                </span>
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-500">Drop Points</label>
                                <div className="flex flex-wrap gap-2 mt-1">
                                    {booking.dropPoints?.map((point, index) => (
                                        <span key={index} className="bg-[#FB721D]/10 text-[#FB721D] px-2 py-1 rounded text-sm border border-[#FB721D]">
                                            {point}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Customer Details</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {booking.user ? (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Name</label>
                                        <p className="text-gray-900 font-medium mt-1">{booking.user.name}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500">Phone</label>
                                        <p className="text-gray-900 mt-1">{booking.user.phone}</p>
                                    </div>
                                </>
                            ) : (
                                <div className="col-span-2 text-gray-500 italic">Guest User</div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Customer Mobile</label>
                                <p className="text-gray-900 mt-1">{booking.customerMobile || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Members</label>
                                <p className="text-gray-900 mt-1">{booking.members}</p>
                            </div>
                        </div>
                    </div>

                    {(booking.assignDrivers?.length > 0 || booking.assignVehicles?.length > 0) && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Current Assignments</h2>

                            {booking.assignDrivers?.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Assigned Drivers</h3>
                                    <div className="space-y-2">
                                        {booking.assignDrivers.map((assign, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                                                <div className="flex gap-x-4 items-center">
                                                    <div>
                                                        <img src={attachUrl(assign.driverImage)} alt={`${assign.driverName}-image`} className="w-14 h-14 rounded-full" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{assign.driverName || 'Unknown Driver'}</p>
                                                        <p className="text-xs text-gray-500">{assign.driverPhone}</p>
                                                    </div>
                                                </div>

                                                <span className="text-xs font-mono bg-white px-2 py-1 rounded border">
                                                    {assign.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {booking.assignVehicles?.length > 0 && (<div className="mb-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Assigned Vehicles</h3>
                                <div className="space-y-2">
                                    {booking.assignVehicles.map((assign, idx) => (
                                        <div key={assign.vehicle} className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                                            <div className="flex justify-between w-full items-center">
                                                <div><p className="font-medium text-gray-900">{assign.vehicleNumber || 'Unknown Vehicle'}</p></div>
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-xs text-gray-800 font-medium">{assign.vehicleType}</p>
                                                    <p className="text-xs text-gray-800 font-medium">Seating Capacity: {assign.seatingCapacity}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>)}
                        </div>
                    )}
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">Payment Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Fare</span>
                                <span className="font-medium">₹{booking.fare}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">GST</span>
                                <span className="font-medium">₹{booking.gstAmount}</span>
                            </div>
                            <div className="flex justify-between text-lg font-bold border-t pt-3 mt-2">
                                <span className="text-gray-900">Total</span>
                                <span className="text-[#FB721D]">₹{booking.totalAmount}</span>
                            </div>
                            <div className="pt-2">
                                <div className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                    <span className="text-sm font-medium text-gray-600">Mode</span>
                                    <span className="text-sm font-bold text-gray-900">{booking.paymentMode}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                     
                    {hasPermission("booking", "assignDriver") && (
                    (booking.status === "Pending" && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                                Assign Drivers
                            </h2>

                            <div className="space-y-6">
                                {assignmentRows.map((row, index) => (
                                    <div key={row.id} className="p-4 rounded-lg border border-gray-200 bg-gray-50 relative group">
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => removeRow(row.id)}
                                                className="text-red-500 hover:text-red-700 p-1"
                                                title="Remove Row"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>

                                        <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                                            Assignment Group {index + 1}
                                        </h3>

                                        <div className="space-y-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-500 mb-1">Vehicle Type</label>
                                                <select
                                                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                                    value={row.vehicleType}
                                                    onChange={(e) => handleVehicleTypeChange(row.id, e.target.value)}
                                                >
                                                    <option value="">Select Vehicle Type</option>
                                                    {vehicleTypes.map(vt => (
                                                        <option key={vt._id} value={vt.name}>{vt.name} - seats {vt.seatingCapacity}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {row.vehicleType && (
                                                <div>
                                                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                                                        Select Drivers {row.availableDrivers.length > 0 ? `(${row.availableDrivers.length})` : ''}
                                                    </label>
                                                    {row.availableDrivers.length > 0 ? (
                                                        <div className="max-h-40 overflow-y-auto border border-gray-300 rounded bg-white p-2 space-y-1">
                                                            {row.availableDrivers.map(driver => (
                                                                <label key={driver._id} className="flex items-center gap-2 text-sm p-1 hover:bg-gray-50 cursor-pointer rounded">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={row.selectedDrivers.includes(driver._id)}
                                                                        onChange={() => handleDriverSelection(row.id, driver._id)}
                                                                        className="rounded text-[#FB721D] focus:ring-[#FB721D]"
                                                                    />
                                                                    <span className="flex-1 truncate">
                                                                        {driver.name} <span className="text-gray-400 text-xs text-nowrap">({driver.phone})</span>
                                                                    </span>
                                                                </label>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-red-500">No drivers found for this type.</p>
                                                    )}
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {row.selectedDrivers.length} selected
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={addRow}
                                    className="w-full py-2 border-2 border-dashed border-gray-300 rounded text-gray-500 font-medium hover:border-[#FB721D] hover:text-[#FB721D] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <FaPlus size={12} /> Add Another Vehicle Type
                                </button>

                                <button
                                    onClick={handleSubmitAssignment}
                                    disabled={assigning}
                                    className={`w-full py-2.5 px-4 rounded-lg text-white font-semibold shadow-md transition-all
                                    ${assigning
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-[#FB721D] hover:bg-[#FB721D] hover:shadow-lg cursor-pointer'
                                        }`}
                                >
                                    {assigning ? 'Assigning...' : 'Confirm Assignment'}
                                </button>
                            </div>
                        </div>))
                    )}
                    
                </div>
            </div>
        </div>
    );
};

export default ViewBookingDetails;
