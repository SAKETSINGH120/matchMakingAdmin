import toast from "react-hot-toast";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllBookings = async ({
    page,
    rowsPerPage,
    searchQuery,
}) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/api/admin/booking/list?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`, {
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

export const getBookingById = async (id) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/api/admin/booking/detail/${id}`, {
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

export const assignDriversToBooking = async (data) => {
    const token = localStorage.getItem("token");
    try {
        const res = await fetch(`${BASE_URL}/api/admin/booking/assignDriver`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        const result = await res.json();
        if (!res.status) throw new Error(result.message);
        toast.success("Drivers assigned successfully!");
        return result;
    } catch (err) {
        toast.error(err.message || "Something went wrong!");
        throw new Error(err.message);
    }
};
