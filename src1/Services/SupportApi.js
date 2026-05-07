import toast from 'react-hot-toast';
const BASE_URL = import.meta.env.VITE_BASE_URL;




export const getSupportList = async ({ page = 1, rowsPerPage = 10 }) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/support?page=${page}&limit=${rowsPerPage}`,
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
      throw new Error(result.message || 'Failed to fetch Support requests');
    }
    
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong while fetching Support requests!');
    throw err;
  }
};


export const updateSupportReadStatus = async (Id, isRead) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/support/${Id}`, {
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