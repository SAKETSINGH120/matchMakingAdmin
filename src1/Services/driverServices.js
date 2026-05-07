import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllDrivers = async ({
    page,
    rowsPerPage,
    searchQuery = "", vehicleType = "", status = ""
}) => {
    const token = localStorage.getItem("token");
    try {
        let url = `${BASE_URL}/api/admin/driver?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`;
        if (vehicleType) {
            url += `&vehicleType=${vehicleType}`;
        }
        if (status) {
            url += `&status=${status}`;
        }
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const result = await res.json();
        console.log(result);
        if (!res.status) throw new Error(result.message);
        return result;
    } catch (err) {
        toast.error(err.message || "Something went wrong!");
        throw new Error(err.message);
    }
};

export const getDriver = async (id) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/api/admin/driver/${id}`, {
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

export const updateDriver = async (id, data) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/api/admin/driver/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.status) throw new Error(result.message);
        toast.success("Driver updated successfully!");
        return result;
    } catch (err) {
        toast.error(err.message || "Something went wrong!");
        throw new Error(err.message || "Something went wrong!");
    }
};

export const getAllAvailableDrivers = async ({
    page,
    limit,
    searchQuery = "", vehicleType = "",
}) => {
    const token = localStorage.getItem("token");
    try {
        let url = `${BASE_URL}/api/admin/driver/available?search=${searchQuery}&page=${page}&limit=${limit}`;
        if (vehicleType) {
            url += `&vehicleType=${vehicleType}`;
        }
        const res = await fetch(url, {
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
        throw new Error(err.message);
    }
};