import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
// import { updateMemberApi } from "../../Services/MemberApi"; 
import { getMemberByIdApi, updateMemberApi } from "../../Services/MemberApi";
import { getAllCities } from "../../Services/CityApi";
import { getAllCitiesRoles } from "../../Services/CommonApi";
import Loader from "../../compoents/Loader";
import Breaker from "../../compoents/Breaker";
import { useNavigate, useParams } from "react-router-dom";

import "/src/index.css";

const UpdateMember = () => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  // console.log("Member ID from URL:", id);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "", 
    cityId: "",
    roleId: "",
  });

  const [roles, setRoles] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false);
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingMember, setLoadingMember] = useState(true);
  const [apiError, setApiError] = useState({});

  // Fetch cities (same as create)
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const res = await getAllCities({
          page: 1,
          rowsPerPage: 1000, 
          searchQuery: "",
        });

        if (res.status && res.data) {
          setCities(res.data);
        } else {
          toast.error(res.message || "Failed to fetch cities");
        }
      } catch (error) {
        toast.error(error.message || "Error fetching cities");
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  // Fetch member data when component mounts
  useEffect(() => {
    const fetchMember = async () => {
      if (!id) return;

      try {
        setLoadingMember(true);
        // You need to implement getMemberByIdApi in your services
        // For now assuming you have or will create: getMemberByIdApi(id)
        const res = await getMemberByIdApi(id); // ← ADD THIS API CALL

        if (res.status && res.data) {
          const member = res.data;
          setFormData({
            name: member.name || "",
            email: member.email || "",
            password: "", // intentionally empty — usually don't prefill password
            cityId: member.city?._id || member.city || "",
            roleId: member.role?._id || member.role || "",
          });
        } else {
          toast.error(res.message || "Failed to load member data");
        }
      } catch (err) {
        toast.error("Could not load member information");
      } finally {
        setLoadingMember(false);
      }
    };

    fetchMember();
  }, [id]);

  // Fetch roles when cityId is available (and after member is loaded)
  useEffect(() => {
    if (!formData.cityId) {
      setRoles([]);
      return;
    }

    const fetchRoles = async () => {
      try {
        setLoadingRoles(true);
        const res = await getAllCitiesRoles(formData.cityId);

        if (res.status && res.data) {
          setRoles(res.data);
        } else {
          setRoles([]);
          toast.error(res.message || "No roles found for this city");
        }
      } catch (error) {
        setRoles([]);
        toast.error(error.message || "Error fetching roles");
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, [formData.cityId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "cityId") {
      setFormData((prev) => ({ ...prev, roleId: "" }));
    }
  };

  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.email.trim()) errors.email = "Email is required.";
    // password is optional on update → only validate if provided
    if (formData.password && formData.password.trim().length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (!formData.cityId) errors.cityId = "City is required.";
    if (!formData.roleId) errors.roleId = "Role is required.";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError({});

    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setApiError(errors);
      return;
    }

    setLoading(true);

    try {
      // Prepare payload — exclude password if empty
      const payload = {
        name: formData.name,
        email: formData.email,
        cityId: formData.cityId,
        roleId: formData.roleId,
      };

      if (formData.password.trim()) {
        payload.password = formData.password.trim();
      }

      const res = await updateMemberApi(id, payload);

      if (res.status) {
        toast.success("Member updated successfully!");
        navigate(-1); // or "/members" or wherever your list is
      } else {
        toast.error(res.message || "Failed to update member");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loadingCities || loadingMember) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-medium text-gray-600">
          {loadingMember ? "Loading member data..." : "Loading cities..."}
        </p>
      </div>
    );
  }

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-4">
        <Breaker />
      </div>

      <div className="min-h-screen flex bg-gradient-to-br from-blue-50 to-gray-100 p-4">
        <div className="w-full max-w-8xl mx-auto bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:shadow-2xl">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Update Member
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Name, Email, Password */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter full name"
                />
                {apiError.name && <p className="mt-1 text-sm text-red-600">{apiError.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter email"
                />
                {apiError.email && <p className="mt-1 text-sm text-red-600">{apiError.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password (optional)
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Leave blank to keep current"
                />
                {apiError.password && <p className="mt-1 text-sm text-red-600">{apiError.password}</p>}
              </div>
            </div>

            {/* Row 2: City & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="" disabled>Select a city</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {apiError.cityId && <p className="mt-1 text-sm text-red-600">{apiError.cityId}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role <span className="text-red-500">*</span>
                </label>
                <select
                  name="roleId"
                  value={formData.roleId}
                  onChange={handleChange}
                  disabled={loadingRoles || !formData.cityId}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    !formData.cityId ? "bg-gray-100 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="" disabled>
                    {loadingRoles
                      ? "Loading roles..."
                      : formData.cityId
                      ? "Select role"
                      : "Select city first"}
                  </option>
                  {roles.map((role) => (
                    <option key={role._id} value={role._id}>
                      {role.name}
                    </option>
                  ))}
                </select>
                {apiError.roleId && <p className="mt-1 text-sm text-red-600">{apiError.roleId}</p>}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                disabled={loading || loadingRoles || loadingMember}
                className="px-10 bg-gradient-to-r from-[#181e2a] to-[#232a3b] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 rounded-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Updating..." : "Update Member"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-10 bg-gray-600 hover:bg-gray-700 text-white py-3 rounded-2xl transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateMember;