import toast from 'react-hot-toast';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllAgentRedeemRequests = async ({
  page = 1,
  rowsPerPage = 10,
  searchQuery = '',
}) => {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/agentBalanceRedeemRequest?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch redeem requests');
    }

    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong while fetching redeem requests');
    throw err;
  }
};

export const updateAgentBalanceRedeemStatus = async (id, status) => {
  const token = localStorage.getItem("token");

  try {
    const url = `${BASE_URL}/api/admin/agentBalanceRedeemRequest/update-status/${id}`;

    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }), 
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to update redeem request status");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Failed to update agent redeem request status");
    throw err;
  }
};