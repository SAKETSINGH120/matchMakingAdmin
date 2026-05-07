// import React, { useEffect, useState } from "react";
// import { getSubscriptions, deleteSubscription } from "../../Services/SubscriptionApi";
// import toast from "react-hot-toast";

// const SubscriptionsList = () => {

//     const [subscriptions, setSubscriptions] = useState([]);
//     const [search, setSearch] = useState("");
//     const [status, setStatus] = useState("");
//     const [loading, setLoading] = useState(false);

//     const fetchSubscriptions = async () => {

//         setLoading(true);

//         try {

//             const res = await getSubscriptions({
//                 search,
//                 status
//             });

//             setSubscriptions(res?.data || []);

//         } catch (err) {

//             toast.error("Failed to fetch subscriptions");

//         }

//         setLoading(false);
//     };

//     useEffect(() => {

//         fetchSubscriptions();

//     }, [search, status]);


//     const handleDelete = async (id) => {

//         if (!window.confirm("Are you sure you want to delete this subscription?")) return;

//         try {

//             await deleteSubscription(id);

//             toast.success("Deleted successfully");

//             fetchSubscriptions();

//         } catch {

//             toast.error("Delete failed");

//         }

//     };


//     const formatDate = (date) => {
//         if (!date) return "-";
//         return new Date(date).toLocaleDateString();
//     };


//     const getStatusColor = (status) => {

//         if (status === "active") return "bg-green-100 text-green-700";
//         if (status === "expired") return "bg-gray-200 text-gray-700";
//         if (status === "cancelled") return "bg-red-100 text-red-700";

//         return "bg-gray-100 text-gray-700";
//     };


//     return (

//         <div className="p-6">

//             <h2 className="text-2xl font-bold mb-4">Subscriptions</h2>

//             {/* Filters */}
//             <div className="flex gap-4 mb-4">
//                 <input
//                     type="text"
//                     placeholder="Search user number..."
//                     value={search}
//                     onChange={(e) => setSearch(e.target.value)}
//                     className="border px-3 py-2 rounded w-60"
//                 />
//                 <select
//                     value={status}
//                     onChange={(e) => setStatus(e.target.value)}
//                     className="border px-3 py-2 rounded"
//                 >

//                     <option value="">All Status</option>
//                     <option value="active">Active</option>
//                     <option value="expired">Expired</option>
//                     <option value="cancelled">Cancelled</option>

//                 </select>

//             </div>


//             {/* Table */}

//             <div className="overflow-x-auto">

//                 <table className="min-w-full border border-gray-300 bg-white rounded">
//                     <thead className="bg-gray-100">
//                         <tr>
//                             <th className="border px-4 py-2 text-left border-gray-300 ">User Number</th>
//                             <th className="border px-4 py-2 text-left border-gray-300">Plan</th>
//                             <th className="border px-4 py-2 text-left border-gray-300">Price</th>
//                             <th className="border px-4 py-2 text-left border-gray-300">Status</th>
//                             <th className="border px-4 py-2 text-left border-gray-300">Start Date</th>
//                             <th className="border px-4 py-2 text-left border-gray-300">End Date</th>
//                             {/* <th className="border px-4 py-2 text-left">Action</th> */}

//                         </tr>

//                     </thead>

//                     <tbody>

//                         {loading ? (

//                             <tr>
//                                 <td colSpan="7" className="text-center py-6">
//                                     Loading subscriptions...
//                                 </td>
//                             </tr>

//                         ) : subscriptions.length === 0 ? (

//                             <tr>
//                                 <td colSpan="7" className="text-center py-6">
//                                     No subscriptions found
//                                 </td>
//                             </tr>

//                         ) : (

//                             subscriptions.map((sub) => (

//                                 <tr key={sub._id} className="hover:bg-gray-50">

//                                     <td className="border px-4 py-2 border-gray-300">
//                                         {sub.userId?.number || "-"}
//                                     </td>

//                                     <td className="border px-4 py-2 capitalize border-gray-300">
//                                         {sub.plan}
//                                     </td>

//                                     <td className="border px-4 py-2 border-gray-300">
//                                         {sub.currency} {sub.price}
//                                     </td>

//                                     <td className="border px-4 py-2 border-gray-300">

//                                         <span
//                                             className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(
//                                                 sub.status
//                                             )}`}
//                                         >
//                                             {sub.status}
//                                         </span>

//                                     </td>

//                                     <td className="border px-4 py-2 border-gray-300">
//                                         {formatDate(sub.startDate)}
//                                     </td>

//                                     <td className="border px-4 py-2 border-gray-300">
//                                         {formatDate(sub.endDate)}
//                                     </td>

//                                     {/* <td className="border px-4 py-2">

//                                         <button
//                                             onClick={() => handleDelete(sub._id)}
//                                             className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
//                                         >
//                                             Delete
//                                         </button>

//                                     </td> */}

//                                 </tr>

//                             ))

//                         )}

//                     </tbody>

//                 </table>

//             </div>

//         </div>

//     );

// };

// export default SubscriptionsList;


import React, { useEffect, useState } from "react";
import { getSubscriptions, deleteSubscription } from "../../Services/SubscriptionApi";
import toast from "react-hot-toast";

const SubscriptionsList = () => {

    const [subscriptions, setSubscriptions] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchSubscriptions = async () => {

        setLoading(true);

        try {

            const res = await getSubscriptions({
                search,
                status
            });

            let data = res?.data || [];

            // FRONTEND STATUS FILTER
            if (status) {
                data = data.filter(
                    (sub) => sub.status?.toLowerCase() === status.toLowerCase()
                );
            }

            setSubscriptions(data);

        } catch {

            toast.error("Failed to fetch subscriptions");

        }

        setLoading(false);

    };
    useEffect(() => {

        fetchSubscriptions();

    }, [search, status]);


    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString();
    };


    const getStatusColor = (status) => {

        if (status === "active") return "bg-green-100 text-green-700";
        if (status === "expired") return "bg-gray-200 text-gray-700";
        if (status === "cancelled") return "bg-red-100 text-red-700";

        return "bg-gray-100 text-gray-700";
    };


    const statusTabs = [
        { label: "All", value: "" },
        { label: "Active", value: "active" },
        { label: "Expired", value: "expired" },
        { label: "Cancelled", value: "cancelled" }
    ];


    return (

        <div className="p-6">

            <h2 className="text-2xl font-bold mb-6">Subscriptions</h2>

            {/* Filters */}

            <div className="flex flex-wrap gap-4 mb-6 items-center">

                <input
                    type="text"
                    placeholder="Search user number..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="shadow-sm border border-gray-200 rounded-lg bg-white flex items-center gap-2 px-3 py-2"
                />

                {/* Status Tabs */}

                <div className="flex gap-2">

                    {statusTabs.map((tab) => (

                        <button
                            key={tab.value}
                            onClick={() => setStatus(tab.value)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition
                ${status === tab.value
                                ? "bg-[#3f4f3c] text-white"
                                    : "bg-gray-100 hover:bg-gray-200 shadow-sm"
                                }`}
                        >
                            {tab.label}
                        </button>

                    ))}

                </div>

            </div>


            {/* Table */}

            <div className="overflow-x-auto">

                <table className="min-w-full border border-gray-300 bg-white rounded">

                    <thead className="bg-gray-100">

                        <tr>

                            <th className="border px-4 py-2 text-left">User Number</th>
                            <th className="border px-4 py-2 text-left">Plan</th>
                            <th className="border px-4 py-2 text-left">Price</th>
                            <th className="border px-4 py-2 text-left">Status</th>
                            <th className="border px-4 py-2 text-left">Start Date</th>
                            <th className="border px-4 py-2 text-left">End Date</th>

                        </tr>

                    </thead>

                    <tbody>

                        {loading ? (

                            <tr>
                                <td colSpan="6" className="text-center py-6">
                                    Loading subscriptions...
                                </td>
                            </tr>

                        ) : subscriptions.length === 0 ? (

                            <tr>
                                <td colSpan="6" className="text-center py-6">
                                    No subscriptions found
                                </td>
                            </tr>

                        ) : (

                            subscriptions.map((sub) => (

                                <tr key={sub._id} className="hover:bg-gray-50">

                                    <td className="border px-4 py-2">
                                        {sub.userId?.number || "-"}
                                    </td>

                                    <td className="border px-4 py-2 capitalize">
                                        {sub.plan}
                                    </td>

                                    <td className="border px-4 py-2">
                                        {sub.currency} {sub.price}
                                    </td>

                                    <td className="border px-4 py-2">

                                        <span
                                            className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(
                                                sub.status
                                            )}`}
                                        >
                                            {sub.status}
                                        </span>

                                    </td>

                                    <td className="border px-4 py-2">
                                        {formatDate(sub.startDate)}
                                    </td>

                                    <td className="border px-4 py-2">
                                        {formatDate(sub.endDate)}
                                    </td>

                                </tr>

                            ))

                        )}

                    </tbody>

                </table>

            </div>

        </div>

    );

};

export default SubscriptionsList;