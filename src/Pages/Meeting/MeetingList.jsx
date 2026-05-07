import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import { getMeetingDetail } from "../../Services/MeetingApi";
import toast from "react-hot-toast";
import getValFromSearchParams from "../../utils/getValFromSearchParams";
import PaginationManager from "../../compoents/PaginationManager";
import GenericTable from "../../compoents/Table";
import { Tag, Avatar, Tooltip } from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

export default function MeetingList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { page, rowsPerPage } = getValFromSearchParams({
    searchParams,
  });

  const statusFilter = searchParams.get("status") || "";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);

  const [searchInput, setSearchInput] = useState(
    searchParams.get("searchQuery") || "",
  );

  const capitalizeWords = (text) => {
    if (!text) return "—";
    return text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getStatusColor = (status) => {
    const lower = (status || "").toLowerCase();
    if (lower === "approved") return "green";
    if (lower === "rejected") return "red";
    return "default";
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const {
        page: currentPage,
        rowsPerPage: limit,
        searchQueryFromUrl: searchQuery,
      } = getValFromSearchParams({ searchParams });

      const result = await getMeetingDetail({
        page: currentPage,
        rowsPerPage: limit,
        searchQuery,
      });

      if (result?.success) {
        let transformed = (result.data || []).map((item, index) => {
          const user1 = item.users?.[0] || {};
          const user2 = item.users?.[1] || {};
          const meeting = item.meeting || {};
          const proposedBy = meeting.proposedBy || {};
          const location = meeting.location || {};

          return {
            _id: item._id,
            serialNo: index + 1 + (currentPage - 1) * limit,

            user1_name: capitalizeWords(user1.name),
            user1_number: user1.number || "—",
            user1_gender: user1.gender || "—",

            user2_name: capitalizeWords(user2.name),
            user2_number: user2.number || "—",
            user2_gender: user2.gender || "—",

            proposedBy_name: capitalizeWords(proposedBy.name),
            proposedBy_image: proposedBy.primaryImage || null,

            meeting_location: location.address || "—",

            meeting_dateTime: meeting.dateTime
              ? new Date(meeting.dateTime).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })
              : "—",

            meeting_status: meeting.status || "Pending",
          };
        });

        // FRONTEND STATUS FILTER FIX
        if (statusFilter) {
          transformed = transformed.filter(
            (item) =>
              item.meeting_status?.toLowerCase() === statusFilter.toLowerCase(),
          );
        }

        setData(transformed);
        setTotalPages(result.meta?.totalPages || 0);
        setTotalRecord(result.meta?.total || 0);
      } else {
        toast.error(result?.message || "Failed to load meetings.");
      }
    } catch {
      toast.error("Error fetching meetings.");
    } finally {
      setLoading(false);
    }
  }, [searchParams, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // SEARCH FILTER
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        if (searchInput.trim()) {
          next.set("searchQuery", searchInput.trim());
        } else {
          next.delete("searchQuery");
        }

        next.set("page", "1");

        return next;
      });
    }, 400);

    return () => clearTimeout(timer);
  }, [searchInput, setSearchParams]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const tableColumn = useMemo(
    () => [
      {
        label: "USER 1",
        key: "user1",
        render: (_, row) => (
          <div className="flex items-center gap-3">
            <Avatar icon={<UserOutlined />} size={40} />
            <div>
              <p className="font-medium">{row.user1_name}</p>
              <p className="text-xs text-gray-500">{row.user1_number}</p>
              <p className="text-xs text-gray-500">{row.user1_gender}</p>
            </div>
          </div>
        ),
      },
      {
        label: "USER 2",
        key: "user2",
        render: (_, row) => (
          <div className="flex items-center gap-3">
            <Avatar icon={<UserOutlined />} size={40} />
            <div>
              <p className="font-medium">{row.user2_name}</p>
              <p className="text-xs text-gray-500">{row.user2_number}</p>
              <p className="text-xs text-gray-500">{row.user2_gender}</p>
            </div>
          </div>
        ),
      },
      {
        label: "REQUESTED BY",
        key: "proposedBy_name",
        render: (_, row) => (
          <Tooltip title={row.proposedBy_name}>
            <div className="flex items-center gap-2">
              <Avatar src={row.proposedBy_image} size={36} />
              <span>{row.proposedBy_name}</span>
            </div>
          </Tooltip>
        ),
      },
      {
        label: "LOCATION",
        key: "meeting_location",
        render: (value) => (
          <div className="flex items-center gap-2">
            <EnvironmentOutlined />
            {value}
          </div>
        ),
      },
      {
        label: "DATE & TIME",
        key: "meeting_dateTime",
        render: (value) => (
          <div className="flex items-center gap-2">
            <CalendarOutlined />
            {value}
          </div>
        ),
      },
      {
        label: "STATUS",
        key: "meeting_status",
        render: (status) => (
          <Tag color={getStatusColor(status)} className="capitalize">
            {status}
          </Tag>
        ),
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-theme-light-bg pb-10 text-theme-light-textPrimary transition-colors duration-200 dark:bg-theme-dark-bg dark:text-theme-dark-textPrimary">
      <div className="max-w-8xl mx-auto px-6 pt-8">
        <Breaker />
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meeting Requests</h1>

          <div className="rounded-lg border border-theme-light-border bg-theme-light-surface px-4 py-2 shadow-sm transition-colors duration-200 dark:border-theme-dark-border dark:bg-theme-dark-surface">
            <span className="text-sm text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
              Total
            </span>
            <p className="font-bold text-indigo-600">{totalRecord}</p>
          </div>
        </div>

        {/* FILTERS */}
        <div className="flex items-center gap-3 mb-6">
          <input
            type="text"
            placeholder="Search by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="rounded-lg border border-theme-light-inputBorder bg-theme-light-inputBg px-3 py-2 text-theme-light-textPrimary shadow-sm outline-none transition-colors duration-200 placeholder:text-theme-light-textSecondary focus:border-theme-light-focusBorder focus:ring-2 focus:ring-theme-light-focusBorder/20 dark:border-theme-dark-inputBorder dark:bg-theme-dark-inputBg dark:text-theme-dark-textPrimary dark:placeholder:text-theme-dark-textSecondary dark:focus:border-theme-dark-focusBorder dark:focus:ring-theme-dark-focusBorder/20"
          />

          {/* <select
            value={statusFilter}
            onChange={(e) => {
              const value = e.target.value;

              setSearchParams((prev) => {
                const next = new URLSearchParams(prev);

                if (value) next.set("status", value);
                else next.delete("status");

                next.set("page", "1");

                return next;
              });
            }}
            className="px-4 py-2 border rounded-md"
          >
            <option value="">All</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select> */}
          <div className="flex items-center gap-2">
            {["", "approved", "rejected"].map((status) => {
              const label =
                status === ""
                  ? "All"
                  : status.charAt(0).toUpperCase() + status.slice(1);

              const isActive = statusFilter === status;

              return (
                <button
                  key={status || "all"}
                  onClick={() => {
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);

                      if (status) next.set("status", status);
                      else next.delete("status");

                      next.set("page", "1");

                      return next;
                    });
                  }}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition
          ${
            isActive
              ? "bg-theme-light-primaryButton text-white shadow-sm dark:bg-theme-dark-primaryButton"
              : "border border-theme-light-border bg-theme-light-surface text-theme-light-textSecondary hover:bg-theme-light-surfaceAlt hover:text-theme-light-textPrimary dark:border-theme-dark-border dark:bg-theme-dark-surface dark:text-theme-dark-textSecondary dark:hover:bg-theme-dark-inputBg dark:hover:text-theme-dark-textPrimary"
          }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {(searchInput || statusFilter) && (
            <button
              onClick={() => {
                setSearchInput("");

                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.delete("searchQuery");
                  next.delete("status");
                  next.set("page", "1");
                  return next;
                });
              }}
              className="rounded-md border border-theme-light-border bg-theme-light-surface px-4 py-2 text-sm font-medium text-theme-light-textPrimary transition-colors duration-200 hover:bg-theme-light-surfaceAlt dark:border-theme-dark-border dark:bg-theme-dark-surface dark:text-theme-dark-textPrimary dark:hover:bg-theme-dark-inputBg"
            >
              Clear Filters
            </button>
          )}
        </div>

        {/* TABLE */}
        <div className="mt-6 rounded-xl border border-theme-light-border bg-theme-light-surface shadow-sm transition-colors duration-200 dark:border-theme-dark-border dark:bg-theme-dark-surface">
          <GenericTable
            data={data}
            columns={tableColumn}
            hasAction
            hasView
            hasEdit={false}
            hasDelete={false}
            isLoading={loading}
            // onView={(row) => handleViewMeeting(row._id)}
          />
        </div>

        {/* PAGINATION */}
        <div className="mt-6 flex justify-center">
          <PaginationManager
            rowsPerPage={rowsPerPage}
            totalPages={totalPages}
            totalRecord={totalRecord}
            page={page}
            setSearchParams={setSearchParams}
            searchParams={searchParams}
          />
        </div>
      </div>
    </div>
  );
}
