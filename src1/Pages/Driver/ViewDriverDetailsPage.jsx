import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import Loader from "../../compoents/Loader";
import toast from "react-hot-toast";
import { getDriver, updateDriver } from "../../Services/driverServices";
import { getAllVehicleTypes } from "../../Services/VehicleTypeApi";
import { getAllVehicles, assignVehicleToDriver } from "../../Services/vehicleServices";
import attachUrl from "../../utils/attachUrl";
import { useAuth } from "../../auth/AuthContext";

const ViewDriverDetailsPage = () => {
    const { hasPermission } = useAuth();
    const { id } = useParams();
    const navigate = useNavigate();
    const [driver, setDriver] = useState(null);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [status, setStatus] = useState("");
    const [isProfileVerified, setIsProfileVerified] = useState(false);
    const [isLicenseVerified, setIsLicenseVerified] = useState(false);

    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicleType, setSelectedVehicleType] = useState("");
    const [selectedVehicle, setSelectedVehicle] = useState("");
    const [assigningVehicle, setAssigningVehicle] = useState(false);

    const renderImage = (path, alt) => {
        if (!path) return <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-400 rounded-lg">No Image</div>;
        const src = attachUrl(path);
        return (
            <img
                src={src}
                alt={alt}
                className="w-full h-40 object-cover rounded-lg border border-gray-200"
                onError={(e) => { e.target.src = "https://via.placeholder.com/150?text=Error"; }}
            />
        );
    };

    const fetchDriver = async () => {
        try {
            setLoading(true);
            const res = await getDriver(id);
            if (res?.status) {
                const data = res.data;
                setDriver(data);
                setStatus(data.status || "inactive");
                setIsProfileVerified(data.isProfileVerified || false);
                setIsLicenseVerified(data.licenseDetails?.isLicenseVerified || false);
            } else {
                toast.error("Failed to fetch driver details");
                navigate(-1);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error fetching driver details");
            navigate(-1);
        } finally {
            setLoading(false);
        }
    };

    const fetchVehicleTypes = async () => {
        try {
            const res = await getAllVehicleTypes({ rowsPerPage: 100 });
            if (res?.data) {
                setVehicleTypes(res.data);
            }
        } catch (error) {
            console.error("Error fetching vehicle types", error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchDriver();
            fetchVehicleTypes();
        }
    }, [id]);

    useEffect(() => {
        const fetchVehiclesByType = async () => {
            if (!selectedVehicleType) {
                setVehicles([]);
                return;
            }
            try {
                const res = await getAllVehicles({ page: 1, rowsPerPage: 100, vehicleType: selectedVehicleType, status: "active", available: true });
                if (res?.data?.vehicles) {
                    setVehicles(res.data.vehicles);
                } else {
                    setVehicles([]);
                }
            } catch (error) {
                console.error("Error fetching vehicles", error);
                setVehicles([]);
            }
        };
        fetchVehiclesByType();
    }, [selectedVehicleType]);


    const handleUpdate = async () => {
        try {
            setUpdating(true);
            const payload = {
                profileStatus: status,
                isProfileVerified,
                isLicenseVerified
            };
            const res = await updateDriver(id, payload);
            if (res?.status) {
                toast.success("Driver details updated successfully!");
                fetchDriver();
            }
        } catch (error) {
            console.error(error);
            toast.error("Error updating driver details");
        } finally {
            setUpdating(false);
        }
    };

    const handleAssignVehicle = async () => {
        if (!selectedVehicle) {
            toast.error("Please select a vehicle to assign");
            return;
        }
        try {
            setAssigningVehicle(true);
            const res = await assignVehicleToDriver({ driverId: id, vehicleId: selectedVehicle });
            console.log(res);
            if (res.status) {
                toast.success("Vehicle assigned successfully!");
                fetchDriver();
                setSelectedVehicle("");
                setSelectedVehicleType("");
            }
        } catch (error) {
            toast.error("Error assigning vehicle");
            console.error(error);
        } finally {
            setAssigningVehicle(false);
        }
    };

    if (loading) return <Loader />;
    if (!driver) return <div className="p-6">Driver not found.</div>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <Breaker />
            </div>

            <div className="max-w-8xl mx-auto space-y-6">
                {hasPermission("driver", "edit") && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Management Actions</h2>
                            <button
                                onClick={() => navigate(-1)}
                                className="text-gray-500 hover:text-gray-700 border border-gray-200 px-2 py-1 rounded cursor-pointer"
                            >
                                Back
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full border rounded-lg p-2 focus:ring-[#c1ab87] focus:border-[#c1ab87]"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="blocked">Blocked</option>
                                </select>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <input
                                    type="checkbox"
                                    checked={isProfileVerified}
                                    onChange={(e) => setIsProfileVerified(e.target.checked)}
                                    className="w-5 h-5 text-[#c1ab87] rounded focus:ring-[#c1ab87] cursor-pointer"
                                    id="profileVerified"
                                />
                                <label htmlFor="profileVerified" className="text-sm font-medium text-gray-700 cursor-pointer">Profile Verified</label>
                            </div>
                            <div className="flex items-center gap-2 mb-2">
                                <input
                                    type="checkbox"
                                    checked={isLicenseVerified}
                                    onChange={(e) => setIsLicenseVerified(e.target.checked)}
                                    className="w-5 h-5 text-[#c1ab87] rounded focus:ring-[#c1ab87] cursor-pointer"
                                    id="licenseVerified"
                                />
                                <label htmlFor="licenseVerified" className="text-sm font-medium text-gray-700 cursor-pointer">License Verified</label>
                            </div>
                            <div>
                                <button
                                    onClick={handleUpdate}
                                    disabled={updating}
                                    className="w-full bg-[#FB721D] text-white py-2 px-4 rounded-lg hover:bg-[#e0631b] transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {updating ? "Updating..." : "Update Changes"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {hasPermission("driver", "assignVehicle") && !driver.hasOwnVehicle && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-4">
                            <h2 className="text-xl font-bold text-gray-800">Assign Vehicles</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                                <select
                                    value={selectedVehicleType}
                                    onChange={(e) => setSelectedVehicleType(e.target.value)}
                                    className="w-full border rounded-lg p-2 focus:ring-[#c1ab87] focus:border-[#c1ab87]"
                                >
                                    <option value="">Select Vehicle Type</option>
                                    {vehicleTypes.map((vt) => (
                                        <option key={vt._id} value={vt.name}>{vt.name} - seats {vt.seatingCapacity}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle</label>
                                <select
                                    value={selectedVehicle}
                                    onChange={(e) => setSelectedVehicle(e.target.value)}
                                    className="w-full border rounded-lg p-2 focus:ring-[#c1ab87] focus:border-[#c1ab87]"
                                    disabled={!selectedVehicleType}
                                >
                                    <option value="">Select Vehicle</option>
                                    {vehicles.map((v) => (
                                        <option key={v._id} value={v._id}>
                                            {v.name} - {v.vehicleNumber}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <button
                                    onClick={handleAssignVehicle}
                                    disabled={assigningVehicle || !selectedVehicle}
                                    className="w-full bg-[#FB721D] text-white py-2 px-4 rounded-lg hover:bg-[#e0631b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    {assigningVehicle ? "Assigning..." : "Assign Vehicle"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Driver Basic Info */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Driver Information</h2>
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="w-full md:w-1/4">
                            {renderImage(driver.profilePic, "Profile")}
                        </div>
                        <div className="w-full md:w-3/4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Name</label>
                                <p className="font-medium text-gray-900">{driver.name || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Phone</label>
                                <p className="font-medium text-gray-900">{driver.phone || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Email</label>
                                <p className="font-medium text-gray-900">{driver.email || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Current Status</label>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${driver.status === 'active' ? 'bg-green-100 text-green-800' :
                                    driver.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                    {driver.status?.toUpperCase()}
                                </span>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs text-gray-500 uppercase">Address</label>
                                <p className="font-medium text-gray-900">{driver.address || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Has Own Vehicle</label>
                                <p className="font-medium text-gray-900">{driver.hasOwnVehicle ? "Yes" : "No"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Has Vehicle Assigned</label>
                                <p className="font-medium text-gray-900">{driver.hasVehicleAssigned ? "Yes" : "No"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Busy</label>
                                <p className="font-medium text-gray-900">{driver.isBusy ? "Yes" : "No"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Profile Verified</label>
                                <p className={`font-medium ${driver.isProfileVerified ? "text-green-600" : "text-amber-600"}`}>
                                    {driver.isProfileVerified ? "Yes" : "No"}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KYC Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">KYC Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase">KYC Type</label>
                            <p className="font-medium text-gray-900">{driver.kycDetails?.kycType || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase">Aadhar Number</label>
                            <p className="font-medium text-gray-900">{driver.kycDetails?.aadharNumber || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase">Verified</label>
                            <p className={`font-medium ${driver.kycDetails?.isVerified ? "text-green-600" : "text-amber-600"}`}>
                                {driver.kycDetails?.isVerified ? "Yes" : "No"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* License Details */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">License Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="text-xs text-gray-500 uppercase">License Number</label>
                            <p className="font-medium text-gray-900">{driver.licenseDetails?.drivingLicenseNumber || "N/A"}</p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase">Expiry Date</label>
                            <p className="font-medium text-gray-900">
                                {driver.licenseDetails?.licenseExpiryDate ? new Date(driver.licenseDetails.licenseExpiryDate).toLocaleDateString() : "N/A"}
                            </p>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 uppercase">Verified</label>
                            <p className={`font-medium ${driver.licenseDetails?.isLicenseVerified ? "text-green-600" : "text-amber-600"}`}>
                                {driver.licenseDetails?.isLicenseVerified ? "Yes" : "No"}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium mb-2">Front Image</p>
                            {renderImage(driver.licenseDetails?.frontLicenseImage, "License Front")}
                        </div>
                        <div>
                            <p className="text-sm font-medium mb-2">Back Image</p>
                            {renderImage(driver.licenseDetails?.backLicenseImage, "License Back")}
                        </div>
                    </div>
                </div>

                {/* Vehicle Details */}
                {driver.vehicleDetails && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Vehicle Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Vehicle Name</label>
                                <p className="font-medium text-gray-900">{driver.vehicleDetails.name || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Vehicle Number</label>
                                <p className="font-medium text-gray-900">{driver.vehicleDetails.vehicleNumber || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Type</label>
                                <p className="font-medium text-gray-900">{driver.vehicleDetails.vehicleType || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Seating Capacity</label>
                                <p className="font-medium text-gray-900">{driver.vehicleDetails.seatingCapacity || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Color</label>
                                <p className="font-medium text-gray-900">{driver.vehicleDetails.color || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Status</label>
                                <p className="font-medium text-gray-900">{driver.vehicleDetails.status || "N/A"}</p>
                            </div>
                            <div className="md:col-span-3">
                                <label className="text-xs text-gray-500 uppercase">Description</label>
                                <p className="font-medium text-gray-900">{driver.vehicleDetails.description || "N/A"}</p>
                            </div>
                        </div>

                        <h3 className="text-md font-semibold text-gray-700 mb-3">Vehicle Documents & Images</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <div>
                                <p className="text-xs font-medium mb-1">Vehicle Front</p>
                                {renderImage(driver.vehicleDetails.vehicleDocuments?.frontVehicleImage, "Vehicle Front")}
                            </div>
                            <div>
                                <p className="text-xs font-medium mb-1">Vehicle Back</p>
                                {renderImage(driver.vehicleDetails.vehicleDocuments?.backVehicleImage, "Vehicle Back")}
                            </div>
                            <div>
                                <p className="text-xs font-medium mb-1">RC Front</p>
                                {renderImage(driver.vehicleDetails.vehicleDocuments?.frontRc, "RC Front")}
                            </div>
                            <div>
                                <p className="text-xs font-medium mb-1">RC Back</p>
                                {renderImage(driver.vehicleDetails.vehicleDocuments?.backRc, "RC Back")}
                            </div>
                            <div>
                                <p className="text-xs font-medium mb-1">Pollution Cert</p>
                                {renderImage(driver.vehicleDetails.vehicleDocuments?.pollutionCertificateImage, "Pollution Cert")}
                            </div>
                        </div>
                    </div>
                )}

                {driver.assignedVehicle && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Assigned Vehicle</h2>
                        <div className="flex flex-col md:flex-row gap-6">
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Vehicle Number</label>
                                <p className="font-medium text-gray-900">{driver.assignedVehicle.vehicleNumber || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Vehicle Type</label>
                                <p className="font-medium text-gray-900">{driver.assignedVehicle.vehicleType || "N/A"}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase">Seating Capacity</label>
                                <p className="font-medium text-gray-900">{driver.assignedVehicle.seatingCapacity || "N/A"}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ViewDriverDetailsPage;
