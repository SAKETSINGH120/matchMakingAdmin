import React, { useCallback, useEffect, useState } from "react";
import { getSubscriptions } from "../../Services/SubscriptionApi";
import toast from "react-hot-toast";
import attachUrl from "../../utils/attachUrl";

const SubscriptionsList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchSubscriptions = useCallback(async () => {
    setLoading(true);

    try {
      const res = await getSubscriptions({
        search,
      });

      let data = res?.data || [];

      if (status) {
        data = data.filter(
          (sub) => sub.status?.toLowerCase() === status.toLowerCase(),
        );
      }

      setSubscriptions(data);
    } catch {
      toast.error("Failed to fetch subscriptions");
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString();
  };

  const getStatusColor = (value) => {
    if (value === "active")
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
    if (value === "expired")
      return "bg-theme-light-surfaceAlt text-theme-light-textSecondary dark:bg-theme-dark-inputBg dark:text-theme-dark-textSecondary";
    if (value === "cancelled")
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";

    return "bg-theme-light-surfaceAlt text-theme-light-textSecondary dark:bg-theme-dark-inputBg dark:text-theme-dark-textSecondary";
  };

  const statusTabs = [
    { label: "All", value: "" },
    { label: "Active", value: "active" },
    { label: "Expired", value: "expired" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="p-6 text-theme-light-textPrimary transition-colors duration-200 dark:text-theme-dark-textPrimary">
      <h2 className="text-2xl font-bold mb-6">Subscriptions</h2>

      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search user number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-lg border border-theme-light-inputBorder bg-theme-light-inputBg px-3 py-2 text-theme-light-textPrimary shadow-sm outline-none transition-colors duration-200 placeholder:text-theme-light-textSecondary focus:border-theme-light-focusBorder focus:ring-2 focus:ring-theme-light-focusBorder/20 dark:border-theme-dark-inputBorder dark:bg-theme-dark-inputBg dark:text-theme-dark-textPrimary dark:placeholder:text-theme-dark-textSecondary dark:focus:border-theme-dark-focusBorder dark:focus:ring-theme-dark-focusBorder/20"
        />

        <div className="flex gap-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatus(tab.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                status === tab.value
                  ? "bg-theme-light-primaryButton text-white dark:bg-theme-dark-primaryButton"
                  : "border border-theme-light-border bg-theme-light-surface text-theme-light-textSecondary shadow-sm hover:bg-theme-light-surfaceAlt/80 hover:text-theme-light-textPrimary dark:border-theme-dark-border dark:bg-theme-dark-surface dark:text-theme-dark-textSecondary dark:hover:bg-theme-dark-border/60 dark:hover:text-theme-dark-textPrimary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full overflow-hidden rounded-lg border border-theme-light-border bg-theme-light-surface shadow-sm transition-colors duration-200 dark:border-theme-dark-border dark:bg-theme-dark-surface">
          <thead className="bg-gradient-to-r from-theme-light-primaryButton to-theme-light-primaryHover text-white dark:from-theme-dark-primaryButton dark:to-theme-dark-primaryHover">
            <tr>
              <th className="border border-theme-light-borderStrong px-4 py-3 text-left text-[11px] uppercase tracking-[0.14em] font-semibold dark:border-theme-dark-borderStrong">
                Profile
              </th>
              <th className="border border-theme-light-borderStrong px-4 py-3 text-left text-[11px] uppercase tracking-[0.14em] font-semibold dark:border-theme-dark-borderStrong">
                Name
              </th>
              <th className="border border-theme-light-borderStrong px-4 py-3 text-left text-[11px] uppercase tracking-[0.14em] font-semibold dark:border-theme-dark-borderStrong">
                Number
              </th>
              <th className="border border-theme-light-borderStrong px-4 py-3 text-left text-[11px] uppercase tracking-[0.14em] font-semibold dark:border-theme-dark-borderStrong">
                Plan
              </th>
              <th className="border border-theme-light-borderStrong px-4 py-3 text-left text-[11px] uppercase tracking-[0.14em] font-semibold dark:border-theme-dark-borderStrong">
                Price
              </th>
              <th className="border border-theme-light-borderStrong px-4 py-3 text-left text-[11px] uppercase tracking-[0.14em] font-semibold dark:border-theme-dark-borderStrong">
                Status
              </th>
              <th className="border border-theme-light-borderStrong px-4 py-3 text-left text-[11px] uppercase tracking-[0.14em] font-semibold dark:border-theme-dark-borderStrong">
                Start Date
              </th>
              <th className="border border-theme-light-borderStrong px-4 py-3 text-left text-[11px] uppercase tracking-[0.14em] font-semibold dark:border-theme-dark-borderStrong">
                End Date
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  Loading subscriptions...
                </td>
              </tr>
            ) : subscriptions.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-6">
                  No subscriptions found
                </td>
              </tr>
            ) : (
              subscriptions.map((sub) => (
                <tr
                  key={sub._id}
                  className="transition-colors duration-200 hover:bg-theme-light-surfaceAlt/60 dark:hover:bg-theme-dark-border/45"
                >
                  <td className="border border-theme-light-border px-4 py-2 dark:border-theme-dark-border">
                    <img
                      className="h-12 w-12 rounded-full border border-theme-light-border object-cover dark:border-theme-dark-border"
                      src={
                        sub.userId?.primaryImage
                          ? attachUrl(sub.userId?.primaryImage)
                          : "/images/userDefaultLogo.jpg"
                      }
                      alt={sub.userId?.name || "User profile"}
                    />
                  </td>
                  <td className="border border-theme-light-border px-4 py-2 dark:border-theme-dark-border">
                    {sub.userId?.name || "-"}
                  </td>
                  <td className="border border-theme-light-border px-4 py-2 dark:border-theme-dark-border">
                    {sub.userId?.number || "-"}
                  </td>
                  <td className="border border-theme-light-border px-4 py-2 capitalize dark:border-theme-dark-border">
                    {sub.plan}
                  </td>
                  <td className="border border-theme-light-border px-4 py-2 dark:border-theme-dark-border">
                    {sub.currency} {sub.price}
                  </td>
                  <td className="border border-theme-light-border px-4 py-2 dark:border-theme-dark-border">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${getStatusColor(
                        sub.status,
                      )}`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="border border-theme-light-border px-4 py-2 dark:border-theme-dark-border">
                    {formatDate(sub.startDate)}
                  </td>
                  <td className="border border-theme-light-border px-4 py-2 dark:border-theme-dark-border">
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
