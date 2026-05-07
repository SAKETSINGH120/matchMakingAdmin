
import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import LoderBtn from "../../compoents/LoderBtn";
import { getAllSos } from "../../Services/SosApi";
import toast from "react-hot-toast";
import xlsx from "json-as-xlsx";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import CommonTable from "../../compoents/CommonTable";
import { capitalize } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import Toggle from "../../compoents/Toggle";
import { updateSosReadStatus } from "../../Services/SosApi";
import PaginationManager from "../../compoents/PaginationManager"; // ← added
import getValFromSearchParams from "../../utils/getValFromSearchParams"; // ← added

export default function SosList() {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { page: pageStr, rowsPerPage: rowsPerPageStr, searchQueryFromUrl } =
    getValFromSearchParams({ searchParams });

  const page = Number(pageStr) || 1;
  const rowsPerPage = Number(rowsPerPageStr) || 10;

  const [search, setSearch] = useState(searchQueryFromUrl || "");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [updatingSosIds, setUpdatingSosIds] = useState(new Set());
  const [isExporting, setIsExporting] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const result = await getAllSos({
        page,
        rowsPerPage,           // or limit: rowsPerPage — depending on your SosApi
        searchQuery: searchQueryFromUrl || "",
      });

      const sosList = Array.isArray(result?.data?.data)
        ? result.data.data
        : [];

      const total = result?.data?.total || 0;
      const totalPagesFromApi = Math.ceil(total / rowsPerPage);

      const transformedData = sosList.map((item) => ({
        ...item,
        id: item._id,
        name: item.createdById?.name || "N/A",
        phone: item.createdById?.phone || "N/A",
        raisedAt: item.createdAt,
      }));

      setData(transformedData);
      setTotalRecord(total);
      setTotalPages(totalPagesFromApi);
    } catch (error) {
      toast.error(error.message || "Failed to fetch SOS requests");
      setData([]);
      setTotalRecord(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage, searchQueryFromUrl]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  // Debounced search update to URL
  useEffect(() => {
    const handler = setTimeout(() => {
      if (search.trim() !== (searchQueryFromUrl || "")) {
        const sp = new URLSearchParams(searchParams);

        if (search.trim()) {
          sp.set("search", search.trim());
        } else {
          sp.delete("search");
        }

        sp.set("page", "1");
        setSearchParams(sp, { replace: true });
      }
    }, 500);

    return () => clearTimeout(handler);
  }, [search, searchParams, searchQueryFromUrl, setSearchParams]);

  const handleReadToggle = async (sosId, currentIsRead) => {
    const newValue = !currentIsRead;
    setUpdatingSosIds((prev) => new Set([...prev, sosId]));

    // optimistic update
    setData((prev) =>
      prev.map((row) =>
        row.id === sosId ? { ...row, isRead: newValue } : row
      )
    );

    try {
      await updateSosReadStatus(sosId, newValue);
      toast.success(`Marked as ${newValue ? "Read" : "Unread"}`);
    } catch (err) {
      toast.error("Failed to update read status");
      // rollback
      setData((prev) =>
        prev.map((row) =>
          row.id === sosId ? { ...row, isRead: currentIsRead } : row
        )
      );
    } finally {
      setUpdatingSosIds((prev) => {
        const next = new Set(prev);
        next.delete(sosId);
        return next;
      });
    }
  };

  const exportFunc = () => {
    if (data.length === 0) {
      return toast.error("No SOS requests to export!");
    }
    setIsExporting(true);

    const settings = {
      fileName: "SOS_Requests_List",
      writeMode: "writeFile",
    };

    const exportData = [
      {
        sheet: "SOS Requests",
        columns: [
          { label: "S.No", value: (_, index) => index + 1 },
          { label: "Created By", value: (row) => row.createdBy || "N/A" },
          { label: "City", value: (row) => row.cityId?.name || "N/A" },
          { label: "Name", value: (row) => row.name || "N/A" },
          { label: "Phone", value: (row) => row.phone || "-" },
          {
            label: "Status",
            value: (row) => (row.status === "active" ? "Active" : "Resolved"),
          },
          { label: "Is Read", value: (row) => (row.isRead ? "Read" : "Unread") },
          {
            label: "Raised At",
            value: (row) =>
              row.raisedAt ? new Date(row.raisedAt).toLocaleString() : "-",
          },
        ],
        content: data,
      },
    ];

    try {
      xlsx(exportData, settings);
      toast.success("SOS requests exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export SOS requests.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleOnKeyDown = (e) => {
    if (e.key === "Enter") {
      const sp = new URLSearchParams(searchParams);
      if (search.trim()) sp.set("search", search.trim());
      else sp.delete("search");
      sp.set("page", "1");
      setSearchParams(sp, { replace: true });
    }
  };

  const columns = [
    {
      header: "S.No",
      render: (_, index) => (page - 1) * rowsPerPage + index + 1,
    },
    {
      header: "City",
      render: (row) => (
        <span className="font-medium">{(row.cityId?.name) || "N/A"}</span>
      ),
    },
    {
      header: "Created By",
      render: (row) => (
        <span className="font-medium">{capitalize(row.createdBy) || "-"}</span>
      ),
    },
    {
      header: "Name",
      render: (row) => (
        <span className="font-medium">{row.name || "-"}</span>
      ),
    },
    {
      header: "Phone",
      render: (row) => row.phone || "-",
    },
    {
      header: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === "active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
            }`}
        >
          {row.status === "active" ? "Active" : "Resolved"}
        </span>
      ),
    },
    {
      header: "Is Read",
      render: (row) => (
        <Toggle
          checked={row.isRead}
          onChange={() => handleReadToggle(row.id, row.isRead)}
          disabled={updatingSosIds.has(row.id)}
          loading={updatingSosIds.has(row.id)}
          labelTrue="Read"
          labelFalse="Unread"
          colorTrue="green"
          colorFalse="red"
        />
      ),
    },
  ];

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breaker title="SOS Management" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleOnKeyDown}
            className="w-80 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              const sp = new URLSearchParams(searchParams);
              if (search.trim()) sp.set("search", search.trim());
              else sp.delete("search");
              sp.set("page", "1");
              setSearchParams(sp, { replace: true });
            }}
            className="bg-[#FB721D] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-orange-600 transition"
          >
            Search
          </button>
        </div>
        {hasPermission("sos", "exportExcel") && (
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={exportFunc}
            disabled={isExporting}
            className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-70"
          >
            {isExporting ? (
              <span className="flex items-center gap-2">
                <LoderBtn /> Exporting...
              </span>
            ) : (
              "Export Excel"
            )}
          </motion.button>
        )}
      </div>

      <CommonTable
        columns={columns}
        data={data}
        loading={loading}
        page={page}
        rowsPerPage={rowsPerPage}
        emptyMessage="No SOS requests found"
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
}