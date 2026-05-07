import React, { useState } from "react";
import { updateAgent } from "../Services/AgentApi";
import toast from "react-hot-toast";

const AgentToggle = ({ agentId, initialIsVerified, onSuccess }) => {
    const [isVerified, setIsVerified] = useState(initialIsVerified);
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        if (loading) return;

        const newValue = !isVerified;
        setLoading(true);
        setIsVerified(newValue); // Optimistic update

        try {
            await updateAgent(agentId, { isVerified: newValue });
            // toast.success(`Agent marked as ${newValue ? "Verified" : "Unverified"}`);
            if (onSuccess) onSuccess(); // Optional: refresh table
        } catch (error) {
            setIsVerified(!newValue); // Revert on error
            toast.error("Failed to update verification status");
        } finally {
            setLoading(false);
        }
    };

    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={isVerified}
                onChange={handleToggle}
                disabled={loading}
                className="sr-only peer"
            />
            <div
                className={`w-11 h-6 rounded-full peer transition-colors
          after:content-[''] after:absolute after:top-0.5 after:left-0.5 
          after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
          ${isVerified ? "bg-green-600" : "bg-red-500"}
          ${loading ? "opacity-70" : ""}
          peer-checked:after:translate-x-full`}
            ></div>
            <span className="ml-3 text-sm font-medium text-gray-700">
                {isVerified ? "Verified" : "Unverified"}
            </span>
        </label>
    );
};

export default AgentToggle;