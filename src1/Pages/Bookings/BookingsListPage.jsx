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
import { getAllBookings } from "../../services/bookingServices";
import getValFromSearchParams from "../../utils/getValFromSearchParams";
import ExportButton from "../../compoents/ExportButton";
import GenericTable from "../../compoents/Table";
import { ClearBtn } from "../../compoents/Button";
import "/src/index.css"

const BookingsListPage = () => {
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

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            const {
                page: currentPage,
                rowsPerPage: limit,
                searchQueryFromUrl: searchQuery,
            } = getValFromSearchParams({ searchParams });
            const result = await getAllBookings({
                page: currentPage,
                rowsPerPage: limit,
                searchQuery,
            });
            if (result?.status) {
                toast.success("Bookings fetched successfully!");
                const bookings = result.data?.bookings ?? [];
                const transformedData = bookings.map((item) => ({
                    ...item,
                    id: item._id,
                }));
                setData(transformedData);
                setTotalPages(result.data?.totalPages || 0);
                setTotalRecord(result.data?.total || 0);
                if (searchQuery.trim() && !isFilterApply) setIsFilterApply(true);
                else if (!searchQuery.trim() && isFilterApply) setIsFilterApply(false);
            } else {
                toast.error(result?.message || "Failed to fetch Bookings");
            }
        } catch (error) {
            console.error("Error fetching Bookings", error);
            toast.error("Error fetching Bookings");
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
        { label: "Booking ID", value: (row) => row?.bookingId || "" },
        { label: "City", value: (row) => row?.cityId.name || "" },
        { label: "User Name", value: (row) => row?.user?.name || "N/A" },
        { label: "Phone", value: (row) => row?.user?.phone || row?.customerMobile || "" },
        { label: "Pickup Location", value: (row) => row?.pickupLoc || "" },
        { label: "Drop Points", value: (row) => row?.dropPoints?.join(", ") || "" },
        { label: "Members", value: (row) => row?.members || 0 },
        { label: "Date", value: (row) => convertUTCToLocalDateString(row?.date) || "" },
        { label: "Time", value: (row) => row?.time || "" },
        { label: "Payment Mode", value: (row) => row?.paymentMode || "" },
        { label: "Status", value: (row) => row?.status || "" },
        { label: "Total Amount", value: (row) => row?.totalAmount || 0 },
        { label: "Is Agent Booking", value: (row) => row?.isAgentBooking ? "Yes" : "No" },
    ];

    const tableColumns = [
        {
            label: "Booking ID",
            key: "bookingId",
            render: (val, row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{row?.bookingId || "N/A"}</span>
                </div>
            )
        },
        {
            label: "City",
            key: "cityId",
            render: (val, row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{row?.cityId?.name || "N/A"}</span>
                </div>
            )
        },
        {
            label: "User info",
            key: "userInfo",
            render: (val, row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{row?.user?.name || "N/A"}</span>
                    <span className="text-sm text-gray-500">{row?.user?.phone || row?.customerMobile}</span>
                </div>
            )
        },
        { label: "Pickup", key: "pickupLoc" },
        {
            label: "Drop Points",
            key: "dropPoints",
            render: (val) => (
                <span title={val?.join(", ")}>
                    {val?.length > 1 ? `${val[0]} +${val.length - 1} more` : val?.[0]}
                </span>
            )
        },
        {
            label: "Date & Time",
            key: "dateTime",
            render: (val, row) => (
                <div className="flex flex-col">
                    <span>{convertUTCToLocalDateString(row?.date)}</span>
                    <span className="text-sm text-gray-500">{row?.time}</span>
                </div>
            )
        },
        { label: "Members", key: "members" },
        { label: "Amount", key: "totalAmount" },
        {
            label: "Status",
            key: "status",
            render: (val) => (
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${val === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    val === 'Completed' ? 'bg-green-100 text-green-800' :
                        val === 'Cancelled' || val === 'CancelledByUser' || val === 'CancelledByDriver' || val === 'CancelledByAdmin' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                    }`}>
                    {val}
                </span>
            )
        },
    ];

    const handleOnView = (rowId) => {
        navigate(`view/${rowId}`);
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
                        placeholder="Search by user or status..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-60 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                        aria-label="Search bookings"
                        onKeyDown={handleOnKeyDown}
                    />
                    {isFilterApply && <ClearBtn handleClear={handleClearFilter} />}
                </div>
                {hasPermission("booking", "exportExcel") && (
                    <div className="flex gap-4">
                        <ExportButton ariaLabel="Export bookings" excelName="Bookings" dataToExport={data} columns={excelColumns} />
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
                hasView={hasPermission("booking", "view")}
                columns={tableColumns}
                isLoading={loading}
                ariaLabel="Bookings"
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
        </div>
    );
};

export default BookingsListPage;
