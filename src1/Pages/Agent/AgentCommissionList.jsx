// import * as React from "react";
// import { useEffect, useState, useCallback } from "react";
// import { useLocation, useParams } from "react-router-dom";
// import Breaker from "../../compoents/Breaker";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import Loader from "../../compoents/Loader";
// import { getAgentCommissions } from "../../Services/AgentApi";
// import toast from "react-hot-toast";
// import Pagination from "@mui/material/Pagination";
// import GenericTable from "../../compoents/Table";

// export default function AgentCommissionList() {
//   const { agentId } = useParams();
//   const { state } = useLocation();
//   const agentName = state?.agentName || "Agent";

//   console.log("=== AgentCommissionList mounted ===");
//   console.log("agentId from URL params:", agentId);
//   console.log("agentName from state:", state?.agentName);

//   const [commissions, setCommissions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalRecords, setTotalRecords] = useState(0);
//   const [totalCommission, setTotalCommission] = useState(0);

//   const limit = 10;

//   const fetchCommissions = useCallback(async () => {
//     if (!agentId) return;
//     setLoading(true);

//     try {
//       const result = await getAgentCommissions(agentId, page, limit);

//       const list = result?.data?.list || [];
//       const totalComm = result?.data?.totalCommission || 0;

//       // Handle missing pagination fields gracefully
//       const receivedTotalRecords =
//         result?.data?.totalRecords ??
//         result?.data?.totalResults ??
//         result?.data?.totalCount ??
//         list.length;

//       const calculatedTotalPages = Math.ceil(receivedTotalRecords / limit);

//       setCommissions(list);
//       setTotalCommission(totalComm);
//       setTotalRecords(receivedTotalRecords);
//       setTotalPages(result?.data?.totalPages || calculatedTotalPages || 1);
//     } catch (err) {
//       console.error("Failed to fetch agent commissions:", err);
//       toast.error(err.message || "Failed to load commission list");
//       setCommissions([]);
//       setTotalRecords(0);
//       setTotalPages(1);
//     } finally {
//       setLoading(false);
//     }
//   }, [agentId, page, limit]);

//   useEffect(() => {
//     fetchCommissions();
//   }, [fetchCommissions]);

//   useEffect(() => {
//     AOS.init({ duration: 1000, once: true });
//   }, []);

//   const handlePageChange = (event, newPage) => {
//     setPage(newPage);
//   };

//   const columns = [
//     {
//       label: "Booking ID",
//       key: "bookingId",
//       render: (val) => (val ? val.slice(-8) : "—"),
//     },
//     {
//       label: "Booking Amount",
//       key: "bookingAmount",
//       render: (val) =>
//         `₹ ${Number(val || 0).toLocaleString("en-IN", {
//           minimumFractionDigits: 2,
//           maximumFractionDigits: 2,
//         })}`,
//     },
//     {
//       label: "Commission Date",
//       key: "createdAt",
//       render: (val) =>
//         val
//           ? new Date(val).toLocaleDateString("en-IN", {
//               day: "2-digit",
//               month: "short",
//               year: "numeric",
//             })
//           : "—",
//     },
//   ];

//   if (loading && commissions.length === 0) {
//     return <Loader />;
//   }

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <Breaker title={`Commission List - ${agentName}`} />
//       </div>

//       <div className="mb-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
//         <div className="text-lg font-semibold text-gray-800">
//           Total Commission Earned:{" "}
//           <span className="text-green-600 font-bold">
//             ₹ {Number(totalCommission).toLocaleString("en-IN")}
//           </span>
//         </div>
//       </div>

//       <GenericTable
//         data={commissions}
//         columns={columns}
//         isLoading={loading}
//         page={page}
//         limit={limit}
//         hasAction={false}
//         ariaLabel="agent-commission-table"
//       />

//       {totalPages > 1 && (
//         <div className="mt-8 flex justify-center">
//           <Pagination
//             count={totalPages}
//             page={page}
//             onChange={handlePageChange}
//             color="primary"
//             variant="outlined"
//             shape="rounded"
//             showFirstButton
//             showLastButton
//           />
//         </div>
//       )}

//       {/* Optional fallback message - but GenericTable already handles "No Data found" */}
//       {commissions.length === 0 && !loading && (
//         <div className="text-center py-12 text-gray-500 text-lg mt-4">
//           No commissions found for this agent.
//         </div>
//       )}
//     </div>
//   );
// }


import * as React from "react";
import { useEffect, useState, useCallback } from "react";
import { useLocation, useParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import Loader from "../../compoents/Loader";
import { getAgentCommissions } from "../../Services/AgentApi";
import toast from "react-hot-toast";
import Pagination from "@mui/material/Pagination";
import GenericTable from "../../compoents/Table";

export default function AgentCommissionList() {
  const { agentId } = useParams();
  const { state } = useLocation();
  const agentName = state?.agentName || "Agent";

  console.log("=== AgentCommissionList mounted ===");
  console.log("agentId from URL params:", agentId);
  console.log("agentName from state:", state?.agentName);

  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalCommission, setTotalCommission] = useState(0);

  const limit = 10;

  const fetchCommissions = useCallback(async () => {
    if (!agentId) return;
    setLoading(true);

    try {
      const result = await getAgentCommissions(agentId, page, limit);

      const list = result?.data?.list || [];
      const totalComm = result?.data?.totalCommission || 0;

      // Handle missing pagination fields gracefully
      const receivedTotalRecords =
        result?.data?.totalRecords ??
        result?.data?.totalResults ??
        result?.data?.totalCount ??
        list.length;

      const calculatedTotalPages = Math.ceil(receivedTotalRecords / limit);

      setCommissions(list);
      setTotalCommission(totalComm);
      setTotalRecords(receivedTotalRecords);
      setTotalPages(result?.data?.totalPages || calculatedTotalPages || 1);
    } catch (err) {
      console.error("Failed to fetch agent commissions:", err);
      toast.error(err.message || "Failed to load commission list");
      setCommissions([]);
      setTotalRecords(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [agentId, page, limit]);

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const columns = [
    {
      label: "Booking ID",
      key: "bookingId",
      render: (val) => (val ? val.bookingId : "—"),
    },
    {
      label: "Booking Amount",
      key: "bookingAmount",
      render: (val) =>
        `₹ ${Number(val || 0).toLocaleString("en-IN", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
    },
    // {
    //   label: "Commission Date",
    //   key: "createdAt",
    //   render: (val) =>
    //     val
    //       ? new Date(val).toLocaleDateString("en-IN", {
    //           day: "2-digit",
    //           month: "short",
    //           year: "numeric",
    //         })
    //       : "—",
    // },

    {
      label: "Commission Date & Time",
      key: "createdAt",
      render: (val) =>
        val
          ? new Date(val).toLocaleString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,           
            })
          : "—",
    },
  ];

  if (loading && commissions.length === 0) {
    return <Loader />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <Breaker title={`Commission List - ${agentName}`} />
      </div>

      <div className="mb-6 bg-white p-5 rounded-lg shadow-sm border border-gray-200">
        <div className="text-lg font-semibold text-gray-800">
          Total Commission Earned:{" "}
          <span className="text-green-600 font-bold">
            ₹ {Number(totalCommission).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <GenericTable
        data={commissions}
        columns={columns}
        isLoading={loading}
        page={page}
        limit={limit}
        hasAction={false}
        ariaLabel="agent-commission-table"
      />

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
            showFirstButton
            showLastButton
          />
        </div>
      )}

      {/* Optional fallback message - but GenericTable already handles "No Data found" */}
      {commissions.length === 0 && !loading && (
        <div className="text-center py-12 text-gray-500 text-lg mt-4">
          No commissions found for this agent.
        </div>
      )}
    </div>
  );
}