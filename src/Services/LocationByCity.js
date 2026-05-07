const BASE_URL = import.meta.env.VITE_BASE_URL;
import toast from "react-hot-toast";

export const getLocationByCity = async (cityId) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/api/admin/common/locations?cityId=${cityId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const result = await res.json();
        if (!res.status) throw new Error(result.message);   
        return result;
    } catch (err) {
        toast.error(err.message || "Something went wrong!");
        throw new Error(err.message || "Something went wrong!");
    }
};












