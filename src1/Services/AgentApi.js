import toast from 'react-hot-toast';
const BASE_URL = import.meta.env.VITE_BASE_URL;


export const getAllAgents = async ({ page = 1, rowsPerPage = 10, searchQuery = '' }) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/agent/list?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`,
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
      throw new Error(result.message || 'Failed to fetch agents');
    }
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw err;
  }
};

// Get a single agent by ID
export const getAgentById = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/agent/detail/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch agent details');
    }
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw err;
  }
};

// Update an agent by ID
export const updateAgent = async (id, data) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/agent/update/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // Pass updated agent data here
    });
    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.message || 'Failed to update agent');
    }
    toast.success('Agent updated successfully!');
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw err;
  }
};



export const getAgentCommissions = async (agentId, page = 1, limit = 10) => {
  const token = localStorage.getItem("token");

  const url = `${BASE_URL}/api/admin/agent/comission/${agentId}?page=${page}&limit=${limit}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || "Failed to fetch commissions");
    }

    return result;
  } catch (err) {
    toast.error(err.message || "Something went wrong!");
    throw err;
  }
};