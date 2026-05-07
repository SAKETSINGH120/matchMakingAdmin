import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllCitiesRoles = async (cityId) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(
            `${BASE_URL}/api/admin/common/role-data?cityId=${cityId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const result = await res.json();
        if (!result.status) throw new Error(result.message);
        return result;
    } catch (err) {
        toast.error(err.message || "Something went wrong!");
        throw new Error(err.message);
    }
};