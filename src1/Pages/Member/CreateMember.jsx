import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { creatMemberApi } from "../../Services/MemberApi";
import Loader from "../../compoents/Loader";
import Breaker from "../../compoents/Breaker";
import { useNavigate } from "react-router-dom";
import { getAllCitiesRoles } from "../../Services/CommonApi";
import { getAllCities } from "../../Services/CityApi";
import "/src/index.css";

const CreateMember = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    cityId: "",        // New field for selected city
    roleId: "",
  });

  const [roles, setRoles] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(false); // separate for roles
  const [loadingCities, setLoadingCities] = useState(true);
  const [apiError, setApiError] = useState({});
  const navigate = useNavigate();

  // Fetch cities on mount (once)
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoadingCities(true);
        const res = await getAllCities({
          page: 1,
          rowsPerPage: 10,
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

  // Fetch roles whenever cityId changes
  useEffect(() => {
    const fetchRoles = async () => {
      if (!formData.cityId) {
        setRoles([]); // Clear roles if no city selected
        return;
      }

      try {
        setLoadingRoles(true);
        console.log(formData.cityId);
        const res = await getAllCitiesRoles(formData.cityId);     // Pass selected city ID here

        if (res.status && res.data) {
          setRoles(res.data); // Assuming res.data is array of roles
        } else {
          toast.error(res.message || "No roles found for this city");
          setRoles([]);
        }
      } catch (error) {
        toast.error(error.message || "Error fetching roles");
        setRoles([]);
      } finally {
        setLoadingRoles(false);
      }
    };

    fetchRoles();
  }, [formData.cityId]); // Re-run when city changes

  // Handle text/select input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear role when city changes (optional - prevents invalid selection)
    if (name === "cityId") {
      setFormData((prev) => ({ ...prev, roleId: "" }));
    }
  };

  // Validate form
  const validate = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required.";
    if (!formData.email.trim()) errors.email = "Email is required.";
    if (!formData.password.trim()) errors.password = "Password is required.";
    if (!formData.cityId) errors.cityId = "City is required.";
    if (!formData.roleId) errors.roleId = "Role is required.";
    return errors;
  };

  // Submit handler
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
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        cityId: formData.cityId,
        roleId: formData.roleId,
      };

      const res = await creatMemberApi(payload);

      if (res.status) {
        toast.success("Member created successfully!");
        navigate(-1); // or "/members"
      } else {
        toast.error(res.message || "Failed to create member");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (loadingCities) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p className="text-lg font-medium text-gray-600">Loading cities...</p>
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
            Create New Member
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Row 1: Name, Email, Password */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Name */}
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

              {/* Email */}
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

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter password"
                />
                {apiError.password && <p className="mt-1 text-sm text-red-600">{apiError.password}</p>}
              </div>
            </div>

            {/* Row 2: City & Role */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* City */}
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
                  <option value="" selected disabled>Select a city</option>
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
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${!formData.cityId ? "bg-gray-100 cursor-not-allowed" : ""
                    }`}
                >
                  <option value="" selected disabled>
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || loadingRoles}
              className="w-full md:w-auto px-10 bg-gradient-to-r from-[#181e2a] to-[#232a3b] text-white hover:scale-105 active:scale-95 transition-transform duration-500 py-3 mt-6 rounded-2xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Create Member"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateMember;