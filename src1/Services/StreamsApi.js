import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BASE_URL;



export const getAllBanner = async ({ page, rowsPerPage, searchQuery }) => {
  const token = localStorage.getItem('token');
    try {
      
      console.log(searchQuery, 'searchQuery')
      const res = await fetch(`${BASE_URL}/api/admin/streams?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`, {
        method: 'GET', // Change method to POST
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const result = await res.json();
      if (!res.status) throw new Error(result.message);
      return result;
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
      throw new Error(err.message);
    }
  };
//   export const createStreamApi = async (data) => {
//     console.log(data, ' data for send in the api');
//     const token = localStorage.getItem('token');
//     try {
//       const res = await fetch(`${BASE_URL}/api/admin/streams`, {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`
//           // 'Content-Type': 'application/json'
//         },
//         body: data // Send the data as JSON
//       });
//       const result = await res.json();

  
//       return result;
     
//     } catch (err) {
//       toast.error(err.message || 'Something went wrong!');
//       throw new Error(err.message);
//     }
//   };

   export const createStreamApi = async (data) => {
    const token = localStorage.getItem('token');
    console.log(data, ' data for send in the api');
    try {
      const res = await fetch(`${BASE_URL}/api/admin/streams`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Required for JSON data
        },
        body: JSON.stringify(data), // Convert JS object to JSON string
      });
  
      const result = await res.json();
      return result;
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
      throw new Error(err.message);
    }
  };

  export const BannerDelete = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/streams/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const result = await res.json();
    if (!res.status) throw new Error(result.message);
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw new Error(err.message || 'Something went wrong!');
  }
};


  
export const updateStreamApi = async ( id, payload ) => {

  const token = localStorage.getItem('token');
  console.log(payload, 'payload................');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/streams/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
        body: JSON.stringify(payload),
    });
    const result = await res.json();
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw new Error(err.message);
  }
};
export const getStreamByIdApi = async (id) => {

  const token = localStorage.getItem('token');
  try {
    const res = await fetch(`${BASE_URL}/api/admin/streams/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const result = await res.json();
    return result;
  } catch (err) {
    toast.error(err.message || 'Something went wrong!');
    throw new Error(err.message);
  }
};