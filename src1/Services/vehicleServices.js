import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllVehicles = async ({
    page,
    rowsPerPage,
    searchQuery = "",
    vehicleType, status = "",
    available = null
}) => {
    const token = localStorage.getItem("token");
    try {
        let url = `${BASE_URL}/api/admin/vehicle?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`;
        if (vehicleType) {
            url += `&vehicleType=${vehicleType}`;
        }
        if (status) {
            url += `&status=${status}`;
        }
        if (available) {
            url += `&available=${available}`;
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

export const deleteVehicle = async (id) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/api/admin/vehicle/${id}`, {
            method: "DELETE",
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

export const getVehicle = async (id) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/api/admin/vehicle/${id}`, {
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

export const createVehicle = async (data) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/api/admin/vehicle`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        return result;
    } catch (err) {
        toast.error(err.message || "Something went wrong!");
        throw new Error(err.message);
    }
};

export const updateVehicle = async ({ id, data }) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/api/admin/vehicle/${id}`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        return result;
    } catch (err) {
        toast.error(err.message || "Something went wrong!");
        throw new Error(err.message);
    }
};

export const assignVehicleToDriver = async ({ driverId, vehicleId }) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/api/admin/driver/assignVehicle`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ driverId, vehicleId }),
        });
        const result = await res.json();
        if (!res.status) throw new Error(result.message);
        return result;
    } catch (err) {
        toast.error(err.message || "Something went wrong!");
        throw new Error(err.message);
    }
};


export const getVehicleTypes = async (cityId) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/api/admin/common/vehicle-types?cityId=${cityId}`, {
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