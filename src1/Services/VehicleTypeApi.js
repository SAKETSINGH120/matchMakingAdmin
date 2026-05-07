import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Get all vehicle types (listing with optional search, pagination)
export const getAllVehicleTypes = async ({ page = 1, rowsPerPage = 10, searchQuery = '' }) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(
      `${BASE_URL}/api/admin/vehicleType?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`,
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
      throw new Error(result.message || 'Failed to fetch vehicle types');
    }

    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw err;
  }
};

// Create a new vehicle type
export const createVehicleType = async (data) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/vehicleType`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // { name: "...", seatingCapacity: number }
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Failed to create vehicle type');
    }

    toast.success('Vehicle type created successfully!');
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw err;
  }
};

// Get a single vehicle type by ID
export const getVehicleTypeById = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/vehicleType/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Failed to fetch vehicle type');
    }

    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw err;
  }
};

// Update a vehicle type by ID
export const updateVehicleType = async (id, data) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/vehicleType/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data), // { name: "...", seatingCapacity: number }
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Failed to update vehicle type');
    }

    toast.success('Vehicle type updated successfully!');
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw err;
  }
};

// Delete a vehicle type by ID
export const deleteVehicleType = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/vehicleType/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.message || 'Failed to delete vehicle type');
    }

    toast.success('Vehicle type deleted successfully!');
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw err;
  }
};