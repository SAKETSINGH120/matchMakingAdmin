import toast from 'react-hot-toast';

const BASE_URL = import.meta.env.VITE_BASE_URL;



export const getAllBlog = async ({ page, rowsPerPage, searchQuery }) => {
  const token = localStorage.getItem('token');
    try {
       
      console.log(searchQuery, 'searchQuery')
      const res = await fetch(`${BASE_URL}/api/admin/blog?search=${searchQuery}&page=${page}&limit=${rowsPerPage}`, {
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
   export const createBlogApi = async (data) => {
      console.log(data, ' data for send in the api');
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${BASE_URL}/api/admin/blog`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
            // 'Content-Type': 'application/json'
          },
          body: data // Send the data as JSON
        });
        const result = await res.json();
        return result;
      } catch (err) {
        toast.error(err.message || 'Something went wrong!');
        throw new Error(err.message);
      }
    };
    export const updateBlogApi = async ({ id, data }) => {
      const token = localStorage.getItem('token');
      console.log(data, 'data');
      try {
        const res = await fetch(`${BASE_URL}/api/admin/blog/${id}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: data
        });
        const result = await res.json();
        return result;
      } catch (err) {
        toast.error(err.message || 'Something went wrong!');
        throw new Error(err.message);
      }
    };
    export const getBlogApi = async (id) => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${BASE_URL}/api/admin/blog/${id}`, {
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
    export const BlogDelete = async (id) => {
      const token = localStorage.getItem('token');
      try {
        const res = await fetch(`${BASE_URL}/api/admin/blog/${id}`, {
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
    