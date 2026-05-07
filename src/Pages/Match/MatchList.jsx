import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import { getAllMatches } from "../../Services/MatchApi";
import toast from "react-hot-toast";
import getValFromSearchParams from "../../utils/getValFromSearchParams";
import PaginationManager from "../../compoents/PaginationManager";
import GenericTable from "../../compoents/Table";
import { Tag, Avatar, Tooltip, Input } from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
const BASE_URL = import.meta.env.VITE_BASE_URL;

export default function MatchList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const { page, rowsPerPage, searchQueryFromUrl } = getValFromSearchParams({
    searchParams,
  });

  const statusFilter = searchParams.get("status") ?? "all";

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("searchQuery") || "",
  );

  const capitalizeWords = (text) => {
    if (!text) return "—";
    return text.toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const status = searchParams.get("status");

      const result = await getAllMatches({
        page,
        rowsPerPage,
        searchQuery: searchQueryFromUrl,
        status: status && status !== "all" ? status : undefined,
      });

      if (result?.success) {
        let transformed = (result.data || []).map((match, index) => {
          const u1 = match.users?.[0] || {};
          const u2 = match.users?.[1] || {};

          return {
            ...match,
            key: match._id,
            serialNo: index + 1 + (page - 1) * rowsPerPage,

            u1: {
              name: capitalizeWords(u1.name),
              photo: u1.primaryImage ? `${BASE_URL}/${u1.primaryImage}` : null,
              gender: u1.gender,
            },

            u2: {
              name: capitalizeWords(u2.name),
              photo: u2.primaryImage ? `${BASE_URL}/${u2.primaryImage}` : null,
              gender: u2.gender,
            },
          };
        });

        if (statusFilter !== "all") {
          transformed = transformed.filter(
            (item) => item.status === statusFilter,
          );
        }

        setData(transformed);
        setTotalPages(result.meta?.totalPages || 0);
        setTotalRecord(result.meta?.total || 0);
      }
    } catch {
      toast.error("Error fetching matches");
    } finally {
      setLoading(false);
    }
  }, [searchParams, page, rowsPerPage, searchQueryFromUrl, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  const handleStatusChange = (status) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      if (status === "all") {
        next.delete("status");
      } else {
        next.set("status", status);
      }

      next.set("page", "1");

      return next;
    });
  };

  const statusTabs = [
    { key: "all", label: "All" },
    { key: "pending", label: "Pending" },
    { key: "approved", label: "Approved" },
  ];

  const tableColumn = useMemo(
    () => [
      // {
      //   label: "S.No",
      //   key: "serialNo",
      // },

      {
        label: "User 1",
        key: "u1",
        render: (_, row) => (
          <div className="flex items-center gap-3">
            <Tooltip title={row.u1.name}>
              <Avatar src={row.u1.photo} icon={<UserOutlined />} size={42} />
            </Tooltip>

            <span className="font-semibold text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
              {row.u1.name}
            </span>
          </div>
        ),
      },

      {
        label: "User 2",
        key: "u2",
        render: (_, row) => (
          <div className="flex items-center gap-3">
            <Tooltip title={row.u2.name}>
              <Avatar src={row.u2.photo} icon={<UserOutlined />} size={42} />
            </Tooltip>

            <span className="font-semibold text-theme-light-textPrimary dark:text-theme-dark-textPrimary">
              {row.u2.name}
            </span>
          </div>
        ),
      },

      // {
      //   label: "Compatibility",
      //   key: "compatibilityScore",
      //   render: (score) => (
      //     <div className="flex items-center gap-2">
      //       <div className="w-20 bg-gray-200 rounded-full h-2">
      //         <div
      //           className={`h-2 rounded-full ${
      //             score > 80
      //               ? "bg-green-500"
      //               : score > 50
      //                 ? "bg-blue-500"
      //                 : "bg-orange-400"
      //           }`}
      //           style={{ width: `${score}%` }}
      //         />
      //       </div>

      //       <Text strong>{score}%</Text>
      //     </div>
      //   ),
      // },

      // {
      //   label: "Match Type",
      //   key: "matchType",
      //   render: (type) => (
      //     <Tag
      //       icon={<ThunderboltOutlined />}
      //       color={type === "algorithm" ? "purple" : "blue"}
      //     >
      //       {type?.toUpperCase()}
      //     </Tag>
      //   ),
      // },

      {
        label: "Status",
        key: "status",
        render: (status) => {
          const statusConfig = {
            active: { color: "green", label: "Active" },
            inactive: { color: "red", label: "Inactive" },
            pending: { color: "orange", label: "Pending" },
            approved: { color: "blue", label: "Approved" },
          };

          const config = statusConfig[status] || {
            color: "default",
            label: status,
          };

          return <Tag color={config.color}>{config.label}</Tag>;
        },
      },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-theme-light-bg p-8 text-theme-light-textPrimary transition-colors duration-200 dark:bg-theme-dark-bg dark:text-theme-dark-textPrimary">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Breaker />

          <h1 className="mt-2 text-2xl font-bold text-theme-light-heading dark:text-theme-dark-textPrimary">
            Match Management
          </h1>

          <p className="text-sm text-theme-light-textSecondary dark:text-theme-dark-textSecondary">
            Manage and monitor user matches
          </p>
        </div>

        <div className="w-[260px] ">
          <Input
            placeholder="Search by name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            prefix={<SearchOutlined />}
            size="large"
            className="rounded-lg border border-theme-light-inputBorder bg-theme-light-inputBg px-3 text-theme-light-textPrimary shadow-sm transition-colors duration-200 dark:border-theme-dark-inputBorder dark:bg-theme-dark-inputBg dark:text-theme-dark-textPrimary"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-3 mb-6">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleStatusChange(tab.key)}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-colors duration-200 ${
              (statusFilter || "all") === tab.key
                ? "bg-theme-light-primaryButton text-white shadow-sm dark:bg-theme-dark-primaryButton"
                : "border border-theme-light-border bg-theme-light-surface text-theme-light-textSecondary hover:bg-theme-light-surfaceAlt hover:text-theme-light-textPrimary dark:border-theme-dark-border dark:bg-theme-dark-surface dark:text-theme-dark-textSecondary dark:hover:bg-theme-dark-border/60 dark:hover:text-theme-dark-textPrimary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="overflow-hidden rounded-2xl border border-theme-light-border bg-theme-light-surface shadow-sm transition-colors duration-200 dark:border-theme-dark-border dark:bg-theme-dark-surface">
        <div className="border-b border-theme-light-border bg-theme-light-surfaceAlt p-4 font-semibold text-theme-light-textPrimary transition-colors duration-200 dark:border-theme-dark-border dark:bg-theme-dark-inputBg dark:text-theme-dark-textPrimary">
          Match List
        </div>

        <GenericTable
          data={data}
          columns={tableColumn}
          hasAction
          hasView
          hasEdit={false}
          hasDelete={false}
          isLoading={loading}
          onView={(row) => navigate(`view/${row._id}`)}
        />

        <div className="bg-theme-light-surfaceAlt p-4 transition-colors duration-200 dark:bg-theme-dark-inputBg">
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
