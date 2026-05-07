import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Loader from "../../compoents/Loader";
import LoderBtn from "../../compoents/LoderBtn";
import { getSupportList } from "../../Services/SupportApi"; // ← adjust path
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import toast from "react-hot-toast";
import xlsx from "json-as-xlsx";
import Breaker from "../../compoents/Breaker";
import ReadStatusToggle from "../../compoents/ReadStatusToggle";
import AOS from "aos";
import "aos/dist/aos.css";
import CommonTable from "../../compoents/CommonTable";
import SupportReadToggle from "../../compoents/SupportReadToggle";
import { capitalize } from "@mui/material";
import { useAuth } from "../../auth/AuthContext";
import { updateSupportReadStatus } from "../../Services/SupportApi";
import Toggle from "../../compoents/Toggle";

export default function SupportListPage() {
  const { hasPermission } = useAuth();

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecord, setTotalRecord] = useState(0);
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getSupportList({ page, rowsPerPage });

      console.log("Support API Response:", result);


      const supportList = Array.isArray(result?.data?.list) ? result.data.list : [];
      const total = result?.data?.total || 0;
      const totalPagesFromApi = Math.ceil(total / rowsPerPage) || 1;

      const transformedData = supportList.map((item) => ({
        ...item,
        id: item._id,
        name: item.createdById?.name || "N/A",
        raisedBy: capitalize(item.createdBy || "unknown"),
        message: item.message || "-",
        raisedAt: item.createdAt,
      }));

      setData(transformedData);
      setTotalRecord(total);
      setTotalPages(totalPagesFromApi);
    } catch (error) {
      console.error("Error fetching Support:", error);
      toast.error(error?.message || "Failed to fetch support requests.");
      setData([]);
      setTotalRecord(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleReadToggle = async (supportId, currentIsRead) => {
  const newValue = !currentIsRead;

  // Optimistic UI
  setUpdatingIds((prev) => new Set([...prev, supportId]));
  setData((prev) =>
    prev.map((row) =>
      row.id === supportId ? { ...row, isRead: newValue } : row
    )
  );

  try {
    await updateSupportReadStatus(supportId, newValue);
    toast.success(`Marked as ${newValue ? "Read" : "Unread"}`);
    // You can optionally call fetchData() here if you want to be extra safe
  } catch (err) {
    toast.error("Failed to update read status");
    // Rollback
    setData((prev) =>
      prev.map((row) =>
        row.id === supportId ? { ...row, isRead: currentIsRead } : row
      )
    );
  } finally {
    setUpdatingIds((prev) => {
      const next = new Set(prev);
      next.delete(supportId);
      return next;
    });
  }
};



  const exportFunc = () => {
    if (data.length === 0) {
      return toast.error("No support requests to export!");
    }
    setIsExporting(true);

    const settings = {
      fileName: "Support_Requests_List",
      writeMode: "writeFile",
    };

    const exportData = [
      {
        sheet: "Support Requests",
        columns: [
          { label: "S.No", value: (_, index) => index + 1 },
          { label: "Raised By", value: (row) => row.raisedBy || "-" },
          { label: "Name", value: (row) => row.name || "N/A" },
          { label: "Message", value: (row) => row.message || "-" },
          {
            label: "Status",
            value: (row) => capitalize(row.status || "pending"),
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
      toast.success("Support requests exported successfully!");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export support requests.");
    } finally {
      setIsExporting(false);
    }
  };

  const columns = [
    {
      header: "S.No",
      render: (_, index) => (page - 1) * rowsPerPage + index + 1,
    },
    {
      header: "Raised By",
      render: (row) => (
        <span className="font-medium">{row.raisedBy || "-"}</span>
      ),
    },
    {
      header: "Name",
      render: (row) => (
        <span className="font-medium">{row.name || "-"}</span>
      ),
    },
    // {
    //   header: "Message",
    //   render: (row) => (
    //     <div className="max-w-xs truncate" title={row.message}>
    //       {row.message || "-"}
    //     </div>
    //   ),
    // },
    {
      header: "Status",
      render: (row) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : row.status === "resolved"
                ? "bg-[#00a63e] text-white"
                : "bg-gray-500 text-white"
            }`}
        >
          {capitalize(row.status || "pending")}
        </span>
      ),
    },
    // {
    //   header: "Is Read",
    //   render: (row) => (
    //     <ReadStatusToggle
    //       id={row._id}           // or row.Id — match what your API expects
    //       initialIsRead={row.isRead}
    //       updateApiFunction={(id, value) => updateSupportReadStatus(id, value)}
    //       onSuccess={fetchData}
    //     />
    //   ),
    // },

    {
    header: "Is Read",
    render: (row) => (
      <Toggle
        checked={row.isRead ?? false}          // safeguard in case undefined
        onChange={() => handleReadToggle(row.id, row.isRead ?? false)}
        disabled={updatingIds.has(row.id)}
        loading={updatingIds.has(row.id)}
        labelTrue="Read"
        labelFalse="Unread"
        colorTrue="green"
        colorFalse="red"
        size="default"
      />
    ),
  },
  ];

  if (loading) return <Loader />;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breaker title="Support Requests" />
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        {/* <div className="text-lg font-medium text-gray-700">
          Total Support Requests: <span className="font-bold text-blue-600">{totalRecord}</span>
        </div> */}

        {hasPermission("support", "exportExcel") && (
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
        emptyMessage="No support requests found"
      />

      {totalRecord > rowsPerPage && (
        <Stack spacing={2} alignItems="center" className="mt-8">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            siblingCount={1}
            boundaryCount={1}
            shape="rounded"
          />
        </Stack>
      )}
    </div>
  );
}