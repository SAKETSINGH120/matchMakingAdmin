import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import { Modal } from "antd";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/AuthContext";
import { convertUTCToLocalDateString } from "../../utils/convertUTCtoLocalDate";
import PaginationManager from "../../compoents/PaginationManager";
import { deleteVehicle, getAllVehicles } from "../../Services/vehicleServices";
import getValFromSearchParams from "../../utils/getValFromSearchParams";
import ExportButton from "../../compoents/ExportButton";
import AddButton from "../../compoents/AddButton";
import GenericTable from "../../compoents/Table";
import { ClearBtn } from "../../compoents/Button";

const VehicleListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { searchQueryFromUrl, page, rowsPerPage } = getValFromSearchParams({
        searchParams,
    });
    const { auth, loading: authLoading, hasPermission } = useAuth();
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
            const result = await getAllVehicles({
                page: currentPage,
                rowsPerPage: limit,
                searchQuery,
            });
            if (result?.status) {
                toast.success("Vehicles fetched successfully!");
                const vehicles = result.data?.vehicles ?? [];
                const transformedData = vehicles.map((item) => ({
                    ...item,
                    id: item._id,
                }));
                console.log("transformedData", transformedData);
                setData(transformedData);
                setTotalPages(result.data?.totalPages || 0);
                setTotalRecord(result.data?.total || 0);
                if (searchQuery.trim() && !isFilterApply) setIsFilterApply(true);
                else if (!searchQuery.trim() && isFilterApply) setIsFilterApply(false);
            } else {
                toast.error(result?.message || "Failed to fetch Vehicles");
            }
        } catch (error) {
            console.error("Error fetching Vehicles", error);
            toast.error("Error fetching Vehicles");
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

    const deleteHandler = (id) => {
        Modal.confirm({
            title: "Delete Vehicle",
            content:
                "Are you sure you want to delete this vehicle? This action cannot be undone.",
            okText: loading ? "Deleting..." : "Delete",
            okType: "danger",
            cancelText: "Cancel",
            okButtonProps: { disabled: loading },
            onOk: async () => {
                try {
                    setLoading(true);
                    const result = await deleteVehicle(id);
                    if (result?.status) {
                        toast.success("Vehicle deleted successfully!");
                        fetchData();
                    } else {
                        toast.error(result?.message || "Failed to delete vehicle.");
                    }
                } catch (error) {
                    console.error("Error deleting vehicle.", error);
                    toast.error("Error deleting vehicle.");
                } finally {
                    setLoading(false);
                }
            },
        });
    };

    const handleAddClick = () => {
        setTimeout(() => {
            navigate("add");
        }, 300);
    };

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
    console.log(data)
    const excelColumns = [
        { label: "ID", value: (row) => row?._id || "" },
        { label: "City", value: (row) => row?.cityId?.name || "" },
        { label: "Name", value: (row) => row?.name || "" },
        { label: "Vehicle Number", value: (row) => row?.vehicleNumber || "" },
        { label: "Type", value: (row) => row?.vehicleType || "" },
        { label: "Color", value: (row) => row?.color || "" },
        {
            label: "Created Date",
            value: (row) => convertUTCToLocalDateString(row?.createdAt) ?? "",
        },
    ];

    const tableColumns = [
        { label: "Name", key: "name" },
        { label: "City", key: "cityId", render: (cityId) => cityId?.name || "N/A" },
        { label: "Number", key: "vehicleNumber" },
        { label: "Type", key: "vehicleType" },
        { label: "Seats", key: "seatingCapacity" },
        { label: "Color", key: "color" },
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
    ];

    const handleOnUpdate = (rowId) => {
        navigate(`update/${rowId}`);
    };

    const handleOnView = (rowId) => {
        navigate(`view/${rowId}`);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <Breaker />
            </div>
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search by vehicle name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-60 px-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
                        aria-label="Search vehicle by name"
                        onKeyDown={handleOnKeyDown}
                    />
                    {isFilterApply && <ClearBtn handleClear={handleClearFilter} />}
                </div>
                <div className="flex gap-4">
                    {hasPermission("vehicle", "exportExcel") && (
                        <ExportButton ariaLabel="Export vehicles to Excel" excelName="Vehicle" dataToExport={data} columns={excelColumns} />)}
                    {hasPermission("vehicle", "create") && (
                        <AddButton btnName="Add Vehicle" onClick={handleAddClick} />
                    )}
                </div>
            </div>

            <GenericTable limit={rowsPerPage} page={page} data={data} hasAction={true} hasEdit={hasPermission("vehicle", "edit")} hasDelete={hasPermission("vehicle", "delete")} hasView={false} columns={tableColumns} isLoading={loading} ariaLabel="Vehicle" onEdit={(row) => {
                handleOnUpdate(row._id);
            }}
                onDelete={(row) => {
                    deleteHandler(row._id);
                }}
                onView={(row) => handleOnView(row._id)} />

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

export default VehicleListPage;
