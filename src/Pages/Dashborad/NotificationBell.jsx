
import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { markNotificationRead } from "../../Services/NotificationApi";

export default function NotificationBell({ notifications, onClear, onMarkRead }) {

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const timeAgo = (date) => {
        if (!date) return "Just now";
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return "Just now";

        const intervals = [
            { label: "hour", seconds: 3600 },
            { label: "min", seconds: 60 },
        ];

        for (let i of intervals) {
            const count = Math.floor(seconds / i.seconds);
            if (count > 0) return `${count} ${i.label}${count > 1 ? "s" : ""} ago`;
        }

        return "Just now";
    };

    const handleClick = async (n, index) => {
        console.log("🔔 Notification Clicked:", n);
        console.log("📌 Reference ID:", n.referenceId);
        console.log("📌 Type:", n.type);

        try {
            await markNotificationRead(n._id);
            onMarkRead?.(index); // ← update local isRead state
        } catch (err) {
            console.error("Failed to mark as read:", err);
        }

        if (n.type === "meeting_request") {
            navigate(`/home/match/view/${n.referenceId}`);
        }

        setOpen(false);
    };

    return (
        <div className="relative">

            {/* Bell Button */}
            <button
                onClick={() => setOpen(!open)}
                className="relative rounded-full border border-theme-light-border bg-theme-light-surface p-3 shadow-md transition-colors duration-200 hover:bg-theme-light-surfaceAlt dark:border-theme-dark-border dark:bg-theme-dark-surface dark:hover:bg-theme-dark-inputBg"
            >
                <FaBell
                    className={`text-xl ${unreadCount > 0 ? "animate-pulse text-theme-dark-warning" : "text-theme-light-textSecondary dark:text-theme-dark-textSecondary"}`}
                />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {open && (
                <div className="absolute right-0 z-50 mt-4 w-96 rounded-xl border border-theme-light-border bg-theme-light-surface shadow-xl transition-colors duration-200 dark:border-theme-dark-border dark:bg-theme-dark-surface">

                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-theme-light-border p-4 font-semibold text-theme-light-textPrimary transition-colors duration-200 dark:border-theme-dark-border dark:text-theme-dark-textPrimary">
                        <span>Notifications</span>
                        {notifications.length > 0 && (
                            <button
                                onClick={() => {
                                    onClear?.();
                                    setOpen(false);
                                }}
                                className="text-xs text-theme-light-danger transition-colors duration-200 hover:underline dark:text-theme-dark-danger"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {/* List */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="p-4 text-center text-sm text-theme-light-textSecondary dark:text-theme-dark-textSecondary">No notifications</p>
                        ) : (
                            notifications.map((n, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleClick(n, index)}
                                    className={`cursor-pointer border-b border-theme-light-border p-4 transition-colors duration-200 hover:bg-theme-light-surfaceAlt dark:border-theme-dark-border dark:hover:bg-theme-dark-inputBg ${!n.isRead ? "bg-theme-light-info/10 dark:bg-theme-dark-info/10" : ""
                                        }`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 pr-2">
                                            <p className="text-sm font-semibold text-theme-light-textPrimary dark:text-theme-dark-textPrimary">{n.title || "Notification"}</p>
                                            <p className="mt-0.5 text-xs text-theme-light-textSecondary dark:text-theme-dark-textSecondary">{n.message}</p>
                                        </div>
                                        {!n.isRead && (
                                            <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-theme-light-info dark:bg-theme-dark-info" />
                                        )}
                                    </div>
                                    <p className="mt-2 text-[11px] text-theme-light-textDisabled dark:text-theme-dark-textDisabled">{timeAgo(n.createdAt)}</p>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            )}

        </div>
    );
}
