import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import { getAllMatches } from "../../Services/MatchApi";
import toast from "react-hot-toast";
import getValFromSearchParams from "../../utils/getValFromSearchParams";
import PaginationManager from "../../compoents/PaginationManager";
import GenericTable from "../../compoents/Table";
import { Tag, Avatar, Tooltip, Typography, Input } from "antd";
import {
  UserOutlined,
  ThunderboltOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

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
              photo: u1.profilePhoto?.[0],
              gender: u1.gender,
            },

            u2: {
              name: capitalizeWords(u2.name),
              photo: u2.profilePhoto?.[0],
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
    } catch (error) {
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
  }, [searchInput]);

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

            <Text strong className="text-gray-700">
              {row.u1.name}
            </Text>
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

            <Text strong className="text-gray-700">
              {row.u2.name}
            </Text>
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
      //           className={`h-2 rounded-full ${score > 80
      //               ? "bg-green-500"
      //               : score > 50
      //                 ? "bg-blue-500"
      //                 : "bg-orange-400"
      //             }`}
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
    <div className="p-8 bg-[#f1f5f9] min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Breaker />

          <h1 className="text-2xl font-bold text-gray-800 mt-2">
            Match Management
          </h1>

          <p className="text-sm text-gray-500">
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
            className="shadow-sm border border-gray-200 rounded-lg bg-white flex items-center gap-2 px-3"
          />
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-3 mb-6">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleStatusChange(tab.key)}
            className={`px-5 py-2 rounded-xl border-gray-200 text-sm font-medium transition ${
              (statusFilter || "all") === tab.key
                ? "bg-[#3f4f3c] text-white shadow"
                : "bg-white border hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-300 bg-gray-50 font-semibold text-gray-700">
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

        <div className="p-4  bg-gray-50">
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
