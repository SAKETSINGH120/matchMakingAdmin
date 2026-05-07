import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/AuthContext";
import { convertUTCToLocalDateString } from "../../utils/convertUTCtoLocalDate";
import PaginationManager from "../../compoents/PaginationManager";
import { getAllDrivers } from "../../Services/driverServices";
import getValFromSearchParams from "../../utils/getValFromSearchParams";
import ExportButton from "../../compoents/ExportButton";
import GenericTable from "../../compoents/Table";
import { ClearBtn } from "../../compoents/Button";
import "/src/index.css";

const DriverListPage = () => {
    const { hasPermission } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();
    const { searchQueryFromUrl, page, rowsPerPage } = getValFromSearchParams({
        searchParams,
    });
    const { auth, loading: authLoading } = useAuth();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [totalRecord, setTotalRecord] = useState(0);
    const [search, setSearch] = useState(searchQueryFromUrl);
    const navigate = useNavigate();
    const [isFilterApply, setIsFilterApply] = useState(false);

    // Incentive modal state
    const [showIncentiveModal, setShowIncentiveModal] = useState(false);
    const [selectedDriverId, setSelectedDriverId] = useState(null);
    const [incentiveAmount, setIncentiveAmount] = useState("");

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const {
                page: currentPage,
                rowsPerPage: limit,
                searchQueryFromUrl: searchQuery,
            } = getValFromSearchParams({ searchParams });
            const result = await getAllDrivers({
                page: currentPage,
                rowsPerPage: limit,
                searchQuery,
            });
            if (result?.status) {
                toast.success("Drivers fetched successfully!");
                const drivers = result.data?.drivers ?? [];
                const transformedData = drivers.map((item) => ({
                    ...item,
                    id: item._id,
                    cityId: item?.cityId?.name,
                }));
                setData(transformedData);
                setTotalPages(result.data?.totalPages || 0);
                setTotalRecord(result.data?.total || 0);
                if (searchQuery.trim() && !isFilterApply) setIsFilterApply(true);
                else if (!searchQuery.trim() && isFilterApply) setIsFilterApply(false);
            } else {
                toast.error(result?.message || "Failed to fetch Drivers");
            }
        } catch (error) {
            console.error("Error fetching Drivers", error);
            toast.error("Error fetching Drivers");
        } finally {
            setLoading(false);
        }
    }, [searchParams]);

    useEffect(() => {
        if (!authLoading.profile && auth.user) {
            fetchData();
        }
    }, [fetchData, authLoading.profile, auth.user]);

    useEffect(() => {
        AOS.init({
            duration: 1000,
            once: true,
        });
    }, []);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (search.trim() !== searchQueryFromUrl) {
                const sp = new URLSearchParams(searchParams);
                if (search) {
                    sp.set("search", search);
                } else {
                    sp.delete("search");
                }
                sp.set("page", "1");
                setSearchParams(sp, { replace: true });
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [search, searchParams, setSearchParams]);

    const handleOnKeyDown = (e) => {
        if (e.key === "Enter") {
            const sp = new URLSearchParams(searchParams);
            if (search) sp.set("search", search);
            else sp.delete("search");
            sp.set("page", "1");
            setSearchParams(sp, { replace: true });
        }
    };

    const handleClearFilter = () => {
        setSearch("");
        setIsFilterApply(false);
    };

    const excelColumns = [
        { label: "ID", value: (row) => row?._id || "" },
        { label: "Name", value: (row) => row?.name || "" },
        { label: "City", value: (row) => row?.cityId || "" },
        { label: "Email", value: (row) => row?.email || "" },
        { label: "Phone", value: (row) => row?.phone || "" },
        { label: "Aadhar Number", value: (row) => row?.kycDetails?.aadharNumber || "" },
        { label: "License Number", value: (row) => row?.licenseDetails?.drivingLicenseNumber || "" },
        { label: "Status", value: (row) => row?.status || "" },
        { label: "Has Own Vehicle", value: (row) => row?.hasOwnVehicle ? "Yes" : "No" },
        { label: "Profile Verified", value: (row) => row?.isProfileVerified ? "Yes" : "No" },
        { label: "Created Date", value: (row) => convertUTCToLocalDateString(row?.createdAt) ?? "" },
    ];

    const tableColumns = [
        {
            label: "Name",
            key: "name",
            render: (val, row) => (
                <div className="flex items-center gap-1.5">
                    {row.isProfileVerified && (
                        <span
                            className="inline-flex h-4 w-4 items-center justify-center rounded-full 
                                       bg-green-600 text-white text-[10px] font-bold 
                                       shrink-0 ring-1 ring-green-700/50"
                            title="Profile Verified"
                        >
                            ✓
                        </span>
                    )}
                    <span className="font-medium">{val || "—"}</span>
                </div>
            )
        },
        { label: "City", key: "cityId" },
        { label: "Email", key: "email" },
        { label: "Phone", key: "phone" },
        {
            label: "Own Vehicle",
            key: "hasOwnVehicle",
            render: (val) => val ? "Yes" : "No"
        },
        {
            label: "Verified",
            key: "isProfileVerified",
            render: (val) => val ? "Yes" : "No"
        },
        {
      label: "Status",
      key: "status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${value === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
        >
          {value ? value.charAt(0).toUpperCase() + value.slice(1) : "inactive"}
        </span>
      ),
    },
        
        { label: "Rating", key: "rating" },

    ];

    const handleOnView = (rowId) => {
        navigate(`view/${rowId}`);
    };

    // Incentive handlers
    const handleOpenIncentive = (row) => {
        setSelectedDriverId(row._id);
        setIncentiveAmount("");
        setShowIncentiveModal(true);
    };

    const handleCloseIncentive = () => {
        setShowIncentiveModal(false);
        setSelectedDriverId(null);
        setIncentiveAmount("");
    };

    const handleSubmitIncentive = () => {
        const amount = Number(incentiveAmount);
        if (!amount || amount <= 0 || isNaN(amount)) {
            toast.error("Please enter a valid amount greater than 0");
            return;
        }

        toast.success(`₹${amount} incentive added successfully!`);

        handleCloseIncentive();
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen scroll-y-always">
            <div className="mb-6">
                <Breaker />
            </div>

            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search by Driver name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-60 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                        aria-label="Search driver by name"
                        onKeyDown={handleOnKeyDown}
                    />
                    {isFilterApply && <ClearBtn handleClear={handleClearFilter} />}
                </div>

                {hasPermission("driver", "exportExcel") && (
                    <div className="flex gap-4">
                        <ExportButton
                            ariaLabel="Export drivers to Excel"
                            excelName="Driver"
                            dataToExport={data}
                            columns={excelColumns}
                        />
                    </div>
                )}
            </div>

            <GenericTable
                limit={rowsPerPage}
                page={page}
                data={data}
                hasAction={true}
                hasEdit={false}
                hasDelete={false}
                hasView={hasPermission("driver", "view")}
                hasIncentive={true}
                onIncentive={handleOpenIncentive}
                columns={tableColumns}
                isLoading={loading}
                ariaLabel="Driver"
                onView={(row) => handleOnView(row._id)}
            />

            <PaginationManager
                page={page}
                totalPages={totalPages}
                totalRecord={totalRecord}
                rowsPerPage={rowsPerPage}
                setSearchParams={setSearchParams}
                searchParams={searchParams}
            />

            {/* Incentive popup - positioned at the top */}
            {showIncentiveModal && (
                <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6 px-4">
                    <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md border border-gray-200">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold">Add Incentive</h3>
                            <button
                                onClick={handleCloseIncentive}
                                className="text-gray-500 hover:text-gray-700 text-xl"
                            >
                                ×
                            </button>
                        </div>

                        <div className="mb-5">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Amount (₹)
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={incentiveAmount}
                                onChange={(e) => setIncentiveAmount(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter amount"
                                autoFocus
                            />
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={handleCloseIncentive}
                                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitIncentive}
                                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriverListPage;