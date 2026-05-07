import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Get all locations with pagination and search
export const getAllLocation = async ({ page = 1, rowsPerPage = 10, searchQuery = '' }) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/location/list?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`,
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
      throw new Error(result.message || 'Failed to fetch locations');
    }

    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw err;
  }
};

// Create a new location
export const createLocation = async (data) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/location/create`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Failed to create location');
    }

    toast.success('Location created successfully!');
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw err;
  }
};

// Get a single location by ID
export const getLocationById = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/location/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch location');
    }

    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw err;
  }
};

// Update a location by ID
export const updateLocation = async (id, data) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/location/update/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Failed to update location');
    }

    toast.success('Location updated successfully!');
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw err;
  }
};


export const deleteLocation = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/location/delete/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Failed to delete location');
    }

    toast.success('Location deleted successfully!');
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw err;
  }
};