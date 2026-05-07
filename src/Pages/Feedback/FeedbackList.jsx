// import * as React from "react";
// import { useEffect, useState, useCallback, useMemo } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import Breaker from "../../compoents/Breaker";
// import AOS from "aos";
// import "aos/dist/aos.css";
// import toast from "react-hot-toast";
// import PaginationManager from "../../compoents/PaginationManager";
// import GenericTable from "../../compoents/Table";
// import getValFromSearchParams from "../../utils/getValFromSearchParams";
// import { getAllFeedback } from "../../Services/FeedbackApi"; 

// export default function FeedbackList() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const { page, rowsPerPage } = getValFromSearchParams({
//     searchParams,
//   });

//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [totalPages, setTotalPages] = useState(0);
//   const [totalRecord, setTotalRecord] = useState(0);

//   const navigate = useNavigate();

//   // ────────────────────────────────────────────────
//   //                Fetch Data
//   // ────────────────────────────────────────────────
//   const fetchData = useCallback(async () => {
//     try {
//       setLoading(true);

//       const result = await getAllFeedback({
//         page,
//         rowsPerPage,
//       });

//       if (result?.success) {
//         const transformed = (result.data || []).map((item, index) => {
//           const user = item.userId || {};
//           const match = item.matchId || null;

//           let user1 = null;
//           let user2 = null;

//           if (match && match.users?.length >= 2) {
//             user1 = match.users[0];
//             user2 = match.users[1];
//           }

//           return {
//             _id: item._id,
//             serialNo: index + 1 + (page - 1) * rowsPerPage,

//             number: user.number || "N/A",
//             partnerRating: item.partnerRating,
//             platformRating: item.platformRating,
//             comment: item.comment,
//             createdAt: item.createdAt,

//             matchId: match?._id || "N/A",

//             user1_name: user1?.name || "NaN",
//             user1_number: user1?.number || "NaN",
//             user2_name: user2?.name || "NaN",
//             user2_number: user2?.number || "NaN",
//           };
//         });

//         setData(transformed);
//         setTotalPages(result.meta?.totalPages || 0);
//         setTotalRecord(result.meta?.total || transformed.length || 0);
//       } else {
//         toast.error(result?.message || "Failed to load feedback.");
//       }
//     } catch (error) {
//       console.error("Error fetching feedback:", error);
//       toast.error("Error fetching feedback.");
//     } finally {
//       setLoading(false);
//     }
//   }, [page, rowsPerPage]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   useEffect(() => {
//     AOS.init({
//       duration: 1000,
//       once: true,
//     });
//   }, []);

//   // ────────────────────────────────────────────────
//   //          Table Columns
//   // ────────────────────────────────────────────────
//   const tableColumn = useMemo(
//     () => [
//       { label: "Mobile.No", key: "number" },
//       { label: "Partner Rating", key: "partnerRating" },
//       { label: "Platform Rating", key: "platformRating" },
//       { label: "Comment", key: "comment" },

//       {
//         label: "Match ID",
//         key: "matchId",
//         render: (value, row) => (
//           <div>
//             {/* <div>{value}</div> */}

//             {value !== "N/A" ? (
//               <div className="text-xs text-gray-600 mt-1">
//                 <div>
//                   <strong>User1:</strong> {row.user1_name} ({row.user1_number})
//                 </div>
//                 <div>
//                   <strong>User2:</strong> {row.user2_name} ({row.user2_number})
//                 </div>
//               </div>
//             ) : (
//               <div className="text-xs text-gray-600 mt-1">NaN</div>
//             )}
//           </div>
//         ),
//       },

//       {
//         label: "Created At",
//         key: "createdAt",
//         render: (value) =>
//           value ? new Date(value).toLocaleString() : "N/A",
//       },
//     ],
//     []
//   );

//   return (
//     <div className="p-6 bg-gray-50 min-h-screen">
//       <div className="mb-6">
//         <Breaker />
//       </div>

//       <GenericTable
//         data={data}
//         columns={tableColumn}
//         hasAction={false}
//         hasEdit={false}
//         hasDelete={false}
//         hasView={false}
//         isLoading={loading}
//         ariaLabel="Feedback table"
//         limit={rowsPerPage}
//         page={page}
//       />

//       <PaginationManager
//         rowsPerPage={rowsPerPage}
//         totalPages={totalPages}
//         totalRecord={totalRecord}
//         page={page}
//         setSearchParams={setSearchParams}
//         searchParams={searchParams}
//       />
//     </div>
//   );
// }
import * as React from "react";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Breaker from "../../compoents/Breaker";
import AOS from "aos";
import "aos/dist/aos.css";
import toast from "react-hot-toast";
import PaginationManager from "../../compoents/PaginationManager";
import GenericTable from "../../compoents/Table";
import getValFromSearchParams from "../../utils/getValFromSearchParams";
import { getAllFeedback } from "../../Services/FeedbackApi";

export default function FeedbackList() {

  const [searchParams, setSearchParams] = useSearchParams();

  const { page, rowsPerPage } = getValFromSearchParams({
    searchParams,
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalRecord, setTotalRecord] = useState(0);

  const fetchData = useCallback(async () => {
    try {

      setLoading(true);

      const result = await getAllFeedback({
        page,
        rowsPerPage,
      });

      if (result?.success) {

        const transformed = (result.data || []).map((item, index) => {

          const user = item.userId || {};
          const match = item.matchId || null;

          let user1 = null;
          let user2 = null;

          if (match && match.users?.length >= 2) {
            user1 = match.users[0];
            user2 = match.users[1];
          }

          return {
            _id: item._id,
            serialNo: index + 1 + (page - 1) * rowsPerPage,

            number: user.number || "N/A",
            partnerRating: item.partnerRating,
            platformRating: item.platformRating,
            comment: item.comment,
            createdAt: item.createdAt,

            matchId: match?._id || "N/A",

            user1_name: user1?.name || "NaN",
            user1_number: user1?.number || "NaN",
            user2_name: user2?.name || "NaN",
            user2_number: user2?.number || "NaN",
          };
        });

        setData(transformed);
        setTotalPages(result.meta?.totalPages || 0);
        setTotalRecord(result.meta?.total || transformed.length || 0);

      } else {
        toast.error(result?.message || "Failed to load feedback.");
      }

    } catch (error) {
      toast.error("Error fetching feedback.");
    } finally {
      setLoading(false);
    }

  }, [page, rowsPerPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    AOS.init({
      duration: 900,
      once: true,
    });
  }, []);

  /* Rating Badge */
  const RatingBadge = (value) => (
    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700">
      ⭐ {value}/5
    </span>
  );

  /* Table Columns */

  const tableColumn = useMemo(
    () => [
      {
        label: "Mobile",
        key: "number",
        render: (value) => (
          <span className="font-medium text-gray-800">{value}</span>
        ),
      },

      {
        label: "Partner Rating",
        key: "partnerRating",
        render: (value) => RatingBadge(value),
      },

      {
        label: "Platform Rating",
        key: "platformRating",
        render: (value) => RatingBadge(value),
      },

      {
        label: "Comment",
        key: "comment",
        render: (value) => (
          <p className="text-gray-600 text-sm max-w-[250px]">
            {value || "No Comment"}
          </p>
        ),
      },

      {
        label: "Match Users",
        key: "matchId",
        render: (value, row) => (
          <div className="text-sm">

            {value !== "N/A" ? (

              <div className="space-y-1">

                <div className="bg-gray-100 px-3 py-1 rounded-md">
                  <span className="font-semibold text-gray-700">
                    User1:
                  </span>{" "}
                  {row.user1_name} ({row.user1_number})
                </div>

                <div className="bg-gray-100 px-3 py-1 rounded-md">
                  <span className="font-semibold text-gray-700">
                    User2:
                  </span>{" "}
                  {row.user2_name} ({row.user2_number})
                </div>

              </div>

            ) : (
              <span className="text-gray-400">No Match</span>
            )}

          </div>
        ),
      },

      {
        label: "Created At",
        key: "createdAt",
        render: (value) =>
          value ? (
            <span className="text-gray-600 text-sm">
              {new Date(value).toLocaleString()}
            </span>
          ) : (
            "N/A"
          ),
      },
    ],
    []
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">

      {/* Page Header */}

      <div className="flex justify-between items-center mb-6">

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            User Feedback
          </h2>

          <p className="text-sm text-gray-500">
            View all user feedback and ratings
          </p>
        </div>

      </div>

      <Breaker />

      {/* Table Card */}

      <div
        className="bg-white rounded-2xl shadow-md p-4 mt-4"
        data-aos="fade-up"
      >
        <GenericTable
          data={data}
          columns={tableColumn}
          hasAction={false}
          hasEdit={false}
          hasDelete={false}
          hasView={false}
          isLoading={loading}
          ariaLabel="Feedback table"
          limit={rowsPerPage}
          page={page}
        />
      </div>

      {/* Pagination */}

      <div className="mt-6 flex justify-end">
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
  );
}