import toast from 'react-hot-toast';
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const getAllSos = async ({ page = 1, rowsPerPage = 10, searchQuery = '' }) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/sos?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`,
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
      throw new Error(result.message || 'Failed to fetch SOS requests');
    }
    
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong while fetching SOS requests!');
    throw err;
  }
};

// // Fetch a single SOS by ID
// export const getSosById = async (sosId) => {
//   if (!sosId) {
//     toast.error("Invalid SOS ID");
//     throw new Error("SOS ID is required");
//   }

//   const token = localStorage.getItem('token');

//   try {
//     const res = await fetch(`${BASE_URL}/api/admin/sos/${sosId}`, {
//       method: 'GET',
//       headers: {
//         Authorization: `Bearer ${token}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     const result = await res.json();

//     if (!res.ok) {
//       throw new Error(result.message || 'Failed to fetch SOS details');
//     }

//     // Return the SOS object (usually inside result.data or result directly)
//     return result; // Adjust if your backend wraps it like { data: sos }
//   } catch (err) {
//     toast.error(err.message || 'Something went wrong while fetching SOS details!');
//     throw err;
//   }
// };


// src/Services/SosApi.js (add this function)

export const updateSosReadStatus = async (sosId, isRead) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/sos/${sosId}`, {
      method: 'PATCH', 
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isRead }),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Failed to update read status');
    }

    return result;
  } catch (err) {
    toast.error(err.message || 'Failed to update read status!');
    throw err;
  }
};